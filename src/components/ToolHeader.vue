<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <header class="border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center gap-6 animate-fade-in">
        <button
          @click="goBack"
          class="text-gray-400 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
        >
          ← Back
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ title }}</h1>
          <p class="text-gray-500 mt-1">{{ description }}</p>
        </div>
      </div>
    </div>
  </header>
</template>
