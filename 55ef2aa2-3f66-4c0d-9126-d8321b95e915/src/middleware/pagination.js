const paginationMiddleware = () => {
    return (req, res, next) => {
      const pageSize = parseInt(req.query.pageSize) || 4;
      const pageNumber = parseInt(req.query.page) || 1;

      req.pagination = {
        page: pageNumber,
        limit: pageSize
      };
  
      next();
    };
  };

export default paginationMiddleware;