const config = require("./../config/config");
const readline = require("readline-sync");
module.exports = () => {
  const prefixes = config.prefixes;
  const selectedPrefixIndex = readline.keyInSelect(
    prefixes,
    "Selecione uma opção: "
  );
  const selectedPrefixText = prefixes[selectedPrefixIndex];

  return selectedPrefixText;
};
