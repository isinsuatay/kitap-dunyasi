const sortFunctions = {
    title: (a, b) => a.title.localeCompare(b.title),
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    publicationDate_newest: (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate),
    publicationDate_oldest: (a, b) => new Date(a.publicationDate) - new Date(b.publicationDate),
  };
  
  export function sortBooks(books, sortOption) {
    return [...books].sort(sortFunctions[sortOption] || (() => 0));
  }