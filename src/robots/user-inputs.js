const readline = require("readline-sync");
function userInputs(content) {
  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

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

module.exports = userInputs;
