const imageDonwloader = require("image-downloader");
const gm = require("gm").subClass({ imageMagick: true });
const state = require("./state");
const google = require("googleapis").google;
const customSarch = google.customsearch("v1");

const googleSearchCredentials = require("../credentials/google-search.json");

async function robot() {
  const content = state.load();

  // await fetchImagesofAllSentences(content);
  // await downloadAllImages(content);
  await converAllImages(content);

  //   state.save(content);

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

  async function downloadAllImages(content) {
    content.downloadedImages = [];

    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      const images = content.sentences[sentenceIndex].images;

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex];

        try {
          if (content.downloadedImages.includes(imageUrl)) {
            throw new Error("Imagen ja foi baixada");
          }

          await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
          content.downloadedImages.push(imageUrl);
          console.log("baixou imagem", imageUrl);
          break;
        } catch (e) {
          console.log("n baixou imagem", e, imageUrl);
        }
      }
    }
  }

  async function downloadAndSave(url, filename) {
    return await imageDonwloader.image({
      url: url,
      dest: `./src/content/${filename}`
    });
  }

  async function converAllImages(content) {
    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      await convertImage(sentenceIndex);
    }
  }

  async function convertImage(sentenceIndex) {
    return new Promise((resolve, reject) => {
      const inputFile = `./src/content/${sentenceIndex}-original.png[0]`;
      const outputFile = `./src/content/${sentenceIndex}-converted.png`;
      const width = 1920;
      const heigth = 1080;

      gm()
        .in(inputFile)
        .out("(")
        .out("-clone")
        .out("0")
        .out("-background", "white")
        .out("-blur", "0x9")
        .out("-resize", `${width}x${heigth}^`)
        .out(")")
        .out("(")
        .out("-clone")
        .out("0")
        .out("-background", "white")
        .out("-resize", `${width}x${heigth}`)
        .out(")")
        .out("-delete", "0")
        .out("-gravity", "center")
        .out("-compose", "over")
        .out("-composite")
        .out("-extent", `${width}x${heigth}`)
        .write(outputFile, error => {
          if (error) {
            return reject(error);
          }

          console.log(`> Image converted ${inputFile}`);
          resolve();
        });
    });
  }
}

module.exports = robot;
