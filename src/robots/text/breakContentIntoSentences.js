const sentenceBoundaryDetection = require("sbd");

module.exports = content => {
  content.sentences = [];
  const sentences = sentenceBoundaryDetection.sentences(
    content.sourceContentSanitized
  );

  sentences.forEach(sentence => {
    content.sentences.push({
      text: sentence,
      keywords: [],
      images: []
    });
  });
};
