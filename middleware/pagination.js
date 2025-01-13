function paginate(req, res, next) {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  // console.log(endIndex);
  const results = req.paginationResource.slice(startIndex, endIndex);
  const totalPages = Math.ceil(req.paginationResource.length / limitNum);

  if (
    isNaN(pageNum) ||
    isNaN(limitNum) ||
    pageNum <= 0 ||
    limitNum <= 0 ||
    pageNum > totalPages
  ) {
    return res.status(400).json({ message: "Invalid Page or List value" });
  }

  const paginatedResults = {
    results: results,
    totalPages: totalPages,
    totalResults: req.paginationResource.length,
    currentPage: pageNum,
  };

  if (pageNum < totalPages) {
    paginatedResults.next = {
      page: pageNum + 1,
      limit: limitNum,
    };
  }
  if (pageNum > 1) {
    paginatedResults.prev = {
      page: pageNum - 1,
      limit: limitNum,
    };
  }
  res.paginatedResults = paginatedResults;
  next();
}

module.exports = { paginate };
