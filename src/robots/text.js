const algorithmia = require("algorithmia");
const algorithmiaApiKey = require("./../credentials/algorithmia.json").apiKey;
const sentenceBoundaryDetection = require("sbd");

async function robot(content) {
  await fetchContentFromWikipedia(content);
  sanitalizaContent(content);
  breakContentIntoSentences(content);

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaReponse = await wikipediaAlgorithm.pipe(content.searchTerm);
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
}

module.exports = robot;
