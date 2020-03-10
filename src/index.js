const robots = {
  userInput: require("./robots/user-inputs"),
  text: require("./robots/text")
};

async function start() {
  const content = {
    maximumSentences: 10
  };

  content.lang = "en";
  // content.lang = "pt";
  robots.userInput(content);
  await robots.text(content);

  console.log(JSON.stringify(content, null, 4));
}

start();
