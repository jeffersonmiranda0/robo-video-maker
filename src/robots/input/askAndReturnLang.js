const config = require("./../config/config");
const readline = require("readline-sync");

module.exports = () => {
  const langs = config.lengs;

  const selectedPrefixLangIndex = readline.keyInSelect(
    langs,
    "Informe qual linguagem deseja utilizar: "
  );
  const langSelected = langs[selectedPrefixLangIndex];

  return langSelected;
};
