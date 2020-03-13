const readline = require("readline-sync");
module.exports = () => {
  return readline.question("Informe um termo para a busca: ");
};
