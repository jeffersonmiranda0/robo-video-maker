const state = require("./../state");

const inputs = {
  askAndReturnSearchTerm: require("./askAndReturnSearchTerm"),
  askAndReturnPrefix: require("./askAndReturnPrefix"),
  askAndReturnLang: require("./askAndReturnLang")
};

function robot() {
  const content = {};
  content.lang = inputs.askAndReturnLang();
  content.prefix = inputs.askAndReturnPrefix();
  content.searchTerm = inputs.askAndReturnSearchTerm();

  state.save(content);
}

module.exports = robot;
