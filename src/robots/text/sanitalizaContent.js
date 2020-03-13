module.exports = content => {
  console.log(
    "> [ROBO-TEXTO] Sanitaliza todo o texto, removendo espaços indesejados, e informações irelevantes ",
    new Date().toLocaleString("pt-BR")
  );

  const withoutBlankLinesAndmarkDown = removeBlankLinesAndMarkDown(
    content.sourceContentOriginal
  );

  const withoutDateInParentheses = removeDatesInParentheses(
    withoutBlankLinesAndmarkDown
  );

  content.sourceContentSanitized = withoutDateInParentheses;

  function removeBlankLinesAndMarkDown(text) {
    const allLines = text.split("\n");

    const withoutBlankLinesAndmarkDown = allLines.filter(line => {
      if (line.trim().length === 0 || line.trim().startsWith("=")) {
        return false;
      }

      return true;
    });

    return withoutBlankLinesAndmarkDown.join(" ");
  }

  function removeDatesInParentheses(text) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, "").replace(/ /g, " ");
  }
};
