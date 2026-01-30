<script setup>
import { ref, computed, watch } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import ToolCard from '@/components/ToolCard.vue'
import ToolIcon from '@/components/ToolIcon.vue'

const pattern = ref('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b')
const testString = ref('Contact us at hello@example.com or support@test.org\nInvalid emails: user@, @domain.com, test@')
const flags = ref({
  g: true,  // global
  i: true,  // case insensitive
  m: false, // multiline
  s: false, // dotAll
  u: false, // unicode
  y: false  // sticky
})

const regexError = ref('')
const matches = ref([])
const highlightedText = ref('')

// Compute regex from pattern and flags
const computedRegex = computed(() => {
  try {
    const flagString = Object.entries(flags.value)
      .filter(([_, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('')
    const regex = new RegExp(pattern.value, flagString)
    regexError.value = ''
    return regex
  } catch (error) {
    regexError.value = error.message
    return null
  }
})

// Execute regex matching
const executeMatch = () => {
  if (!computedRegex.value || !testString.value) {
    matches.value = []
    highlightedText.value = testString.value
    return
  }

  try {
    const regex = computedRegex.value
    const allMatches = []
    let match

    if (flags.value.g) {
      // Global flag: find all matches
      while ((match = regex.exec(testString.value)) !== null) {
        allMatches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          fullMatch: match
        })
        // Prevent infinite loop
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    } else {
      // No global flag: find first match only
      match = regex.exec(testString.value)
      if (match) {
        allMatches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          fullMatch: match
        })
      }
    }

    matches.value = allMatches

    // Highlight matches in the text
    if (allMatches.length > 0) {
      let highlighted = ''
      let lastIndex = 0

      allMatches.forEach((m, idx) => {
        highlighted += escapeHtml(testString.value.substring(lastIndex, m.index))
        highlighted += `<mark class="bg-yellow-200 text-gray-900 font-semibold rounded px-0.5">${escapeHtml(m.match)}</mark>`
        lastIndex = m.index + m.match.length
      })
      highlighted += escapeHtml(testString.value.substring(lastIndex))
      highlightedText.value = highlighted
    } else {
      highlightedText.value = escapeHtml(testString.value)
    }
  } catch (error) {
    regexError.value = error.message
    matches.value = []
    highlightedText.value = escapeHtml(testString.value)
  }
}

// Escape HTML for safe display
const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Common regex patterns
const commonPatterns = [
  { name: 'Email', pattern: '\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b', flags: { i: true, g: true } },
  { name: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*', flags: { g: true } },
  { name: 'Phone (US)', pattern: '\\(\\d{3}\\)\\s*\\d{3}-\\d{4}', flags: { g: true } },
  { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: { g: true } },
  { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}\\b', flags: { g: true } },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', flags: { g: true } },
  { name: 'Time (HH:MM)', pattern: '\\b([01]?[0-9]|2[0-3]):[0-5][0-9]\\b', flags: { g: true } }
]

const loadPattern = (patternObj) => {
  pattern.value = patternObj.pattern
  flags.value = {
    g: patternObj.flags.g || false,
    i: patternObj.flags.i || false,
    m: patternObj.flags.m || false,
    s: patternObj.flags.s || false,
    u: patternObj.flags.u || false,
    y: patternObj.flags.y || false
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Watch for changes and re-execute
watch([pattern, testString, flags], executeMatch, { deep: true, immediate: true })
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ToolHeader 
      title="Regex Tester" 
      description="Test and debug regular expressions with live matching" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content Area (Left) -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Regular Expression Input - Full Width -->
          <ToolCard title="Regular Expression" :collapsible="false" full-width>
            <div class="flex items-start gap-3">
              <span class="text-gray-400 text-lg font-mono pt-2.5">/</span>
              <div class="flex-1">
                <input
                  v-model="pattern"
                  type="text"
                  placeholder="Enter your regex pattern..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white font-mono text-sm"
                  :class="{ 'border-red-300 focus:border-red-400 focus:ring-red-100': regexError }"
                />
                <p v-if="regexError" class="text-red-500 text-sm mt-2 font-medium">{{ regexError }}</p>
              </div>
              <span class="text-gray-400 text-lg font-mono pt-2.5">/</span>
            </div>

            <!-- Flags -->
            <div class="mt-5 flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              <label
                v-for="(enabled, flag) in flags"
                :key="flag"
                class="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  v-model="flags[flag]"
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 focus:ring-offset-0"
                />
                <span class="text-sm font-mono font-semibold text-gray-700 group-hover:text-gray-900">{{ flag }}</span>
                <span class="text-xs text-gray-400 font-medium">
                  {{
                    flag === 'g' ? 'global' :
                    flag === 'i' ? 'ignore case' :
                    flag === 'm' ? 'multiline' :
                    flag === 's' ? 'dotAll' :
                    flag === 'u' ? 'unicode' :
                    'sticky'
                  }}
                </span>
              </label>
            </div>
          </ToolCard>

          <!-- Test String Input - Full Width -->
          <ToolCard title="Test String" :collapsible="false" full-width>
            <textarea
              v-model="testString"
              placeholder="Enter your test string here..."
              class="w-full h-48 px-4 py-3 border border-gray-200 rounded-lg resize-y focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all bg-white font-mono text-sm"
            ></textarea>
          </ToolCard>

          <!-- Results Section - Two Columns -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Highlighted Output -->
            <ToolCard title="Highlighted Output" :default-collapsed="false">
              <div
                v-if="testString"
                class="w-full min-h-[200px] px-4 py-3 border border-gray-200 rounded-lg bg-white font-mono text-sm whitespace-pre-wrap break-words overflow-auto max-h-[500px]"
                v-html="highlightedText"
              ></div>
              <div v-else class="text-center py-12 text-gray-400 text-sm">
                Enter a test string to see highlighted results
              </div>
            </ToolCard>

            <!-- Match Details -->
            <ToolCard 
              :title="`Match Details (${matches.length})`" 
              :default-collapsed="false"
            >
              <div v-if="matches.length > 0" class="space-y-3 max-h-[500px] overflow-auto">
                <div
                  v-for="(match, idx) in matches"
                  :key="idx"
                  class="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                      <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Match {{ idx + 1 }}</span>
                      <div class="font-mono text-sm text-gray-900 mt-1.5 break-all">{{ match.match }}</div>
                    </div>
                    <button
                      @click="copyToClipboard(match.match)"
                      class="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-100 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div class="text-xs text-gray-500 font-medium">
                    Position: {{ match.index }}–{{ match.index + match.match.length }}
                  </div>
                  <div v-if="match.groups.length > 0" class="mt-3 pt-3 border-t border-gray-200">
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Capture Groups</div>
                    <div
                      v-for="(group, groupIdx) in match.groups"
                      :key="groupIdx"
                      class="text-xs text-gray-700 font-mono ml-2 py-1"
                    >
                      <span class="text-gray-400">Group {{ groupIdx + 1 }}:</span> {{ group || '(empty)' }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="!regexError && testString" class="text-center py-12 text-gray-400 text-sm">
                No matches found
              </div>
              <div v-else class="text-center py-12 text-gray-400 text-sm">
                Results will appear here
              </div>
            </ToolCard>
          </div>
        </div>

        <!-- Sidebar (Right) -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Common Patterns -->
          <ToolCard title="Common Patterns" :default-collapsed="false">
            <div class="space-y-2">
              <button
                v-for="patternObj in commonPatterns"
                :key="patternObj.name"
                @click="loadPattern(patternObj)"
                class="w-full px-4 py-3 rounded-lg text-left transition-all bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 group"
              >
                <div class="font-medium text-sm text-gray-900 group-hover:text-gray-950">{{ patternObj.name }}</div>
                <div class="text-xs text-gray-400 font-mono mt-1.5 truncate">{{ patternObj.pattern }}</div>
              </button>
            </div>
          </ToolCard>

          <!-- Quick Reference -->
          <ToolCard title="Quick Reference" :default-collapsed="false">
            <div class="space-y-2.5 text-xs">
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">\d</span>
                <span class="text-gray-500">Any digit</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">\w</span>
                <span class="text-gray-500">Word character</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">\s</span>
                <span class="text-gray-500">Whitespace</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">.</span>
                <span class="text-gray-500">Any character</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">*</span>
                <span class="text-gray-500">0 or more</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">+</span>
                <span class="text-gray-500">1 or more</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">?</span>
                <span class="text-gray-500">0 or 1</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">^</span>
                <span class="text-gray-500">Start of line</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">$</span>
                <span class="text-gray-500">End of line</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">[abc]</span>
                <span class="text-gray-500">Character set</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-mono font-semibold text-gray-700">(abc)</span>
                <span class="text-gray-500">Capture group</span>
              </div>
            </div>
          </ToolCard>
        </div>
      </div>
    </main>
  </div>
</template>