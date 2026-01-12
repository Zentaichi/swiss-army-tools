<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Keyboard Tester</h1>
            <p class="text-sm text-gray-600">Test your keyboard keys</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="tool-container text-center py-12">
        <div class="text-6xl mb-4">⌨️</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p class="text-gray-600">Keyboard tester will be implemented next</p>
      </div>
    </main>
  </div>
</template>