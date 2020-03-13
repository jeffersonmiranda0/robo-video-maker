const state = require("./../state");

const fetchContentFromWikipedia = require("./fetchContentFromWikipedia");
const sanitalizaContent = require("./sanitalizaContent");
const breakContentIntoSentences = require("./breakContentIntoSentences");
const limitMaximumSentences = require("./limitMaximumSentences");
const fetchKeywordsOfAllSentences = require("./fetchKeywordsOfAllSentences");

module.exports = async () => {
  console.log(
    "> [ROBO-TEXTO] Iniciando o Robo de Texto ",
    new Date().toLocaleString("pt-BR")
  );

  const content = state.load();
  /**
   * Identifica o termo buscado na wikipedia utilizando a api do algoritmia
   */
  await fetchContentFromWikipedia(content);
  sanitalizaContent(content);
  breakContentIntoSentences(content);
  limitMaximumSentences(content);
  await fetchKeywordsOfAllSentences(content);

  state.save(content);
};
