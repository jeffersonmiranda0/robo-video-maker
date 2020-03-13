const watsonApiKey = require("./../../credentials/watson.json").apikey;
const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: "2018-04-05",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/"
});

module.exports = async content => {
  console.log(
    "> [ROBO-TEXTO] Listando as Keywords de maior relevancia utilizando a API do Watson ",
    new Date().toLocaleString("pt-BR")
  );

  for (const sentence of content.sentences) {
    sentence.keywords = await fetchWatsonAndReturnKeyword(sentence.text);
  }
};

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

        let keywords = response.keywords.map(keyword => {
          if (keyword.relevance >= 0.7) {
            return keyword.text;
          }
        });

        keywords = keywords.filter(function(el) {
          return el != undefined;
        });

        resolve(keywords);
      }
    );
  });
}
