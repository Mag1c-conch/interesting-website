<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  knowledgeDocs, 
  faqs, 
  openDocPreview, 
  toggleDocBookmark 
} from '../stores/appStore'
import planeMascot from '../assets/plane-mascot.png'
import pilotMascot from '../assets/pilot-mascot.png'
import {
  Search,
  Document,
  Reading,
  FolderOpened,
  Files,
  CollectionTag,
  Star,
  StarFilled,
  Download,
  View,
  QuestionFilled,
  ArrowRight
} from '@element-plus/icons-vue'

const activeTab = ref<'general' | 'specialized'>('general')
const searchKeyword = ref('')
const selectedTag = ref('')

const hotTags = [
  '全部', '飞行管理', '气象分析', '人机工程', '飞行实操', '动力学分析', '安全规范', '波音手册', '空客手册'
]

const handleTagClick = (tag: string) => {
  if (tag === '全部') {
    selectedTag.value = ''
  } else {
    selectedTag.value = tag
  }
}

const filteredDocs = computed(() => {
  return knowledgeDocs.value.filter(doc => {
    // category match
    if (activeTab.value === 'general' && doc.category !== 'general') return false
    if (activeTab.value === 'specialized' && doc.category !== 'specialized') return false

    // tag match
    if (selectedTag.value && !doc.tag.includes(selectedTag.value) && !doc.title.includes(selectedTag.value)) {
      return false
    }

    // keyword match
    if (searchKeyword.value.trim()) {
      const q = searchKeyword.value.trim().toLowerCase()
      return doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q) || doc.tag.toLowerCase().includes(q)
    }

    return true
  })
})

const quickCategories = [
  { id: 'process', title: '业务流程', desc: '转场/签派/交接规范', count: '14项', icon: FolderOpened, color: 'from-blue-500 to-indigo-600' },
  { id: 'manuals', title: '业务手册', desc: 'FCOM/QRH/SOP', count: '28部', icon: Document, color: 'from-cyan-500 to-blue-600' },
  { id: 'courseware', title: '课程资料', desc: '讲义与高精微课', count: '65套', icon: Reading, color: 'from-indigo-500 to-purple-600' },
  { id: 'question_bank', title: '模拟题库', desc: '年度理论抽测题库', count: '1200道', icon: Files, color: 'from-emerald-500 to-teal-600' },
]
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Top Header Banner -->
    <div class="flex items-center justify-between pb-2">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          知识库
        </h2>
        <p class="text-xs text-slate-500 mt-1">
          汇聚民航标准、机型操作手册、教学课件等，助力新员工高效学习与工作
        </p>
      </div>

      <!-- General vs Specialized Tab Pills -->
      <div class="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 shadow-inner">
        <button
          @click="activeTab = 'general'"
          class="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="activeTab === 'general' ? 'bg-white text-blue-700 shadow-md scale-102' : 'text-slate-600 hover:text-slate-900'"
        >
          通用知识库
        </button>
        <button
          @click="activeTab = 'specialized'"
          class="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="activeTab === 'specialized' ? 'bg-white text-blue-700 shadow-md scale-102' : 'text-slate-600 hover:text-slate-900'"
        >
          专业知识库
        </button>
      </div>
    </div>

    <!-- Quick Search Hero Section -->
    <div class="glass-card rounded-3xl p-6 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-500/10 border border-blue-200/60 relative overflow-hidden">
      <div class="max-w-2xl">
        <h3 class="text-sm font-bold text-slate-800 mb-2">快速检索</h3>
        <!-- Search bar -->
        <div class="flex items-center bg-white rounded-2xl p-1.5 shadow-md border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/40">
          <el-icon :size="18" class="text-slate-400 ml-3"><Search /></el-icon>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索您需要的手册、文件、规章、案例（如：波音737、绕机检查、SMS）..."
            class="w-full px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none"
          />
          <button
            type="button"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            搜索
          </button>
        </div>

        <!-- Hot Tags -->
        <div class="flex flex-wrap items-center gap-1.5 mt-3">
          <span class="text-[11px] text-slate-400 mr-1">热门搜索：</span>
          <button
            v-for="tag in hotTags"
            :key="tag"
            @click="handleTagClick(tag)"
            class="text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer"
            :class="(selectedTag === tag || (tag === '全部' && !selectedTag))
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold' 
              : 'bg-white/80 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Mascot Deco Right -->
      <div class="absolute right-6 -bottom-4 w-32 h-32 pointer-events-none opacity-85 hidden md:block">
        <img :src="planeMascot" alt="Plane" class="w-full h-full object-contain animate-float drop-shadow-lg" />
      </div>
    </div>

    <!-- 4 Quick Category Tiles -->
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="cat in quickCategories"
        :key="cat.id"
        @click="selectedTag = cat.title"
        class="glass-card rounded-2xl p-4 cursor-pointer group hover:border-blue-400/80 transition-all shadow-xs hover:shadow-md"
      >
        <div class="flex items-center space-x-3">
          <div :class="`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md`">
            <el-icon :size="18"><component :is="cat.icon" /></el-icon>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ cat.title }}</h4>
            <p class="text-[10px] text-slate-400 mt-0.5">{{ cat.desc }}</p>
          </div>
        </div>
        <div class="text-right text-[10px] text-blue-600 font-bold mt-2 pt-1 border-t border-slate-100 flex items-center justify-end gap-0.5">
          <span>共 {{ cat.count }}</span>
          <el-icon :size="10"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- Two-column Content Section: 热门问题 vs 最新文档 -->
    <div class="grid grid-cols-12 gap-5">
      <!-- Left Column: 热门问题 (FAQ) (5 cols) -->
      <div class="col-span-5 space-y-4">
        <div class="glass-card rounded-3xl p-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <el-icon class="text-amber-500"><QuestionFilled /></el-icon>
              热门问题
            </h3>
            <span class="text-xs text-slate-400">实时解答频次排序</span>
          </div>

          <div class="mt-3 space-y-2.5">
            <el-collapse accordion>
              <el-collapse-item 
                v-for="(faq, idx) in faqs" 
                :key="faq.id" 
                :title="`${idx + 1}. ${faq.question}`"
                :name="faq.id"
              >
                <div class="p-2.5 bg-blue-50/60 rounded-xl text-xs text-slate-700 leading-relaxed space-y-1.5">
                  <p>{{ faq.answer }}</p>
                  <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-blue-100">
                    <span>分类：{{ faq.category }}</span>
                    <span>检索热度：{{ faq.hotCount }} 次</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>

      <!-- Right Column: 最新与重要技术文档列表 (7 cols) -->
      <div class="col-span-7 space-y-4">
        <div class="glass-card rounded-3xl p-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <el-icon class="text-blue-600"><Document /></el-icon>
              {{ activeTab === 'general' ? '通用文档与规章制度' : '机型操纵手册与特情规程' }}
            </h3>
            <span class="text-xs text-slate-400">共 {{ filteredDocs.length }} 篇受控资料</span>
          </div>

          <!-- Empty State -->
          <div v-if="filteredDocs.length === 0" class="py-12 text-center text-xs text-slate-400 space-y-2">
            <el-icon :size="32" class="text-slate-300"><Document /></el-icon>
            <p>未找到符合条件的文档，请尝试更换关键词或标签</p>
          </div>

          <!-- Doc List -->
          <div class="space-y-2.5 mt-3">
            <div
              v-for="doc in filteredDocs"
              :key="doc.id"
              class="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-2xs hover:shadow-md flex items-center justify-between group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[9px] font-black uppercase tracking-wider">{{ doc.type }}</span>
                  <el-icon :size="14"><Document /></el-icon>
                </div>

                <div class="max-w-md">
                  <h4 
                    @click="openDocPreview(doc)"
                    class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {{ doc.title }}
                  </h4>
                  <div class="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                    <span class="text-blue-600 font-medium">{{ doc.tag }}</span>
                    <span>·</span>
                    <span>{{ doc.size }}</span>
                    <span>·</span>
                    <span>{{ doc.date }}</span>
                  </div>
                </div>
              </div>

              <!-- Action icons -->
              <div class="flex items-center space-x-2">
                <button
                  @click="toggleDocBookmark(doc.id)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer"
                  title="收藏手册"
                >
                  <el-icon :size="16" :class="doc.isBookmarked ? 'text-amber-500' : ''">
                    <StarFilled v-if="doc.isBookmarked" />
                    <Star v-else />
                  </el-icon>
                </button>

                <button
                  @click="openDocPreview(doc)"
                  class="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <el-icon :size="12"><View /></el-icon>
                  <span>查阅</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
