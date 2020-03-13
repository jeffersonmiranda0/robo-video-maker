const config = require("./../config/config");

module.exports = content => {
  content.sentences = content.sentences.slice(0, config.maximumSentences);
};
