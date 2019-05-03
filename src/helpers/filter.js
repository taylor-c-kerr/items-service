const querystring = require('querystring');
const error = new TypeError('Invalid query');

/*
  ** @param {string} string a query string that is to be parsed
*/
const equals = (string) => {
  const criteria = {};
  if (string.indexOf('=') === -1) {
    return criteria;
  }
  if (string.indexOf('\'') === -1) {
    throw error;
  }
  string = string.replace(/'/g, '');
  string = string.split('=');
  criteria[string[0]] = new RegExp(`^${string[1]}$`, 'gi');
  return criteria;
};

/*
  ** @param {string} string a query string that is to be parsed
*/
const contains = (string) => {
  const criteria = {};

  if (string.indexOf('~') === -1) {
    return criteria;
  }
  if (string.indexOf('\'') === -1) {
    throw error;
  }
  string = string.replace(/'/g, '');
  string = string.split('~');
  criteria[string[0]] = new RegExp(`.*${string[1]}.*`, 'gi');
  return criteria;
};

/*
  ** @param {string} string a query string that is to be parsed
*/
const determineQuery = (string) => {
  let query;

  if (string.indexOf('=') > -1) {
    query = equals(string);
  }
  else if (string.indexOf('~') > -1) {
    query = contains(string);
  }
  else {
    throw error;
  }
  return query;
};

/*
  ** @param {string} filterString query string from the url that is parsed and then used to query the db
*/
const filter = (filterString) => {
  filterString = querystring.unescape(filterString);
  let query = {};
  const delimiter = /%20AND%20|%20OR%20| AND | OR /gi;
  const filters = filterString.split(delimiter);
  if (filters.length > 2) {
    throw error;
  } else if (filters.length === 1) {
    query = determineQuery(filters[0]);
  } else if (filterString.indexOf(' AND ') > -1) {
    query['$and'] = [determineQuery(filters[0]), determineQuery(filters[1])];
  } else if (filterString.indexOf(' OR ') > -1) {
    query['$or'] = [determineQuery(filters[0]), determineQuery(filters[1])];
  }

  return query;
};

module.exports = filter;
