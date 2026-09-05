<script setup lang="ts">
import { ref, computed } from 'vue'
import { user, globalSearchQuery, notifications, tasks, knowledgeDocs, openTaskDetail, openDocPreview, triggerCheckIn } from '../stores/appStore'
import { Search, Bell, Check, RefreshRight, Document, Reading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isSearchOpen = ref(false)
const isNotificationsOpen = ref(false)

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
  ElMessage.success('已全部标记为已读')
}

// Global search filtered results
const searchResults = computed(() => {
  const q = globalSearchQuery.value.trim().toLowerCase()
  if (!q) return { tasks: [], docs: [] }
  return {
    tasks: tasks.value.filter(t => t.title.toLowerCase().includes(q) || t.categoryLabel.toLowerCase().includes(q)),
    docs: knowledgeDocs.value.filter(d => d.title.toLowerCase().includes(q) || d.tag.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
  }
})

const handleSelectTask = (task: any) => {
  openTaskDetail(task)
  globalSearchQuery.value = ''
  isSearchOpen.value = false
}

const handleSelectDoc = (doc: any) => {
  openDocPreview(doc)
  globalSearchQuery.value = ''
  isSearchOpen.value = false
}
</script>

<template>
  <header class="h-20 px-8 flex items-center justify-between border-b border-white/40 bg-white/70 backdrop-blur-xl sticky top-0 z-30 shadow-sm transition-all">
    <!-- Left: Welcome & Profile Info -->
    <div class="flex flex-col justify-center">
      <div class="flex items-center space-x-2.5">
        <h2 class="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          欢迎回来，{{ user.name }}
          <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
            {{ user.role }}
          </span>
        </h2>
      </div>
      <p class="text-xs text-slate-500 font-medium flex items-center space-x-2 mt-0.5">
        <span>{{ user.major }}</span>
        <span class="text-slate-300">·</span>
        <span>{{ user.department }}</span>
        <span class="text-slate-300">·</span>
        <span class="text-blue-600 font-semibold">{{ user.safetyUnit }}</span>
        <span class="text-slate-300">·</span>
        <span class="text-slate-600">{{ user.base }}</span>
      </p>
    </div>

    <!-- Right: Search, Notifications, Profile Dropdown -->
    <div class="flex items-center space-x-4">
      <!-- Search Box -->
      <div class="relative w-80">
        <div class="flex items-center bg-slate-100/90 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/40 border border-slate-200/80 rounded-full px-3.5 py-2 transition-all shadow-inner">
          <el-icon class="text-slate-400 mr-2"><Search /></el-icon>
          <input
            v-model="globalSearchQuery"
            @focus="isSearchOpen = true"
            type="text"
            placeholder="搜索课程、问答、资料、手册..."
            class="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none"
          />
          <span v-if="globalSearchQuery" @click="globalSearchQuery = ''" class="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">✕</span>
        </div>

        <!-- Search Results Dropdown -->
        <div 
          v-if="isSearchOpen && globalSearchQuery"
          class="absolute left-0 right-0 top-12 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fadeIn"
        >
          <div class="text-[11px] font-bold text-slate-400 px-2 mb-1.5 uppercase">搜索结果</div>
          
          <div v-if="searchResults.tasks.length === 0 && searchResults.docs.length === 0" class="p-4 text-center text-xs text-slate-400">
            暂未找到与 "{{ globalSearchQuery }}" 相关的课程或文档
          </div>

          <!-- Courses -->
          <div v-if="searchResults.tasks.length > 0" class="mb-2">
            <div class="text-xs font-semibold text-blue-600 px-2 py-1 flex items-center gap-1">
              <el-icon><Reading /></el-icon> 推荐课程
            </div>
            <div
              v-for="t in searchResults.tasks"
              :key="t.id"
              @click="handleSelectTask(t)"
              class="px-2.5 py-1.5 rounded-lg hover:bg-blue-50 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span class="text-xs font-medium text-slate-700 truncate">{{ t.title }}</span>
              <span class="text-[10px] text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">{{ t.categoryLabel }}</span>
            </div>
          </div>

          <!-- Docs -->
          <div v-if="searchResults.docs.length > 0">
            <div class="text-xs font-semibold text-emerald-600 px-2 py-1 flex items-center gap-1">
              <el-icon><Document /></el-icon> 知识手册
            </div>
            <div
              v-for="d in searchResults.docs"
              :key="d.id"
              @click="handleSelectDoc(d)"
              class="px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span class="text-xs font-medium text-slate-700 truncate">{{ d.title }}</span>
              <span class="text-[10px] text-slate-400">{{ d.size }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Check-in Button -->
      <button
        @click="triggerCheckIn"
        :disabled="user.isCheckedInToday"
        class="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm cursor-pointer"
        :class="user.isCheckedInToday 
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 cursor-default' 
          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/20 active:scale-95'"
      >
        <el-icon :size="14"><Check v-if="user.isCheckedInToday" /><RefreshRight v-else /></el-icon>
        <span>{{ user.isCheckedInToday ? '今日已打卡' : '今日打卡 +20分' }}</span>
      </button>

      <!-- Notifications Popover -->
      <el-popover placement="bottom-end" :width="320" trigger="click">
        <template #reference>
          <div class="relative p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 cursor-pointer transition-colors">
            <el-icon :size="18" class="text-slate-600"><Bell /></el-icon>
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </div>
        </template>
        <div class="p-2">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span class="text-xs font-bold text-slate-700">通知中心</span>
            <button @click="markAllRead" class="text-[11px] text-blue-600 hover:underline cursor-pointer">全部已读</button>
          </div>
          <div class="space-y-2">
            <div 
              v-for="item in notifications" 
              :key="item.id"
              class="p-2 rounded-lg text-xs transition-colors"
              :class="item.read ? 'bg-slate-50 text-slate-500' : 'bg-blue-50/60 text-slate-800 font-medium'"
            >
              <div class="line-clamp-2 leading-relaxed">{{ item.title }}</div>
              <div class="text-[10px] text-slate-400 mt-1">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </el-popover>

      <!-- Avatar & User Menu -->
      <div class="flex items-center space-x-2 pl-2 border-l border-slate-200/80">
        <div class="relative w-10 h-10 rounded-full ring-2 ring-blue-500/30 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md">
          <img :src="user.avatar" alt="Avatar" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </header>
</template>
