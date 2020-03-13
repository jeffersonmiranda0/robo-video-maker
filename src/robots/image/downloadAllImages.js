const imageDonwloader = require("image-downloader");
const config = require("./../config/config");

module.exports = async content => {
  console.log(
    "> [ROBO-IMAGEM] Realiza o download das imagens para o diretorio content ",
    new Date().toLocaleString("pt-BR")
  );

  content.downloadedImages = [];

  console.log(
    "> [ROBO-IMAGEM] quantidade de sentenças ",
    content.sentences.length
  );

  for (
    let sentenceIndex = 0;
    sentenceIndex < content.sentences.length;
    sentenceIndex++
  ) {
    const images = content.sentences[sentenceIndex].images;

    let limitDownloadImage = 0;
    let imageDownloader = 0;
    for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
      try {
        const imageUrl =
          images[imageIndex] === undefined ? "" : images[imageIndex];

        if (
          imageUrl === "" ||
          content.downloadedImages.includes(imageUrl) ||
          config.blackList.includes(imageUrl)
        ) {
          throw new Error(
            "> [ROBO-IMAGEM] Não utilizada imagem pois ja foi baixada anteriormente, baixar outra - " +
              imageUrl
          );
        }

        await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
        content.downloadedImages.push(imageUrl);
        console.log(
          "> [ROBO-IMAGEM] Baixou a imagem de url: ",
          imageDownloader,
          images.length,
          imageUrl
        );

        if (limitDownloadImage === imageDownloader) {
          imageDownloader = 0;
          break;
        }

        imageDownloader++;
      } catch (e) {
        console.log(imageDownloader, e);
        continue;
      }
    }
  }
};

async function downloadAndSave(url, filename) {
  return await imageDonwloader.image({
    url: url,
    dest: `./src/content/${filename}`
  });
}
