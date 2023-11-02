const deriveTermId = (term, allIds) => {
  const prefix = term.replace(/\s+/g,"_");
  const regex = new RegExp(`(${prefix})(_([a-zA-Z0-9]+)*[0-9]*)$`);
  const occurrences = allIds.filter(function(element) {
    return element.match(regex);
  }).length;
  return `${prefix}_${occurrences + 1}`;
}

module.exports = {
  deriveTermId,
};
