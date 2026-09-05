<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { chatMessages, sendAiMessage, isAiTyping, knowledgeDocs, openDocPreview } from '../stores/appStore'
import pilotMascot from '../assets/pilot-mascot.png'
import planeMascot from '../assets/plane-mascot.png'
import {
  Cpu,
  Promotion,
  Loading,
  Reading,
  ChatDotRound,
  Compass,
  Document,
  ArrowRight
} from '@element-plus/icons-vue'

const fullInput = ref('')
const chatBox = ref<HTMLElement | null>(null)

const triggerPrompt = (text: string) => {
  sendAiMessage(text)
  scrollChat()
}

const handleSend = () => {
  if (!fullInput.value.trim()) return
  const txt = fullInput.value
  fullInput.value = ''
  sendAiMessage(txt)
  scrollChat()
}

const scrollChat = () => {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

const presets = [
  { icon: '✈️', title: '波音 737NG SOP 起飞流程', prompt: '请帮我梳理波音 737NG 标准起飞滑跑及抬轮离地关键呼唤用语及动作规范' },
  { icon: '🛡️', title: '空中特情处置规程', prompt: '遇到座舱失压氧气面罩自动脱落时，机组前三项首要记忆处置项目是什么？' },
  { icon: '🏔️', title: '承德机场进近注意事项', prompt: '承德普宁机场盲降进近最低气象标准及复飞障碍物限制是怎样的？' },
  { icon: '🎯', title: '模拟考官连珠炮提问', prompt: '请开启模拟考官模式，对我进行随机理论与实操抽查提问！' },
]
</script>

<template>
  <div class="h-[calc(100vh-7.5rem)] flex space-x-5 pb-4">
    <!-- Left Navigation / Scenario Presets -->
    <div class="w-72 shrink-0 glass-card rounded-3xl p-5 flex flex-col justify-between">
      <div>
        <div class="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <el-icon :size="20"><Cpu /></el-icon>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">飞飞 AI 助教工作台</h3>
            <span class="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 知识库增强 RAG 引擎
            </span>
          </div>
        </div>

        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">精选专业问答场景</h4>
        <div class="space-y-2">
          <div
            v-for="(p, i) in presets"
            :key="i"
            @click="triggerPrompt(p.prompt)"
            class="p-3 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div class="flex items-center space-x-2">
              <span class="text-base">{{ p.icon }}</span>
              <span class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ p.title }}</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1 line-clamp-1 leading-relaxed">{{ p.prompt }}</p>
          </div>
        </div>
      </div>

      <!-- Mascot Card -->
      <div class="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center space-x-3">
        <img :src="pilotMascot" alt="" class="w-12 h-12 object-contain" />
        <div class="text-[11px] text-slate-600">
          <p class="font-bold text-slate-800">支持多机型手册溯源</p>
          <p class="text-slate-400 text-[10px] mt-0.5">回答自动附带官方受控文件出处</p>
        </div>
      </div>
    </div>

    <!-- Center Chat Stream -->
    <div class="flex-1 glass-card rounded-3xl p-6 flex flex-col justify-between">
      <!-- Chat Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-bold text-slate-800">实时交互对话</span>
          <span class="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">深航飞行大脑</span>
        </div>
        <button 
          @click="chatMessages = [chatMessages[0]]" 
          class="text-xs text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
        >
          清空历史
        </button>
      </div>

      <!-- Messages Body -->
      <div ref="chatBox" class="flex-1 overflow-y-auto space-y-4 my-4 pr-2 custom-scrollbar">
        <div
          v-for="msg in chatMessages"
          :key="msg.id"
          class="flex items-start space-x-3"
          :class="msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
        >
          <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-200">
            <img :src="msg.sender === 'user' ? pilotMascot : planeMascot" alt="" class="w-full h-full object-cover" />
          </div>

          <div 
            class="max-w-2xl p-4 rounded-2xl shadow-sm text-xs leading-relaxed"
            :class="msg.sender === 'user'
              ? 'bg-blue-600 text-white rounded-tr-xs'
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'"
          >
            <div class="whitespace-pre-wrap">{{ msg.text }}</div>

            <!-- Citation link -->
            <div 
              v-if="msg.referenceDoc"
              @click="knowledgeDocs.find(d => d.title.includes(msg.referenceDoc!)) && openDocPreview(knowledgeDocs.find(d => d.title.includes(msg.referenceDoc!))!)"
              class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              <span class="flex items-center gap-1">
                <el-icon><Document /></el-icon>
                参考依据：{{ msg.referenceDoc }}
              </span>
              <el-icon><ArrowRight /></el-icon>
            </div>

            <!-- Interactive suggested responses -->
            <div v-if="msg.options && msg.options.length" class="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                v-for="(opt, i) in msg.options"
                :key="i"
                @click="triggerPrompt(opt)"
                class="text-[11px] py-1 px-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
              >
                {{ opt }}
              </button>
            </div>
          </div>
        </div>

        <!-- Typing status -->
        <div v-if="isAiTyping" class="flex items-center space-x-2 text-xs text-blue-600 p-2 bg-blue-50/60 rounded-xl w-fit">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>深航飞飞正在检索手册与规章，生成专业解答...</span>
        </div>
      </div>

      <!-- Input box -->
      <div class="pt-3 border-t border-slate-100 flex items-center space-x-3">
        <input
          v-model="fullInput"
          @keydown.enter="handleSend"
          type="text"
          placeholder="向深航飞飞提出关于飞行规章、实训考核或机型操纵的问题..."
          class="flex-1 px-4 py-3 bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-800 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
        />
        <button
          @click="handleSend"
          :disabled="!fullInput.trim() || isAiTyping"
          class="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>发送提问</span>
          <el-icon><Promotion /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>
