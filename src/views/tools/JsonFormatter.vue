<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

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
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="JSON Formatter" 
      description="Format, validate, and minify JSON data" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content (Left) -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Input JSON -->
          <ToolCard title="Input JSON" :collapsible="false" full-width>
            <textarea
              v-model="jsonInput"
              placeholder='{"key": "value"}'
              class="w-full h-80 px-4 py-3 border border-gray-200 rounded-lg resize-y focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white font-mono text-sm"
              :class="{
                'border-red-300 focus:border-red-400 focus:ring-red-100': isValid === false,
                'border-green-300 focus:border-green-400 focus:ring-green-100': isValid === true
              }"
            ></textarea>

            <!-- Validation Status -->
            <div v-if="jsonInput" class="mt-4 flex items-center justify-between">
              <div>
                <span v-if="isValid === true" class="text-sm text-green-600 font-medium flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Valid JSON
                </span>
                <span v-else-if="isValid === false" class="text-sm text-red-600 font-medium flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  Invalid JSON
                </span>
              </div>
              <button
                @click="clear"
                class="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </ToolCard>

          <!-- Output JSON -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Formatted Output -->
            <ToolCard title="Formatted Output" :default-collapsed="false">
              <!-- Error Message -->
              <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div class="flex items-start gap-3 text-red-700">
                  <svg class="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <div class="font-semibold text-sm mb-1">Error</div>
                    <pre class="text-xs font-mono whitespace-pre-wrap">{{ error }}</pre>
                  </div>
                </div>
              </div>

              <div v-if="formattedJson" class="space-y-4">
                <div class="w-full h-96 px-4 py-3 border border-gray-200 rounded-lg bg-white font-mono text-xs overflow-auto">
                  <pre class="whitespace-pre">{{ formattedJson }}</pre>
                </div>
                <button
                  @click="copyToClipboard(formattedJson)"
                  class="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-all font-medium"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div v-else-if="!error" class="text-center py-16 text-gray-400 text-sm">
                Output will appear here
              </div>
            </ToolCard>

            <!-- Statistics -->
            <ToolCard title="Statistics" :default-collapsed="false">
              <div v-if="stats" class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.characters.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 mt-1.5 uppercase tracking-wider font-medium">Characters</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.lines.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 mt-1.5 uppercase tracking-wider font-medium">Lines</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.items }}</div>
                  <div class="text-xs text-gray-500 mt-1.5 uppercase tracking-wider font-medium">Items</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.depth }}</div>
                  <div class="text-xs text-gray-500 mt-1.5 uppercase tracking-wider font-medium">Max Depth</div>
                </div>
              </div>
              <div v-else class="text-center py-16 text-gray-400 text-sm">
                Statistics will appear here
              </div>
            </ToolCard>
          </div>
        </div>

        <!-- Sidebar (Right) -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Options -->
          <ToolCard title="Options" :default-collapsed="false">
            <!-- Indent Size -->
            <div class="mb-5">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Indent Size</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="size in [2, 3, 4, 8]"
                  :key="size"
                  @click="indentSize = size"
                  :class="[
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    indentSize === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Sort Keys -->
            <label class="flex items-center gap-3 cursor-pointer group">
              <input
                v-model="sortKeys"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 focus:ring-offset-0"
              />
              <span class="text-sm text-gray-700 group-hover:text-gray-900 font-medium">Sort keys alphabetically</span>
            </label>
          </ToolCard>

          <!-- Actions -->
          <ToolCard title="Actions" :default-collapsed="false">
            <div class="space-y-3">
              <button
                @click="format"
                :disabled="!jsonInput"
                class="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Format JSON
              </button>
              <button
                @click="minify"
                :disabled="!jsonInput"
                class="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Minify JSON
              </button>
              <button
                @click="loadSample"
                class="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                Load Sample
              </button>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>