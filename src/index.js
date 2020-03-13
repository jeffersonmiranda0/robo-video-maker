const robots = {
  state: require("./robots/state"),
  input: require("./robots/input"),
  text: require("./robots/text"),
  image: require("./robots/image"),
  video: require("./robots/video")
};

async function start() {
  console.log(
    "> [0] Iniciando robo VIDEO-MAKER ",
    new Date().toLocaleString("pt-BR")
  );

  // robots.input();
  // await robots.text();
  await robots.image();
  await robots.video();

  const content = robots.state.load();
  // console.dir(content, { depth: null });
}

start();
