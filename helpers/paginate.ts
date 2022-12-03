const paginate = (totalItems: number, page: number, limit: number) => {
  //console.log(page)
  const pageNum = Number(page) || 1;
  const pagesTotal = Math.ceil((Number(totalItems) ? Number(totalItems) : 0) / limit);
  const currentPage = Number(pageNum) && Number(pageNum) <= pagesTotal && Number(pageNum) > 0 && Number(pageNum) % 1 === 0 ? Number(pageNum) : 1;

  return {
    total: pagesTotal,
    current: currentPage,
  };
}

export default paginate;