<template>
  <DefaultLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from './layouts/DefaultLayout.vue';
</script>

<style scoped>
</style>