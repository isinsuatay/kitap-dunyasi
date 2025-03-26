const BOOKS_KEY = "books";
const CATEGORIES_KEY = "categories";
const USERS_KEY = "users";
const FAVORITES_KEY = "favorites";
const REVIEWS_KEY = "reviews";
const FILTERS_KEY = "filters";

const DEFAULT_VALUES = {
  [BOOKS_KEY]: "/books.json",
  [CATEGORIES_KEY]: "/categories.json",
  [USERS_KEY]: [],
  [FAVORITES_KEY]: {},
  [ REVIEWS_KEY]: {},
  [FILTERS_KEY]: { category: "", language: "", sortOption: "name" },
};

// Asenkron veri çekme fonksiyonu
async function fetchJSON(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP hatası: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`${file} dosyası yüklenirken hata oluştu:`, error);
    return [];
  }
}

//  LocalStorage başlatma
export async function initializeLocalStorage() {
  try {
    for (const key in DEFAULT_VALUES) {
      if (!localStorage.getItem(key)) {
        const value = typeof DEFAULT_VALUES[key] === "string" 
          ? await fetchJSON(DEFAULT_VALUES[key]) 
          : DEFAULT_VALUES[key];
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  } catch (error) {
    console.error("LocalStorage başlatılırken hata oluştu:", error);
  }
}

//  Kitap Yönetimi
export function getBooksFromLocalStorage() {
  try {
    const books = localStorage.getItem(BOOKS_KEY);
    return books ? JSON.parse(books) : [];
  } catch (error) {
    console.error("LocalStorage okunurken hata oluştu:", error);
    return [];
  }
}

export function saveBooksToLocalStorage(books) {
  try {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  } catch (error) {
    console.error("LocalStorage'a yazılırken hata oluştu:", error);
  }
}

export function addBookToLocalStorage(book) {
  try {
    const books = getBooksFromLocalStorage();
    books.push(book);
    saveBooksToLocalStorage(books);
  } catch (error) {
    console.error("Kitap eklenirken hata oluştu:", error);
  }
}

export function updateBookInLocalStorage(updatedBook) {
  try {
    const books = getBooksFromLocalStorage();
    const index = books.findIndex((book) => book.id === updatedBook.id);
    if (index !== -1) {
      books[index] = updatedBook;
      saveBooksToLocalStorage(books);
    }
  } catch (error) {
    console.error("Kitap güncellenirken hata oluştu:", error);
  }
}

export function deleteBookFromLocalStorage(bookId) {
  try {
    const books = getBooksFromLocalStorage().filter((book) => book.id !== bookId);
    saveBooksToLocalStorage(books);
  } catch (error) {
    console.error("Kitap silinirken hata oluştu:", error);
  }
}

//  Kullanıcı Yönetimi
export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

//  Favori Kitap Yönetimi (Kullanıcı Bazlı)
export function getFavorites(userId) {
  try {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
    return Array.isArray(favorites[userId]) ? favorites[userId] : [];
  } catch (error) {
    console.error("Favori kitaplar okunurken hata oluştu:", error);
    return [];
  }
}

export function addFavorite(userId, bookId) {
  const favorites = getFavorites(userId);
  if (!favorites.includes(bookId)) {
    favorites.push(bookId);
    const allFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
    allFavorites[userId] = favorites;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(allFavorites));
  }
}

// Yorum Yönetimi (Kullanıcı Bazlı)
export function getReviews(bookId) {
  const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || {};
  return reviews[bookId] || [];
}
export function addReview(bookId, userId, review) {
  try {
    // 'reviews' anahtarındaki mevcut yorumları alıyoruz
    const reviews = JSON.parse(localStorage.getItem("reviews")) || {};

    const users = getUsers();
    const user = users.find((u) => u.id === userId);

    // Eğer kitap için yorum yoksa, boş bir dizi başlatıyoruz
    if (!reviews[bookId]) {
      reviews[bookId] = [];
    }

    const formattedDate = new Date().toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Yeni yorumu ekliyoruz
    reviews[bookId].push({
      userId,
      username: user?.username || "Bilinmeyen",
      rating: review.rating,
      text: review.text,
      date: formattedDate,
    });

    // Yorumları 'reviews' anahtarına kaydediyoruz
    localStorage.setItem("reviews", JSON.stringify(reviews));

  } catch (error) {
    console.error("Yorum eklenirken hata oluştu:", error);
  }
}

// **Filtreleme İşlevleri** (Kategori, Dilz ve Sıralama)
export function getFiltersFromLocalStorage() {
  try {
    const filters = localStorage.getItem(FILTERS_KEY);
    return filters ? JSON.parse(filters) : { category: "", language: "", sortOption: "name" };
  } catch (error) {
    console.error("LocalStorage'dan filtreler okunurken hata oluştu:", error);
    return { category: "", language: "", sortOption: "name" };
  }
}

export function saveFiltersToLocalStorage(filters) {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Filtreler LocalStorage'a kaydedilirken hata oluştu:", error);
  }
}
export function getCategoriesFromLocalStorage() {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
  } catch (error) {
    console.error("LocalStorage'dan kategoriler okunurken hata oluştu:", error);
    return [];
  }
}

//  **Filtrelenmiş Kitapları Getirme**
export function getFilteredBooksFromLocalStorage(filters) {
  try {
    let books = getBooksFromLocalStorage();
    
    if (filters.category) {
      books = books.filter((book) => book.category === filters.category);
    }
    
    if (filters.language) {
      books = books.filter((book) => book.language === filters.language);
    }

    if (filters.sortOption === "name") {
      books.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortOption === "price") {
      books.sort((a, b) => a.price - b.price);
    } else if (filters.sortOption === "publicationDate") {
      books.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
    }

    return books;
  } catch (error) {
    console.error("Filtrelenmiş kitaplar alınırken hata oluştu:", error);
    return [];
  }
}

// Döviz kuru verilerini almak için örnek fonksiyon
async function fetchExchangeRates() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();
    return data.rates; // Döviz kurlarını döndürüyoruz
  } catch (error) {
    console.error("Döviz kuru verisi alınırken hata oluştu:", error);
    return null;
  }
}

// Fiyatı seçilen para birimine dönüştüren fonksiyon
export function convertPrice(price, fromCurrency, toCurrency, rates) {
  if (!rates || !rates[fromCurrency] || !rates[toCurrency]) {
    console.error("Geçersiz döviz kuru verisi.");
    return price;
  }
  
  // USD'den hedef para birimine dönüşüm
  const priceInUSD = price / rates[fromCurrency];
  const convertedPrice = priceInUSD * rates[toCurrency];
  
  return convertedPrice;
}