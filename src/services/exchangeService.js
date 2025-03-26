import axios from "axios";

const BASE_CURRENCY = "USD";
const API_URL = `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`;
const CACHE_TIME = 30 * 60 * 1000; // 30 dakika önbellek süresi

// Döviz kuru verilerini API'den alır ve önbelleğe kaydeder
export async function fetchExchangeRates() {
  try {
    const response = await axios.get(API_URL);
    const rates = response.data.rates;

    if (!rates) {
      console.error("Döviz kuru verisi API'den alınamadı!");
      return null;
    }

    // LocalStorage'a kaydet
    localStorage.setItem("exchangeRates", JSON.stringify({ rates, timestamp: Date.now() }));
    console.log("Döviz Kurları Alındı:", rates); // Debug log

    return rates;
  } catch (error) {
    console.error("Döviz kuru verileri alınamadı!", error);
    return null;
  }
}

// Önceden kaydedilmiş döviz kurlarını getirir, süresi dolmuşsa güncelleme gerektirir
export function getStoredExchangeRates() {
  try {
    const data = localStorage.getItem("exchangeRates");
    if (!data) return null;

    const parsedData = JSON.parse(data);
    const cacheExpired = Date.now() - parsedData.timestamp > CACHE_TIME;

    if (cacheExpired) {
      localStorage.removeItem("exchangeRates");
      console.warn("Döviz kuru verisi önbellekteki süresini doldurdu, güncelleme gerekiyor.");
      return null;
    }

    return parsedData.rates;
  } catch (error) {
    console.error("Döviz kuru verisi okunurken hata oluştu:", error);
    return null;
  }
}

// Fiyat dönüşümü işlemi
export const convertPrice = (price, bookCurrency, selectedCurrency, exchangeRates) => {
  if (!price || isNaN(price)) {
    console.warn("Geçersiz fiyat değeri:", price);
    return "0.00";
  }

  // Eğer seçilen para birimi ile kitabın para birimi aynıysa dönüşüm yapma
  if (bookCurrency === selectedCurrency) {
    return price.toFixed(2);
  }

  if (!exchangeRates || !exchangeRates[selectedCurrency] || !exchangeRates[bookCurrency]) {
    console.warn("Döviz kurları eksik veya geçersiz.");
    return price.toFixed(2); // Döviz kuru verisi yoksa, fiyatı değiştirme
  }

  const baseRate = exchangeRates[bookCurrency];
  const targetRate = exchangeRates[selectedCurrency];

  if (!baseRate || !targetRate) {
    console.warn("Eksik döviz kuru:", bookCurrency, "veya", selectedCurrency);
    return price.toFixed(2);
  }

  // Fiyat dönüşümünü yap
  return ((price / baseRate) * targetRate).toFixed(2);
};