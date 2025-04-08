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
          <input
            v-model="book.isbn"
            placeholder="ISBN (13 haneli)"
            required
            maxlength="13"
          />
          <p class="info-text">
            Kitabınızın ISBN numarasını 13 haneli olarak giriniz. ISBN,
            kitapların benzersiz kimliğidir.
          </p>
        </div>

        <!-- Sayfa Sayısı -->
        <div>
          <input
            v-model.number="book.pageCount"
            placeholder="Sayfa Sayısı"
            type="number"
            required
          />
          <p class="info-text">
            Kitabın toplam sayfa sayısını giriniz. Örneğin: 350.
          </p>
        </div>

        <!-- Basım Tarihi -->
        <div>
          <input
            v-model="book.publicationDate"
            placeholder="Basım Tarihi"
            type="date"
            required
          />
          <p class="info-text">
            Kitabın basım tarihini seçiniz. Bu tarih, kitabın ilk yayımlandığı
            tarihtir.
          </p>
        </div>

        <!-- Kategori Seçimi -->
        <select v-model="book.category">
          <option disabled value="">Kategori Seçiniz</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <!-- 2. ADIM: Görsel Yükleme -->
      <div v-if="step === 2">
        <h2>Görsel Yükleme</h2>
        <input type="file" @change="handleImageUpload" />

        <!-- Resim Yüklendiyse Göster ve Silme Butonu Ekle -->
        <div v-if="book.cover">
          <img :src="book.cover" alt="Kitap Görseli" />
          <button @click="removeImage" class="remove-image-btn">
            Resmi Sil
          </button>
        </div>
      </div>

      <!-- 3. ADIM: Fiyat Bilgisi -->
      <div v-if="step === 3">
        <h2>Fiyat Bilgisi</h2>
        <label>
          <input
            type="checkbox"
            v-model="book.isFree"
            @change="toggleFreeBook"
          />
          Bu kitabı bedava olarak yayınlamak istiyorum
        </label>

        <input
          v-model.number="book.price"
          placeholder="Fiyat"
          type="number"
          :disabled="book.isFree"
          required
        />
        <!-- Para birimi seçimi -->
        <select v-model="book.currency">
          <option
            v-for="(rate, currency) in exchangeRates"
            :key="currency"
            :value="currency"
          >
            {{ currency }}
          </option>
        </select>

        <p v-if="convertedPrice">
          Seçilen para birimine göre fiyat:
          <strong>{{ convertedPrice }} {{ selectedCurrency }}</strong>
        </p>
      </div>

      <!-- 4. ADIM: Kitap Özeti -->
      <div v-if="step === 4">
        <h2>Kitap Özeti</h2>
        <textarea
          v-model="book.description"
          placeholder="Kitap özeti giriniz..."
          rows="10"
          required
        ></textarea>
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
import Swal from "sweetalert2";
import { addBookToLocalStorage } from "@/utils/localStorage";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      step: 1,
      book: {
        id: null,
        title: "",
        author: "",
        isbn: "",
        pageCount: 0,
        publicationDate: "",
        category: "",
        cover: "",
        price: 0,
        currency: "USD",
        description: "",
        addedBy: null,
      },
      categories: [],
    };
  },
  computed: {
  ...mapState("user", ["user"]),
  ...mapState("currency", ["selectedCurrency", "exchangeRates"]),
  ...mapGetters("currency", ["convertPrice"]),

  convertedPrice() {
    return this.convertPrice(this.book.price, this.book.currency);
  },
  },
  methods: {
    ...mapActions("currency", ["fetchExchangeRates"]),

    nextStep() {
      if (this.validateStep()) {
        this.step++;
      }
    },
    prevStep() {
      if (this.step === 2 && !this.book.title.trim()) {
        this.showError("Hata", "Kitap adı gereklidir.");
        return;
      }
      this.step--;
    },
    validateStep() {
      // 1. ADIM: Kitap Bilgileri Doğrulama
      if (this.step === 1) {
        if (
          !this.book.title.trim() ||
          !this.book.author.trim() ||
          !this.book.isbn.trim()
        ) {
          this.showError("Hata", "Lütfen kitap bilgilerini eksiksiz doldurun.");
          return false;
        }
        if (!this.categories.includes(this.book.category)) {
          this.showError("Hata", "Lütfen geçerli bir kategori seçin.");
          return false;
        }
        if (this.book.pageCount <= 0) {
          this.showError("Hata", "Lütfen geçerli bir sayfa sayısı girin.");
          return false;
        }
        if (!this.book.publicationDate) {
          this.showError("Hata", "Lütfen geçerli bir basım tarihi girin.");
          return false;
        }
        // ISBN doğrulaması (13 haneli rakam)
        if (!/^\d{13}$/.test(this.book.isbn)) {
          this.showError(
            "Hata",
            "ISBN numarası yalnızca 13 haneli rakamlardan oluşmalıdır."
          );
          return false;
        }
      }

      // 3. ADIM: Fiyat Bilgisi Doğrulama
      if (
        this.step === 3 &&
        !this.book.isFree &&
        (!this.book.price || this.book.price <= 0)
      ) {
        this.showError("Hata", "Lütfen geçerli bir fiyat girin.");
        return false;
      }
      return true;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.book.cover = reader.result; // Base64 formatında kaydediyor
        console.log("Yüklenen Resim (Base64):", this.book.cover);
      };
      reader.readAsDataURL(file);
    },
    // Uyarı gösteren yardımcı fonksiyon
    showError(title, text) {
      Swal.fire({ icon: "error", title, text });
    },

    saveBook() {
      if (!this.book.description || this.book.description.trim() === "") {
    this.showError("Hata", "Lütfen kitap özeti giriniz.");
    return;
  }
      if (!this.book.id) {
        this.book.id = Date.now().toString();
      }
      // addedBy kontrolü
      this.book.addedBy = this.user && this.user.id ? this.user.id : "anonim";

      addBookToLocalStorage(this.book);

      Swal.fire({
        icon: "success",
        title: "Başarılı",
        text: "Kitap başarıyla kaydedildi!",
      }).then(() => {
        this.$router.push("/");
      });
    },
    async loadCategories() {
      const storedCategories = localStorage.getItem("categories");
      this.categories = storedCategories
        ? JSON.parse(storedCategories)
        : ["Roman", "Bilim", "Tarih", "Sanat"];
    },
  },
  async mounted() {
    this.loadCategories();
    this.fetchExchangeRates();

    const savedDescription = localStorage.getItem("bookDescription");
    if (savedDescription) {
      this.book.description = savedDescription;
    }

    if (this.user && this.user.id) {
      this.book.addedBy = this.user.id;
    }
  },
};
</script>

<style lang="scss">
@use "@/styles/addBook";
</style> 

