const config = require("./../config/config");

const google = require("googleapis").google;
const customSarch = google.customsearch("v1");

const googleSearchCredentials = require("./../../credentials/google-search.json");

module.exports = async content => {
  console.log(
    "> [ROBO-IMAGEM] Identifica imagem no google de acordo com as sentenças ",
    new Date().toLocaleString("pt-BR")
  );

  content.useSentences = [];
  for (const sentence of content.sentences) {
    let qtdKeywordsDownloadImage = config.qtdKeywordsDownloadImage;

    for (let keyword = 0; keyword < qtdKeywordsDownloadImage; keyword++) {
      if (sentence.keywords[keyword] === undefined) break;

      const query = `${content.searchTerm} ${sentence.keywords[keyword]}`;

      const imageLink = await fetchGoogleAndReturnImagesLinks(query);

      sentence.images = imageLink;

      console.log("> [ROBO-IMAGEM] Termo Consultado ", query);

      sentence.googleSearchQuery = query;
      content.useSentences.push(sentence);
    }
  }
};

async function fetchGoogleAndReturnImagesLinks(query) {
  const response = await customSarch.cse.list({
    auth: googleSearchCredentials.apiKey,
    cx: googleSearchCredentials.searchEngineId,
    q: query,
    searchType: "image",
    num: config.qtdImageSentence
  });

  const imagesUrl = response.data.items.map(item => {
    return item.link;
  });

  return imagesUrl;
}
