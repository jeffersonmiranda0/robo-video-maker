const readline = require("readline-sync");
const state = require("./state");

function input() {
  const content = {
    maximumSentences: 7
  };

  content.lang = "en";
  content.lang = "pt";

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();
  state.save(content);

  function askAndReturnSearchTerm() {
    return readline.question("Type a wikipedia search term: ");
  }

  function askAndReturnPrefix() {
    const prefixes = [
      "Who is",
      "What is",
      "The history of",
      "Quem e",
      "Historia de"
    ];
    const selectedPrefixIndex = readline.keyInSelect(
      prefixes,
      "Choose one option: "
    );
    const selectedPrefixText = prefixes[selectedPrefixIndex];

    return selectedPrefixText;
  }
}

module.exports = input;
