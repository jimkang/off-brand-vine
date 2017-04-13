const maxPageSize = 10;

// A "page" here is not a literal HTML web page.
function addCellsToPages({cellsToAdd, currentLastPage}) {
  if (!currentLastPage) {
    currentLastPage = {
      index: 0,
      cells: []
    };
  }
  var newLastPageIndex = currentLastPage.index;
  var currentPage = currentLastPage;
  var updatedPages = [currentPage];

  cellsToAdd.forEach(addToPage);

  function addToPage(cell) {
    if (currentPage.cells.length >= maxPageSize) {
      newLastPageIndex += 1;
      currentPage = {index: newLastPageIndex, cells: []};
      updatedPages.push(currentPage);
    }
    currentPage.cells.push(cell);
  }

  return {
    newLastPageIndex: newLastPageIndex,
    updatedPages: updatedPages    
  };
}

module.exports = addCellsToPages;
