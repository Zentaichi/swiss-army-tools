<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const text = ref('')

// Text statistics
const stats = computed(() => {
  const str = text.value
  const words = str.trim().split(/\s+/).filter(word => word.length > 0)
  const lines = str.split('\n').length
  const sentences = str.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const paragraphs = str.split(/\n\n+/).filter(p => p.trim().length > 0).length
  
  return {
    characters: str.length,
    charactersNoSpaces: str.replace(/\s/g, '').length,
    words: words.length,
    lines: lines,
    sentences: sentences,
    paragraphs: paragraphs,
    readingTime: Math.ceil(words.length / 200) // avg reading speed: 200 words/min
  }
})

// Text transformations
const transformedText = ref('')
const activeTransform = ref('')

const transformations = [
  { id: 'uppercase', label: 'UPPERCASE', icon: '🔼' },
  { id: 'lowercase', label: 'lowercase', icon: '🔽' },
  { id: 'capitalize', label: 'Capitalize Each Word', icon: '📝' },
  { id: 'sentence', label: 'Sentence case', icon: '📄' },
  { id: 'reverse', label: 'esreveR', icon: '🔄' },
  { id: 'removeSpaces', label: 'RemoveSpaces', icon: '🚫' },
  { id: 'removeLineBreaks', label: 'Remove Line Breaks', icon: '➖' },
  { id: 'trimLines', label: 'Trim Each Line', icon: '✂️' }
]

const transform = (type) => {
  activeTransform.value = type
  const str = text.value
  
  switch(type) {
    case 'uppercase':
      transformedText.value = str.toUpperCase()
      break
    case 'lowercase':
      transformedText.value = str.toLowerCase()
      break
    case 'capitalize':
      transformedText.value = str.replace(/\b\w/g, char => char.toUpperCase())
      break
    case 'sentence':
      transformedText.value = str.toLowerCase().replace(/(^\w|\.\s+\w)/g, char => char.toUpperCase())
      break
    case 'reverse':
      transformedText.value = str.split('').reverse().join('')
      break
    case 'removeSpaces':
      transformedText.value = str.replace(/\s/g, '')
      break
    case 'removeLineBreaks':
      transformedText.value = str.replace(/\n/g, ' ').replace(/\s+/g, ' ')
      break
    case 'trimLines':
      transformedText.value = str.split('\n').map(line => line.trim()).join('\n')
      break
  }
}

const copyToClipboard = async (textToCopy) => {
  try {
    await navigator.clipboard.writeText(textToCopy)
    showCopyNotification.value = true
    setTimeout(() => {
      showCopyNotification.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearText = () => {
  text.value = ''
  transformedText.value = ''
  activeTransform.value = ''
}

const showCopyNotification = ref(false)

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Minimalistic Header -->
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
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Text Tools</h1>
            <p class="text-gray-500 mt-1">Transform and analyze your text</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Input & Stats -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Input Area -->
          <div class="tool-container animate-fade-in">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Input Text</h2>
              <button
                v-if="text"
                @click="clearText"
                class="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
            <textarea
              v-model="text"
              placeholder="Type or paste your text here..."
              class="w-full h-64 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-gray-50/50 font-mono text-sm"
            ></textarea>
          </div>

          <!-- Text Statistics -->
          <div class="tool-container stagger-item">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Statistics</h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.characters }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Characters</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.charactersNoSpaces }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">No Spaces</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.words }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Words</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.lines }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Lines</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.sentences }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Sentences</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">{{ stats.paragraphs }}</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Paragraphs</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 sm:col-span-2">
                <div class="text-2xl font-bold text-gray-900">{{ stats.readingTime }} min</div>
                <div class="text-xs text-gray-500 mt-1 uppercase tracking-wider">Reading Time</div>
              </div>
            </div>
          </div>

          <!-- Output Area -->
          <div v-if="transformedText" class="tool-container stagger-item" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Output</h2>
              <button
                @click="copyToClipboard(transformedText)"
                class="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                {{ showCopyNotification ? '✓ Copied!' : 'Copy' }}
              </button>
            </div>
            <div class="w-full min-h-64 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 font-mono text-sm whitespace-pre-wrap break-words">
              {{ transformedText }}
            </div>
          </div>
        </div>

        <!-- Right Column: Transformations -->
        <div class="space-y-8">
          <div class="tool-container animate-fade-in" style="animation-delay: 0.05s">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Transformations</h2>
            <div class="space-y-3">
              <button
                v-for="t in transformations"
                :key="t.id"
                @click="transform(t.id)"
                :disabled="!text"
                :class="[
                  'w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3',
                  activeTransform === t.id
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200',
                  !text && 'opacity-50 cursor-not-allowed'
                ]"
              >
                <span class="text-xl">{{ t.icon }}</span>
                <span class="font-medium text-sm">{{ t.label }}</span>
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="tool-container stagger-item" style="animation-delay: 0.1s">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div class="space-y-3">
              <button
                @click="copyToClipboard(text)"
                :disabled="!text"
                class="w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="text-xl">📋</span>
                <span class="font-medium text-sm">Copy Input</span>
              </button>
              <button
                @click="clearText"
                :disabled="!text"
                class="w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="text-xl">🗑️</span>
                <span class="font-medium text-sm">Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>