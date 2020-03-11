const state = require("./state");
const google = require("googleapis").google;
const customSarch = google.customsearch("v1");

const googleSearchCredentials = require("../credentials/google-search.json");

async function robot() {
  const content = state.load();

  await fetchImagesofAllSentences(content);

  state.save(content);

  async function fetchImagesofAllSentences(content) {
    for (const sentence of content.sentences) {
      const query = `${content.searchTerm} ${sentence.keywords[0]}`;
      sentence.images = await fetchGoogleAndReturnImagesLinks(query);
      sentence.googleSearchQuery = query;
    }
  }

  async function fetchGoogleAndReturnImagesLinks(query) {
    const response = await customSarch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: "image",
      num: 2
    });

    const imagesUrl = response.data.items.map(item => {
      return item.link;
    });

    return imagesUrl;
  }
}

module.exports = robot;