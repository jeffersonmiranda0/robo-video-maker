const gm = require("gm").subClass({ imageMagick: true });
const state = require("./state");
const spawn = require("child_process").spawn;
const path = require("path");
const rootPath = path.resolve(__dirname, "..");

async function robot() {
  const content = state.load();

  await converAllImages(content);
  await createAllSentenceImages(content);
  await createYoutubeThumbnail();
  await createAfterEffectScript(content);
  await renderVideoWithAfeterEffects();

  //   state.save(content);

  async function converAllImages(content) {
    for (
      let sentenceIndex = 0;
      sentenceIndex < content.useSentences.length;
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

  async function createAllSentenceImages(content) {
    for (
      let sentenceIndex = 0;
      sentenceIndex < content.useSentences.length;
      sentenceIndex++
    ) {
      await convertSenteceImage(
        sentenceIndex,
        content.useSentences[sentenceIndex].text
      );
    }
  }

  async function convertSenteceImage(sentenceIndex, sentenceText) {
    return new Promise((resolve, reject) => {
      const outputFile = `./src/content/${sentenceIndex}-sentence.png`;

      const templateSettings = {
        0: {
          size: "1920x400",
          gravity: "center"
        },
        1: {
          size: "1920x1080",
          gravity: "center"
        },
        2: {
          size: "800x1080",
          gravity: "west"
        },
        3: {
          size: "1920x400",
          gravity: "center"
        },
        4: {
          size: "1920x1080",
          gravity: "center"
        },
        5: {
          size: "800x1080",
          gravity: "west"
        },
        6: {
          size: "1920x400",
          gravity: "center"
        },
        7: {
          size: "1920x1080",
          gravity: "center"
        },
        8: {
          size: "800x1080",
          gravity: "west"
        },
        9: {
          size: "1920x400",
          gravity: "center"
        }
      };

      gm()
        .out("-size", templateSettings[sentenceIndex].size)
        .out("-gravity", templateSettings[sentenceIndex].gravity)
        .out("-background", "transparent")
        .out("-fill", "white")
        .out("-kerning", "-1")
        .out(`caption:${sentenceText}`)
        .write(outputFile, error => {
          if (error) {
            return reject(error);
          }
          console.log(`> sentence created: ${outputFile}`);
          resolve();
        });
    });
  }

  async function createYoutubeThumbnail() {
    return new Promise((resolve, reject) => {
      gm()
        .in("./src/content/0-converted.png")
        .write("./src/content/youtube-thumbnail.jpg", error => {
          if (error) {
            return reject(error);
          }
          console.log(`> thumbnail created`);
          resolve();
        });
    });
  }

  async function createAfterEffectScript(content) {
    await state.saveScript(content);
  }

  async function renderVideoWithAfeterEffects() {
    return new Promise((resolve, reject) => {
      const aerenderFilePath =
        "C:\\Program Files\\Adobe\\Adobe After Effects CC 2018\\Support Files\\aerender.exe";
      const templateFilePath = `${rootPath}\\templates\\2\\template.aep`;
      const destinationFilePath = `${rootPath}\\content\\output.mov`;
      console.log("> starting after effects");

      const aerender = spawn(aerenderFilePath, [
        "-comp",
        "main",
        "-project",
        templateFilePath,
        "-output",
        destinationFilePath
      ]);

      //   console.log("> templatefile", templateFilePath);
      //   console.log("> output", destinationFilePath);

      aerender.stdout.on("data", data => {
        process.stdout.write(data);
      });

      aerender.on("close", () => {
        console.log("> After Effects closed");
        resolve();
      });
    });
  }
}

module.exports = robot;
