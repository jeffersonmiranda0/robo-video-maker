const algorithmia = require("algorithmia");
const algorithmiaApiKey = require("./../../credentials/algorithmia.json")
  .apiKey;

/**
 * API RESPONSAVEL POR BUSCAR CONTEÚDO DA WIKIPEDIA
 */
module.exports = async content => {
  console.log(
    "> [ROBO-TEXTO] Consultando na Wikipedia utilizando o Algorithmia ",
    new Date().toLocaleString("pt-BR")
  );

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
};
