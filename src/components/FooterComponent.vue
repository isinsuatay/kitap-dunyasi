<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- LOGO VE AÇIKLAMA -->
      <div class="footer-logo">
        <router-link to="/">
          <i class="fas fa-book-open"></i> Kitap Dünyası
        </router-link>
        <p>Kitap Dünyası, en sevdiğiniz kitapları keşfetmenizi ve yönetmenizi sağlar.</p>
      </div>

      <!-- HIZLI LİNKLER -->
      <div class="footer-links">
        <h3>Hızlı Erişim</h3>
        <ul>
          <li><router-link to="/">Ana Sayfa</router-link></li>
          <li><router-link to="/favorites">Favoriler</router-link></li>
          <li><router-link to="/addbook">Kitap Ekle</router-link></li>
          <li><router-link to="/">İletişim</router-link></li>
        </ul>
      </div>

      <!-- İLETİŞİM BİLGİLERİ -->
      <div class="footer-contact">
        <h3>İletişim</h3>
        <p><i class="fas fa-envelope"></i> info@kitapdunyasi.com</p>
        <p><i class="fas fa-phone-alt"></i> +90 555 123 45 67</p>
        <p><i class="fas fa-map-marker-alt"></i> Ankara, Türkiye</p>
      </div>

      <!-- SOSYAL MEDYA -->
      <div class="footer-social">
        <h3>Bizi Takip Edin</h3>
        <div class="social-links">
          <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" aria-label="Twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- ALT BİLGİ -->
    <div class="footer-bottom">
      <p>&copy; 2025 Kitap Dünyası. Tüm hakları saklıdır.</p>
    </div>
  </footer>
</template>

<script>

export default {
  name: "FooterComponent",
};
</script>

<style lang="scss">
@use "@/styles/footer";
</style> 