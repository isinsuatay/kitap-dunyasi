import { getBooksFromLocalStorage } from "./localStorage";

export function getFiltersFromLocalStorage() {
  try {
    const filters = JSON.parse(localStorage.getItem("filters")) || {
      category: "",
      language: "",
      sortOption: "name",
    };
    return filters;
  } catch (error) {
    console.error("Filtreler okunurken hata oluştu:", error);
    return { category: "", language: "", sortOption: "name" };
  }
}

export function saveFiltersToLocalStorage(filters) {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Filtreler kaydedilirken hata oluştu:", error);
  }
}
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

export function getFilteredBooksFromLocalStorage(filters) {
  try {
    let books = getBooksFromLocalStorage();

    if (filters.category) {
      books = books.filter(book => book.category?.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.language) {
      books = books.filter(book => book.language?.toLowerCase() === filters.language.toLowerCase());
    }

    switch (filters.sortOption) {
      case "name":
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "price":
        books.sort((a, b) => a.price - b.price);
        break;
      case "publicationDate":
        books.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
        break;
    }

    return books;
  } catch (error) {
    console.error("Filtrelenmiş kitaplar alınırken hata oluştu:", error);
    return [];
  }
}