<!-- AddBook.vue -->
<template>
  <div class="add-book">
    <div class="wizard">
      <!-- 1. ADIM: Kitap Bilgileri -->
      <div v-if="step === 1">
        <h2>Kitap Bilgileri</h2>
        <input v-model="book.title" placeholder="Kitap Adı" required />
        <input v-model="book.author" placeholder="Yazar" required />
        
        <!-- ISBN Girişi -->
        <div>
          <input v-model="book.isbn" placeholder="ISBN (13 haneli)" required maxlength="13" />
          <p class="info-text">Kitabınızın ISBN numarasını 13 haneli olarak giriniz. ISBN, kitapların benzersiz kimliğidir.</p>
        </div>
        
        <!-- Sayfa Sayısı -->
        <div>
          <input v-model.number="book.pageCount" placeholder="Sayfa Sayısı" type="number" required />
          <p class="info-text">Kitabın toplam sayfa sayısını giriniz. Örneğin: 350.</p>
        </div>
        
        <!-- Basım Tarihi -->
        <div>
          <input v-model="book.publishedDate" placeholder="Basım Tarihi" type="date" required />
          <p class="info-text">Kitabın basım tarihini seçiniz. Bu tarih, kitabın ilk yayımlandığı tarihtir.</p>
        </div>

        <!-- Kategori Seçimi -->
        <select v-model="book.category">
          <option disabled value="">Kategori Seçiniz</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- 2. ADIM: Görsel Yükleme -->
      <div v-if="step === 2">
        <h2>Görsel Yükleme</h2>
        <input type="file" @change="handleImageUpload" />
        <img v-if="book.image" :src="book.image" alt="Kitap Görseli" />
      </div>

      <!-- 3. ADIM: Fiyat Bilgisi -->
      <div v-if="step === 3">
        <h2>Fiyat Bilgisi</h2>
        <input v-model.number="book.price" placeholder="Fiyat" type="number" required />
        <select v-model="book.currency">
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
        <p>USD Karşılığı: {{ convertedPrice }}</p>
      </div>

      <!-- 4. ADIM: Kitap Özeti -->
      <div v-if="step === 4">
        <h2>Özet</h2>
        <textarea v-model="book.summary"></textarea>
      </div>

      <!-- BUTONLAR -->
      <div class="buttons">
        <button @click="prevStep" v-if="step > 1">Geri</button>
        <button @click="nextStep" v-if="step < 4">İleri</button>
        <button @click="saveBook" v-if="step === 4">Kaydet</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; 
import { getBooksFromLocalStorage, addBookToLocalStorage } from "@/utils/localStorage";

export default {
  data() {
    return {
      step: 1,
      book: {
        title: "",
        author: "",
        isbn: "",
        pageCount: 0,
        publishedDate: "",
        category: "",
        image: "",
        price: 0,
        currency: "TRY",
        summary: "",
      },
      categories: [],
      currencies: ["TRY", "USD", "EUR"],
      exchangeRates: { USD: 1, EUR: 1 },
    };
  },
  computed: {
    convertedPrice() {
      return (this.book.price / this.exchangeRates[this.book.currency]).toFixed(2);
    }
  },
  methods: {
    nextStep() {
      if (this.validateStep()) {
        this.step++;
      }
    },
    prevStep() {
      this.step--;
    },
    validateStep() {
      if (this.step === 1) {
        if (!this.book.title.trim() || !this.book.author.trim() || !this.book.isbn.trim()) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Lütfen kitap bilgilerini eksiksiz doldurun.',
          });
          return false;
        }
        if (!this.categories.includes(this.book.category)) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Lütfen geçerli bir kategori seçin.',
          });
          return false;
        }
        if (this.book.pageCount <= 0) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Lütfen geçerli bir sayfa sayısı girin.',
          });
          return false;
        }
        if (!this.book.publishedDate) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Lütfen geçerli bir basım tarihi girin.',
          });
          return false;
        }
        // ISBN doğrulama
        if (this.book.isbn.length !== 13) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'ISBN numarası 13 haneli olmalıdır.',
          });
          return false;
        }
      }
      if (this.step === 3 && (!this.book.price || this.book.price <= 0)) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Lütfen geçerli bir fiyat girin.',
        });
        return false;
      }
      return true;
    },
    handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    this.book.image = reader.result; // Base64 formatında kaydet
  };
  reader.readAsDataURL(file);
},
    saveBook() {
  if (!this.book.image) {
    Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: 'Lütfen bir kitap görseli yükleyin.',
    });
    return;
  }

  addBookToLocalStorage(this.book);
  
  Swal.fire({
    icon: 'success',
    title: 'Başarılı',
    text: 'Kitap başarıyla kaydedildi!',
  }).then(() => {
    this.$router.push("/");
  });
},
    async fetchExchangeRates() {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/TRY");
        const data = await response.json();
        this.exchangeRates.USD = data.rates.USD;
        this.exchangeRates.EUR = data.rates.EUR;
      } catch (error) {
        console.error("Döviz kurları alınamadı", error);
      }
    },
    async loadCategories() {
      const books = await getBooksFromLocalStorage();
      this.categories = [...new Set(books.map((book) => book.category))];
    }
  },
  async mounted() {
    await this.fetchExchangeRates();
    await this.loadCategories();
  }
};
</script>

<style scoped>
@import "@/styles/addBook.scss";

.info-text {
  font-size: 0.9rem;
  color: #6c757d;
}
</style>