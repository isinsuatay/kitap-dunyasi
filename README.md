Kitap Dünyası Pro

Kitap Dünyası Pro, kullanıcıların kitapları listeleyip yönetebildiği, favorilere ekleyip yorum yapabildiği, Vue 3 tabanlı bir web uygulamasıdır. Bu proje, kitap yönetimi, kitaplara yorum ekleme ve favorilere ekleme gibi işlemleri kolaylaştırarak, kullanıcıların kitap dünyasına daha derinlemesine bir bağ kurmalarını sağlar. Ayrıca, döviz kurları gibi ek özelliklerle kullanıcı deneyimini zenginleştirir.

Kitap Dünyası Pro, modern JavaScript teknolojileri ve araçlarıyla geliştirilmiştir ve aşağıdaki özellikleri sunar:
	•	Kitap Listeleme ve Yönetim: Kullanıcılar, kitapları listeleyebilir, arama yapabilir, kitapları favorilerine ekleyebilir ve kitaplar hakkında yorumlar bırakabilir.
	•	Döviz Kurları: Döviz kurları API’si ile güncel döviz kurlarını kullanıcıya sunar. Bu özellik, döviz kurları bilgilerini 30 dakikada bir günceller, böylece her zaman güncel bilgilere erişebilirsiniz.
	•	Kullanıcı Dostu Arayüz: Kullanıcıların kitaplarla etkileşimde bulunmalarını kolaylaştıran, minimalist ve modern bir arayüz sağlar.
	•	Yorumlar ve Favoriler: Kullanıcılar, kitaplar hakkında yorum yapabilir ve favorilerine ekleyebilirler.
	•	Gelişmiş Arama ve Filtreleme: Kitapları filtreleme ve arama özellikleri ile kullanıcılar hızlıca istedikleri kitaplara ulaşabilirler.

## 🌍 Demo
[https://kitap-dunyasi-pro-c64n.vercel.app]

## 🚀 Kurulum

Projeyi çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/isinsuatay/kitap-dunyasi-pro.git
cd kitap-dunyasi-pro
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Ortamında Çalıştırın
```bash
npm run dev
```

### 4. Üretim İçin Derleme
```bash
npm run build
```

### 5. Önizleme Modunda Çalıştırın
```bash
npm run preview
```

## 📌 Kullanılan Teknolojiler

- **Vue 3** - Komponent tabanlı modern frontend framework
- **Vue Router** - Sayfa yönlendirmeleri için
- **Vuex** - Global durum yönetimi
- **Vuex Persisted State** - Vuex durumunu localStorage ile saklama
- **Axios** - API istekleri için
- **Vuelidate** - Form doğrulama için
- **SCSS** - Gelişmiş stil yönetimi
- **FontAwesome** - İkonlar için
- **SweetAlert2** - Kullanıcı dostu uyarı mesajları
- **Vue Carousel** - Kitap kaydırma bileşeni
- **UUID** - Benzersiz kimlik oluşturma


## 🏗️ Mimari Kararlar

- **Modüler Yapı:** Tüm bileşenler ve yönlendirme işlemleri modüler olacak şekilde bölündü.
- **State Management:** Vuex kullanılarak global state yönetildi.
- **Lazy Loading:** Sayfalar **lazy load** ile yüklenerek performans artırıldı.
- **SCSS Kullanımı:** Stil yönetimi daha esnek hale getirildi.
- **Vuex Persisted State:** Kullanıcı verileri, sayfa yenilense dahi saklanarak kesintisiz bir deneyim sağlanır.
- **Responsive Tasarım:** Proje, mobil uyumlu olacak şekilde tasarlanmış ve Flexbox ile esnek yapılar kullanılmıştır.
- **Stil Yönetimi:** SCSS kullanılarak stiller modüler hale getirilmiş, ortak stiller merkezi bir dosyada toplanmıştır.

## ⚡ Performans İyileştirmeleri
	•	CSS ve JavaScript Minifikasyonu: Üretim için dosyalar sıkıştırılmış ve daha hızlı yüklenmesi sağlanmıştır.
	•	Manual Chunks: node_modules dışındaki bağımlılıklar manuel olarak bölünerek, sayfa yükleme hızları iyileştirilmiştir.
