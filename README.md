# Kitap Dünyası Pro

Kitap Dünyası Pro, kullanıcıların kitapları listeleyip yönetebildiği, favorilere ekleyip yorum yapabildiği Vue 3 tabanlı bir web uygulamasıdır. Proje, modern JavaScript teknolojileri kullanılarak geliştirilmiştir.

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
- **Quill Editor** - Zengin metin düzenleyici
- **UUID** - Benzersiz kimlik oluşturma
- **Teleport** -  Modalları yönetmek için kullanıldı


## ⚠️ Karşılaşılan Zorluklar ve Çözümler

### 1. **Vuex Persisted State ile Veri Saklama**
Sorun: Sayfa yenilendiğinde Vuex verilerinin kaybolması.  
Çözüm: `vuex-persistedstate` eklentisi kullanılarak veriler **localStorage**'a kaydedildi.

### 2. **Döviz Kurları API Kullanımı**
Sorun: API çağrılarının fazla olması.  
Çözüm: Döviz kurları **30 dakikada bir** güncellenecek şekilde `setInterval` ile optimize edildi.

## 🏗️ Mimari Kararlar

- **Modüler Yapı:** Tüm bileşenler ve yönlendirme işlemleri modüler olacak şekilde bölündü.
- **State Management:** Vuex kullanılarak global state yönetildi.
- **Lazy Loading:** Sayfalar **lazy load** ile yüklenerek performans artırıldı.
- **SCSS Kullanımı:** Stil yönetimi daha esnek hale getirildi.



