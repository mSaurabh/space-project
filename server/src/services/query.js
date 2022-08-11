const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;

  //If on page 1 we don't want to skip so
  const skip = (page - 1) * limit;

  return { skip, limit };
}

module.exports = {
  getPagination
};