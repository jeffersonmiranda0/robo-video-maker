const algorithmia = require("algorithmia");
const algorithmiaApiKey = require("./../credentials/algorithmia.json").apiKey;
const sentenceBoundaryDetection = require("sbd");

const watsonApiKey = require("../credentials/watson.json").apikey;
const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: "2018-04-05",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/"
});

async function robot(content) {
  await fetchContentFromWikipedia(content);
  sanitalizaContent(content);
  breakContentIntoSentences(content);
  limitMaximumSentences(content);
  await fetchKeywordsOfAllSentences(content);

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaReponse = await wikipediaAlgorithm.pipe({
      lang: content.lang,
      articleName: content.searchTerm
    });
    const wikipediaContent = wikipediaReponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
  }

  function sanitalizaContent(content) {
    const withoutBlankLinesAndmarkDown = removeBlankLinesAndMarkDown(
      content.sourceContentOriginal
    );

    const withoutDateInParentheses = removeDatesInParentheses(
      withoutBlankLinesAndmarkDown
    );

    content.sourceContentSanitized = withoutDateInParentheses;

    function removeBlankLinesAndMarkDown(text) {
      const allLines = text.split("\n");

      const withoutBlankLinesAndmarkDown = allLines.filter(line => {
        if (line.trim().length === 0 || line.trim().startsWith("=")) {
          return false;
        }

        return true;
      });

      return withoutBlankLinesAndmarkDown.join(" ");
    }

    function removeDatesInParentheses(text) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, "").replace(/ /g, " ");
    }
  }

  function breakContentIntoSentences(content) {
    content.sentences = [];
    const sentences = sentenceBoundaryDetection.sentences(
      content.sourceContentSanitized
    );

    sentences.forEach(sentence => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        imagens: []
      });
    });
  }

  function limitMaximumSentences(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences);
  }

  async function fetchKeywordsOfAllSentences(content) {
    for (const sentence of content.sentences) {
      sentence.keywords = await fetchWatsonAndReturnKeyword(sentence.text);
    }
  }

  async function fetchWatsonAndReturnKeyword(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze(
        {
          text: sentence,
          features: {
            keywords: {}
          }
        },
        (error, response) => {
          if (error) {
            throw error;
          }

          const keywords = response.keywords.map(keyword => {
            return keyword.text;
          });

          resolve(keywords);
        }
      );
    });
  }
}

module.exports = robot;
