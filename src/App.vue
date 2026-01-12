<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app" class="min-h-screen">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
/* Any global styles can go here */
</style>