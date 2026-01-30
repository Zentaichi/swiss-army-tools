<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'

const jsonInput = ref('')
const indentSize = ref(2)
const sortKeys = ref(false)
const error = ref('')
const formattedJson = ref('')

const isValid = computed(() => {
  if (!jsonInput.value.trim()) return null
  try {
    JSON.parse(jsonInput.value)
    return true
  } catch (e) {
    return false
  }
})

const format = () => {
  error.value = ''
  formattedJson.value = ''
  
  if (!jsonInput.value.trim()) {
    error.value = 'Please enter some JSON'
    return
  }

  try {
    let parsed = JSON.parse(jsonInput.value)
    
    if (sortKeys.value) {
      parsed = sortObjectKeys(parsed)
    }
    
    formattedJson.value = JSON.stringify(parsed, null, indentSize.value)
  } catch (e) {
    error.value = e.message
  }
}

const minify = () => {
  error.value = ''
  formattedJson.value = ''
  
  if (!jsonInput.value.trim()) {
    error.value = 'Please enter some JSON'
    return
  }

  try {
    const parsed = JSON.parse(jsonInput.value)
    formattedJson.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = e.message
  }
}

const sortObjectKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item))
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = sortObjectKeys(obj[key])
        return result
      }, {})
  }
  return obj
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clear = () => {
  jsonInput.value = ''
  formattedJson.value = ''
  error.value = ''
}

const stats = computed(() => {
  if (!formattedJson.value) return null
  
  try {
    const parsed = JSON.parse(formattedJson.value)
    const countItems = (obj) => {
      if (Array.isArray(obj)) {
        return obj.reduce((sum, item) => sum + countItems(item), 0) + obj.length
      } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((sum, key) => sum + countItems(obj[key]), 0) + Object.keys(obj).length
      }
      return 1
    }
    
    const getDepth = (obj, depth = 1) => {
      if (Array.isArray(obj)) {
        return obj.length ? Math.max(...obj.map(item => getDepth(item, depth + 1))) : depth
      } else if (obj !== null && typeof obj === 'object') {
        const keys = Object.keys(obj)
        return keys.length ? Math.max(...keys.map(key => getDepth(obj[key], depth + 1))) : depth
      }
      return depth
    }
    
    return {
      characters: formattedJson.value.length,
      lines: formattedJson.value.split('\n').length,
      items: countItems(parsed),
      depth: getDepth(parsed)
    }
  } catch {
    return null
  }
})

// Sample JSON
const loadSample = () => {
  jsonInput.value = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "gaming"],
  "active": true
}`
  format()
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <ToolHeader 
      title="JSON Formatter" 
      description="Format and validate JSON data" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="tool-container animate-fade-in">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Input JSON</h2>
              <div class="flex items-center gap-2">
                <button
                  v-if="jsonInput"
                  @click="clear"
                  class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Clear
                </button>
                <button
                  @click="loadSample"
                  class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Load Sample
                </button>
              </div>
            </div>

            <textarea
              v-model="jsonInput"
              placeholder='{"key": "value"}'
              class="w-full h-96 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50 font-mono text-sm"
              :class="{
                'border-red-300 focus:border-red-500 focus:ring-red-500': isValid === false,
                'border-green-300 focus:border-green-500 focus:ring-green-500': isValid === true
              }"
            ></textarea>

            <!-- Validation Status -->
            <div v-if="jsonInput" class="mt-3 flex items-center gap-2">
              <span v-if="isValid === true" class="text-sm text-green-600 flex items-center gap-1">
                <span class="text-lg">✓</span> Valid JSON
              </span>
              <span v-else-if="isValid === false" class="text-sm text-red-600 flex items-center gap-1">
                <span class="text-lg">✗</span> Invalid JSON
              </span>
            </div>
          </div>

          <!-- Options & Actions -->
          <div class="tool-container stagger-item">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Options</h3>
            
            <!-- Indent Size -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Indent Size</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="size in [2, 3, 4, 8]"
                  :key="size"
                  @click="indentSize = size"
                  :class="[
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    indentSize === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  ]"
                >
                  {{ size }} spaces
                </button>
              </div>
            </div>

            <!-- Sort Keys -->
            <label class="flex items-center gap-2 mb-6 cursor-pointer">
              <input
                v-model="sortKeys"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span class="text-sm text-gray-700">Sort keys alphabetically</span>
            </label>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="format"
                :disabled="!jsonInput"
                class="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Format
              </button>
              <button
                @click="minify"
                :disabled="!jsonInput"
                class="px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Minify
              </button>
            </div>
          </div>
        </div>

        <!-- Output Section -->
        <div class="space-y-6">
          <!-- Error Message -->
          <div v-if="error" class="tool-container animate-fade-in bg-red-50 border-red-200">
            <div class="flex items-start gap-3 text-red-700">
              <span class="text-xl">⚠️</span>
              <div>
                <div class="font-semibold mb-1">Error</div>
                <pre class="text-sm font-mono whitespace-pre-wrap">{{ error }}</pre>
              </div>
            </div>
          </div>

          <!-- Formatted Output -->
          <div v-if="formattedJson" class="tool-container animate-fade-in">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Output</h2>
              <button
                @click="copyToClipboard(formattedJson)"
                class="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Copy
              </button>
            </div>

            <div class="w-full h-96 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 font-mono text-sm overflow-auto">
              <pre class="whitespace-pre">{{ formattedJson }}</pre>
            </div>
          </div>

          <!-- Statistics -->
          <div v-if="stats" class="tool-container stagger-item" style="animation-delay: 0.05s">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.characters.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Characters</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.lines.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Lines</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.items }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Items</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.depth }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Max Depth</div>
              </div>
            </div>
          </div>

          <!-- Placeholder -->
          <div v-if="!formattedJson && !error" class="tool-container text-center py-12">
            <div class="text-6xl mb-4">{ }</div>
            <p class="text-gray-500">Enter JSON and click Format or Minify</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>