import axios from "axios";

const BASE_CURRENCY = "USD";
const API_URL = `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`;
const CACHE_TIME = 30 * 60 * 1000; // 30 dakika önbellek süresi

// Döviz kuru verilerini API'den alır
export async function fetchExchangeRates() {
  try {
    const response = await axios.get(API_URL);
    const rates = response.data.rates;

    if (!rates) {
      console.error("Döviz kuru verisi API'den alınamadı!");
      return null;
    }

    // Veriyi localStorage'a kaydet
    localStorage.setItem("exchangeRates", JSON.stringify({ rates, timestamp: Date.now() }));
    console.log("Döviz Kurları Alındı:", rates); // Debug log
    return rates;
  } catch (error) {
    console.error("Döviz kuru verileri alınamadı!", error);
    return null;
  }
}

// LocalStorage'tan döviz kurlarını alır, önbellek süresi kontrolü yapar
export function getStoredExchangeRates() {
  const data = localStorage.getItem("exchangeRates");
  if (!data) return null;

  const parsedData = JSON.parse(data);
  const cacheExpired = Date.now() - parsedData.timestamp > CACHE_TIME;

  // Eğer önbellek süresi dolmuşsa veriyi siler ve güncellenmesini bekler
  if (cacheExpired) {
    localStorage.removeItem("exchangeRates");
    console.warn("Döviz kuru verisi önbellekteki süresini doldurdu, güncelleme gerekiyor.");
    return null;
  }

  return parsedData.rates;
}

// Fiyat dönüşümü işlemi
export const convertPrice = (price, bookCurrency, selectedCurrency, exchangeRates) => {
  if (!exchangeRates || !exchangeRates[selectedCurrency] || !exchangeRates[bookCurrency]) {
    console.warn("Döviz kurları eksik veya geçersiz.");
    return price; // Döviz kuru verisi yoksa, fiyatı değiştirme
  }

  // Fiyat dönüşümü yapılır
  const baseRate = exchangeRates[bookCurrency];
  const targetRate = exchangeRates[selectedCurrency];

  if (!baseRate || !targetRate) {
    return price; // Geçersiz döviz kuru durumunda fiyatı değiştirme
  }

  // Fiyat dönüşümünü yap
  return ((price / baseRate) * targetRate).toFixed(2); // Dönüştürülmüş fiyat
};