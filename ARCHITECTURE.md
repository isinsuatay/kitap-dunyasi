# Kitap Dünyası Pro - Mimarisi

## Proje Yapısı
Kitap Dünyası Pro, Vue 3 ile geliştirilen bir kitap yönetim ve inceleme platformudur. Proje, Vuex, Vue Router ve SCSS kullanılarak modüler ve ölçeklenebilir bir yapıda tasarlanmıştır.

```
src/
  assets/
  components/
  layouts/
  pages/
  store/
  router/
  styles/
  utils/
  App.vue
  main.js
```

### Ana Klasörler
- **components/**: Tekrar kullanılabilir Vue bileşenleri.
- **layouts/**: Sayfa düzenlerini içerir.
- **pages/**: Route bazlı sayfalar.
- **store/**: Vuex ile state yönetimi.
- **router/**: Uygulama yönlendirmelerini içerir.
- **styles/** : Global ve bileşen bazlı stil dosyaları
- **utils/**: Yardımcı fonksiyonlar.

## Mimari Kararlar
### 1. **Vuex ile Durum Yönetimi**
- Kullanıcı bilgileri, favori kitaplar ve yorumlar Vuex store'da yönetilmektedir.
- **PersistedState** eklentisi ile localStorage üzerinden veri saklanmaktadır.

### 2. **Vue Router ile Sayfa Yönlendirmeleri**
- Lazy loading ile sayfalar dinamik olarak yüklenmektedir.
- Korunan rotalar için **Navigation Guard** kullanılmıştır.

### 3. **SCSS ile Stil Yönetimi**
- **Global SCSS** dosyaları kullanılarak tema ve bileşen bazlı stiller ayrıştırılmıştır.
- **Değişkenler (variables)** ile renk, font ve grid sistemleri belirlenmiştir.

### 4. **API ve Veri Yönetimi**
- Axios kullanılarak API çağrıları yapılmaktadır.
- Döviz kurları, her 30 dakikada bir güncellenerek Vuex state içinde saklanmaktadır.

### 5. **Vue 3 Teleport Kullanımı**
- Modallar ve uyarılar için **Teleport** özelliği kullanılmıştır.

### 6. **Performans Optimizasyonları**
- **Lazy loading** ile bileşen yüklemeleri optimize edilmiştir.
- **Debounce mekanizması** anlık arama gibi işlemlerde kullanılmıştır.
- **Vue 3 reactivity system** sayesinde gereksiz render işlemleri minimize edilmiştir.

---
Bu mimari, ölçeklenebilir ve sürdürülebilir bir yapı sunmak için tasarlanmıştır. Geliştirme sürecinde yapılan değişikliklere göre güncellenebilir. 📚🚀

