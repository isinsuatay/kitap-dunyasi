<template>
  <div class="auth-container">
    <div class="auth-box">
      <h3 class="welcome-message">
        {{ isLogin ? 'Tekrar hoş geldiniz! Sizi yeniden görmek güzel 😊' : 'Aramıza hoş geldiniz! Hemen kaydolun ve keşfetmeye başlayın 🚀' }}
      </h3>
      <div class="auth-tabs">
        <div class="slider-background" :class="{ right: !isLogin }"></div>
        <button :class="{ active: isLogin }" @click="setAuthMode(true)">Giriş Yap</button>
        <button :class="{ active: !isLogin }" @click="setAuthMode(false)">Üye Ol</button>
      </div>

      <transition name="slide-fade" mode="out-in">
        <div :key="isLogin" class="auth-form">
          <h2>{{ isLogin ? 'Giriş Yap' : 'Kayıt Ol' }}</h2>
          <form @submit.prevent="handleSubmit">
            <input type="email" v-model="email" placeholder="E-Posta" required />
            <input type="password" v-model="password" placeholder="Şifre" required />

            <div v-if="!isLogin">
              <input type="text" v-model="firstName" placeholder="Adınız" required />
              <input type="text" v-model="lastName" placeholder="Soyadınız" required />
            </div>

            <div v-if="!isLogin" class="password-note">
              * Şifreniz aşağıdaki gereksinimleri karşılamalıdır:
              <ul>
                <li :class="{ valid: passwordRules.length, invalid: !passwordRules.length }">
                   En az 8 karakter uzunluğunda olmalı.
                </li>
                <li :class="{ valid: passwordRules.uppercase, invalid: !passwordRules.uppercase }">
                   En az bir büyük harf içermeli.
                </li>
                <li :class="{ valid: passwordRules.lowercase, invalid: !passwordRules.lowercase }">
                   En az bir küçük harf içermeli.
                </li>
                <li :class="{ valid: passwordRules.digit, invalid: !passwordRules.digit }">
                   En az bir rakam içermeli.
                </li>
                <li :class="{ valid: passwordRules.special, invalid: !passwordRules.special }">
                   En az bir özel karakter (!@#$%^&* gibi) içermeli.
                </li>
              </ul>
            </div>

            <button type="submit">{{ isLogin ? 'Giriş Yap' : 'Kayıt Ol' }}</button>
          </form>
        </div>
      </transition>

      <p @click="toggleAuth" class="toggle-text">
        {{ isLogin ? 'Hesabınız yok mu? ' : 'Zaten üye misiniz? ' }}
        <strong>{{ isLogin ? 'Hemen kayıt olun!' : 'Giriş yapın!' }}</strong>
      </p>
      
      <p v-if="isLogin" @click="forgotPassword" class="forgot-password">Şifremi Unuttum</p>
        </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const store = useStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const firstName = ref(""); 
const lastName = ref(""); 
const isLogin = ref(true);

const passwordRules = ref({
  length: false,
  uppercase: false,
  lowercase: false,
  digit: false,
  special: false,
});

watch(password, (newPassword) => {
  passwordRules.value.length = newPassword.length >= 8;
  passwordRules.value.uppercase = /[A-Z]/.test(newPassword);
  passwordRules.value.lowercase = /[a-z]/.test(newPassword);
  passwordRules.value.digit = /\d/.test(newPassword);
  passwordRules.value.special = /[@$!%*?&]/.test(newPassword);
});

const toggleAuth = () => {
  isLogin.value = !isLogin.value;
  email.value = "";
  password.value = "";
  firstName.value = "";
  lastName.value = "";
};

const setAuthMode = (mode) => {
  isLogin.value = mode;
  email.value = "";
  password.value = "";
  firstName.value = "";
  lastName.value = "";
};

const handleSubmit = async () => {
  if (!email.value || !password.value || (!isLogin.value && (!firstName.value || !lastName.value))) {
    return Swal.fire("Hata", "Lütfen tüm alanları doldurun!", "error");
  }

  if (!isLogin.value && !Object.values(passwordRules.value).every(Boolean)) {
    return Swal.fire("Hata", "Şifreniz belirtilen kriterlere uymuyor!", "error");
  }

  try {
    if (isLogin.value) {
      await store.dispatch("login", { email: email.value, password: password.value });
      Swal.fire("Başarılı", "Giriş işlemi başarılı!", "success");
      router.push("/profile");
    } else {
      await store.dispatch("register", {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      });
      Swal.fire("Başarılı", "Kayıt işlemi başarılı! Şimdi giriş yapabilirsiniz.", "success");
      isLogin.value = true;
    }
  } catch (error) {
    Swal.fire("Hata", error.message, "error");
  }
};
const forgotPassword = () => {
  Swal.fire({
    title: 'Şifrenizi mi unuttunuz?',
    input: 'email',
    inputPlaceholder: 'E-Postanızı girin',
    showCancelButton: true,
    confirmButtonText: 'Şifreyi Sıfırla',
    cancelButtonText: 'İptal',
    inputValidator: (value) => {
      if (!value) {
        return 'Lütfen e-posta adresinizi girin!';
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(); 
        }, 1000);
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Şifre sıfırlama linki gönderildi!',
        'E-posta adresinize şifre sıfırlama talimatı gönderildi.',
        'success'
      );
    }
  });
};
</script>

<style lang="scss">
@use "@/styles/auth";
</style>