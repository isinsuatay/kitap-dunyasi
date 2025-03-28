export function applyFilters(books, { isFree, minPages, maxPages, category, language, searchQuery }) {
    return books.filter((book) => {
      if (isFree && book.price > 0) return false; 
      if (minPages && book.pageCount < minPages) return false;
      if (maxPages && book.pageCount > maxPages) return false;
      if (category && book.category?.toLowerCase() !== category.toLowerCase()) return false;
      if (language && book.language?.toLowerCase() !== language.toLowerCase()) return false;
      if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }