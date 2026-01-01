function isValidTeamName(name) {
  return typeof name === "string"
    && name.trim().length >= 3
    && name.trim().length <= 50;
}

module.exports = { isValidTeamName };
