<script setup>
import { ref, computed } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

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
  { id: 'uppercase', label: 'UPPERCASE' },
  { id: 'lowercase', label: 'lowercase' },
  { id: 'capitalize', label: 'Capitalize Each Word' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'reverse', label: 'esreveR' },
  { id: 'removeSpaces', label: 'RemoveSpaces' },
  { id: 'removeLineBreaks', label: 'Remove Line Breaks' },
  { id: 'trimLines', label: 'Trim Each Line' }
]

const getTransformIcon = (id) => {
  const icons = {
    uppercase: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>`,
    lowercase: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>`,
    capitalize: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
    sentence: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    reverse: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>`,
    removeSpaces: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`,
    removeLineBreaks: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>`,
    trimLines: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/></svg>`
  }
  return icons[id] || ''
}

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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Text Tools" 
      description="Transform and analyze your text" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content (Left) -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Input Area -->
          <ToolCard title="Input Text" :collapsible="false" full-width>
            <textarea
              v-model="text"
              placeholder="Type or paste your text here..."
              class="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg resize-y focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white font-mono text-sm"
            ></textarea>
            <div v-if="text" class="mt-3 flex justify-end">
              <button
                @click="clearText"
                class="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </ToolCard>

          <!-- Statistics & Output -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Text Statistics -->
            <ToolCard title="Statistics" :default-collapsed="false">
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                  <div class="text-xl font-bold text-gray-900">{{ stats.characters }}</div>
                  <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Characters</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                  <div class="text-xl font-bold text-gray-900">{{ stats.charactersNoSpaces }}</div>
                  <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">No Spaces</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                  <div class="text-xl font-bold text-gray-900">{{ stats.words }}</div>
                  <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Words</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                  <div class="text-xl font-bold text-gray-900">{{ stats.lines }}</div>
                  <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Lines</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                  <div class="text-xl font-bold text-gray-900">{{ stats.sentences }}</div>
                  <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Sentences</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                  <div class="text-xl font-bold text-gray-900">{{ stats.paragraphs }}</div>
                  <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Paragraphs</div>
                </div>
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg col-span-2">
                  <div class="text-xl font-bold text-gray-900">{{ stats.readingTime }} min</div>
                  <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Reading Time</div>
                </div>
              </div>
            </ToolCard>

            <!-- Output Area -->
            <ToolCard title="Output" :default-collapsed="false">
              <div v-if="transformedText" class="space-y-3">
                <div class="w-full min-h-[300px] max-h-[400px] px-4 py-3 border border-gray-200 rounded-lg bg-white font-mono text-sm whitespace-pre-wrap break-words overflow-auto">
                  {{ transformedText }}
                </div>
                <button
                  @click="copyToClipboard(transformedText)"
                  class="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-all font-medium"
                >
                  {{ showCopyNotification ? '✓ Copied!' : 'Copy Output' }}
                </button>
              </div>
              <div v-else class="text-center py-16 text-gray-400 text-sm">
                Select a transformation to see output
              </div>
            </ToolCard>
          </div>
        </div>

        <!-- Sidebar (Right) -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Transformations -->
          <ToolCard title="Transformations" :default-collapsed="false">
            <div class="space-y-2">
              <button
                v-for="t in transformations"
                :key="t.id"
                @click="transform(t.id)"
                :disabled="!text"
                :class="[
                  'w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3',
                  activeTransform === t.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100',
                  !text && 'opacity-50 cursor-not-allowed'
                ]"
              >
                <span v-html="getTransformIcon(t.id)"></span>
                <span class="font-medium text-sm">{{ t.label }}</span>
              </button>
            </div>
          </ToolCard>

          <!-- Quick Actions -->
          <ToolCard title="Quick Actions" :default-collapsed="false">
            <div class="space-y-2">
              <button
                @click="copyToClipboard(text)"
                :disabled="!text"
                class="w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span class="font-medium text-sm">Copy Input</span>
              </button>
              <button
                @click="clearText"
                :disabled="!text"
                class="w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span class="font-medium text-sm">Clear All</span>
              </button>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>