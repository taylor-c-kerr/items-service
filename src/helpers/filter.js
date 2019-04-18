const equals = (string) => {
  let criteria = {};
  if (string.indexOf('=') === -1) {
    return criteria
  }
  string = string.split('=');
  criteria[string[0]] = string[1];
  return criteria;
}

module.exports = {
  equals
}