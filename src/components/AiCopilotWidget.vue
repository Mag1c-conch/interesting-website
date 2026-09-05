<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { 
  chatMessages, 
  sendAiMessage, 
  isAiTyping, 
  openDocPreview, 
  knowledgeDocs,
  currentTab
} from '../stores/appStore'
import pilotMascot from '../assets/pilot-mascot.png'
import { Promotion, Loading, ChatDotRound, ArrowRight } from '@element-plus/icons-vue'

const inputText = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const handleSend = () => {
  if (!inputText.value.trim()) return
  const text = inputText.value
  inputText.value = ''
  sendAiMessage(text)
  scrollToBottom()
}

const handleChipClick = (chipText: string) => {
  sendAiMessage(chipText)
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleDocClick = (docTitle?: string) => {
  if (!docTitle) return
  const found = knowledgeDocs.value.find(d => d.title.includes(docTitle) || docTitle.includes(d.title))
  if (found) {
    openDocPreview(found)
  } else {
    currentTab.value = 'knowledge'
  }
}
</script>

<template>
  <aside class="w-80 shrink-0 h-[calc(100vh-5rem)] sticky top-20 p-4 flex flex-col justify-between border-l border-white/40 bg-white/70 backdrop-blur-xl shadow-lg select-none z-20">
    <!-- Top Header & Mascot -->
    <div>
      <div class="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
        <div>
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            深航飞飞能帮您什么？
          </h3>
          <p class="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            在线 · 智能学习助教
          </p>
        </div>
        <button 
          @click="currentTab = 'ai'"
          title="全屏 AI 工作台"
          class="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 hover:underline cursor-pointer"
        >
          全屏模式 <el-icon :size="12"><ArrowRight /></el-icon>
        </button>
      </div>

      <!-- Mascot Card & Welcome bubble -->
      <div class="p-3 bg-gradient-to-br from-blue-50/90 to-indigo-50/70 rounded-2xl border border-blue-200/60 shadow-sm relative overflow-hidden mb-3">
        <div class="flex items-center space-x-3">
          <div class="w-16 h-16 shrink-0 relative bg-white/80 rounded-2xl p-1 shadow-md border border-blue-100 group">
            <img :src="pilotMascot" alt="Feifei" class="w-full h-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="text-xs text-slate-600 leading-snug">
            <p class="font-bold text-slate-800 mb-0.5">您好！我是深航飞飞</p>
            <p class="text-[11px] text-slate-500">您的数字化伴学智能助手，随时为您解答：</p>
          </div>
        </div>

        <!-- Quick Chips -->
        <div class="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-blue-100/80">
          <button 
            @click="handleChipClick('查看学习进度')"
            class="text-[11px] py-1.5 px-2 bg-white/90 hover:bg-blue-600 hover:text-white text-slate-700 font-medium rounded-lg border border-blue-100/90 shadow-2xs transition-all text-left truncate cursor-pointer"
          >
            📊 查看学习进度
          </button>
          <button 
            @click="handleChipClick('推荐今日任务')"
            class="text-[11px] py-1.5 px-2 bg-white/90 hover:bg-blue-600 hover:text-white text-slate-700 font-medium rounded-lg border border-blue-100/90 shadow-2xs transition-all text-left truncate cursor-pointer"
          >
            🎯 推荐今日任务
          </button>
          <button 
            @click="handleChipClick('波音737起飞前检查单')"
            class="text-[11px] py-1.5 px-2 bg-white/90 hover:bg-blue-600 hover:text-white text-slate-700 font-medium rounded-lg border border-blue-100/90 shadow-2xs transition-all text-left truncate cursor-pointer"
          >
            📋 法规查询答疑
          </button>
          <button 
            @click="handleChipClick('模拟考官答题模式')"
            class="text-[11px] py-1.5 px-2 bg-white/90 hover:bg-blue-600 hover:text-white text-slate-700 font-medium rounded-lg border border-blue-100/90 shadow-2xs transition-all text-left truncate cursor-pointer"
          >
            💡 解答学习工作问题
          </button>
        </div>
      </div>
    </div>

    <!-- Messages Chat Stream Container -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto pr-1 space-y-2.5 my-2 custom-scrollbar text-xs"
    >
      <div 
        v-for="msg in chatMessages"
        :key="msg.id"
        class="flex flex-col"
        :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
      >
        <div 
          class="max-w-[92%] p-2.5 rounded-2xl shadow-sm text-xs leading-relaxed"
          :class="msg.sender === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-xs' 
            : 'bg-white/90 text-slate-800 border border-slate-200/80 rounded-tl-xs'"
        >
          <div class="whitespace-pre-wrap">{{ msg.text }}</div>
          
          <!-- Reference Document Badge -->
          <div 
            v-if="msg.referenceDoc"
            @click="handleDocClick(msg.referenceDoc)"
            class="mt-2 pt-1.5 border-t border-blue-100 text-[11px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>📖 查阅依据：{{ msg.referenceDoc }}</span>
          </div>

          <!-- Interactive options -->
          <div v-if="msg.options && msg.options.length > 0" class="mt-2 pt-1.5 border-t border-slate-100 space-y-1">
            <button
              v-for="(opt, idx) in msg.options"
              :key="idx"
              @click="handleChipClick(opt)"
              class="block w-full text-left text-[11px] py-1 px-2 bg-blue-50/70 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              👉 {{ opt }}
            </button>
          </div>
        </div>
        <span class="text-[10px] text-slate-400 mt-0.5 px-1">{{ msg.time }}</span>
      </div>

      <!-- Typing indicator -->
      <div v-if="isAiTyping" class="flex items-center space-x-1.5 p-2 bg-white/80 rounded-xl border border-slate-200 w-fit">
        <el-icon class="is-loading text-blue-600"><Loading /></el-icon>
        <span class="text-[11px] text-slate-500">飞飞正在思考分析规章与手册...</span>
      </div>
    </div>

    <!-- Bottom Input Box -->
    <div class="pt-2 border-t border-slate-200/80">
      <div class="relative flex items-center">
        <input
          v-model="inputText"
          @keydown.enter="handleSend"
          type="text"
          placeholder="输入您的问题..."
          class="w-full pl-3 pr-10 py-2.5 bg-slate-100/90 hover:bg-white focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
        />
        <button
          @click="handleSend"
          :disabled="!inputText.trim() || isAiTyping"
          class="absolute right-1.5 w-7 h-7 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <el-icon :size="14"><Promotion /></el-icon>
        </button>
      </div>
      <p class="text-[10px] text-slate-400 text-center mt-1.5">
        内容由 AI 生成 · 业务以标准手册为准
      </p>
    </div>
  </aside>
</template>
