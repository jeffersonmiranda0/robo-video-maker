const state = require("./../state");

const fetchImagesofAllSentences = require("./fetchImagesofAllSentences");
const downloadAllImages = require("./downloadAllImages");

module.exports = async () => {
  console.log(
    "> [ROBO-IMAGEM] Iniciando Robo de busca de Imagens ",
    new Date().toLocaleString("pt-BR")
  );

  const content = state.load();

  await fetchImagesofAllSentences(content);
  await downloadAllImages(content);

  state.save(content);
};
