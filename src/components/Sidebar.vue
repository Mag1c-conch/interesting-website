<script setup lang="ts">
import { currentTab } from '../stores/appStore'
import pilotMascot from '../assets/pilot-mascot.png'
import planeMascot from '../assets/plane-mascot.png'
import {
  House,
  Medal,
  Cpu,
  Position,
  Collection,
  Trophy
} from '@element-plus/icons-vue'

const menuItems = [
  { id: 'dashboard', name: '学习平台首页', icon: House },
  { id: 'rewards', name: '积分与激励', icon: Medal },
  { id: 'ai', name: 'AI 学习助手', icon: Cpu },
  { id: 'simulation', name: '技能模拟训练', icon: Position },
  { id: 'knowledge', name: '知识库', icon: Collection },
  { id: 'leaderboard', name: '小组排行榜', icon: Trophy },
]
</script>

<template>
  <aside class="w-64 shrink-0 flex flex-col justify-between p-4 min-h-screen text-slate-100 select-none bg-slate-900/90 backdrop-blur-xl border-r border-blue-900/40 shadow-2xl relative z-20">
    <!-- Brand Header -->
    <div>
      <div class="flex items-center space-x-3 px-2 py-3 mb-6 bg-gradient-to-r from-blue-900/50 to-indigo-900/30 rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-lg">
        <div class="relative w-12 h-12 shrink-0 bg-blue-500/20 rounded-xl flex items-center justify-center p-1 border border-blue-400/40 shadow-inner group">
          <img :src="pilotMascot" alt="Mascot" class="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
          <span class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div class="overflow-hidden">
          <h1 class="text-sm font-bold tracking-wide text-white flex items-center gap-1">
            深圳新员工学习平台
          </h1>
          <p class="text-[10px] text-blue-300/80 font-mono tracking-wider truncate">
            ZHEN-XIN Training Cloud
          </p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="space-y-1.5">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="currentTab = item.id"
          class="w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left relative overflow-hidden group cursor-pointer"
          :class="[
            currentTab === item.id
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/50 scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
          ]"
        >
          <div 
            class="p-1.5 rounded-lg transition-colors"
            :class="currentTab === item.id ? 'bg-white/20 text-white' : 'text-blue-300 group-hover:text-white group-hover:bg-blue-500/20'"
          >
            <el-icon :size="18"><component :is="item.icon" /></el-icon>
          </div>
          <span class="font-medium tracking-wide">{{ item.name }}</span>

          <!-- Active Indicator Light -->
          <div
            v-if="currentTab === item.id"
            class="ml-auto w-1.5 h-4 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]"
          ></div>
        </button>
      </nav>
    </div>

    <!-- Bottom Mascot Banner Card -->
    <div class="mt-6 p-3.5 rounded-2xl bg-gradient-to-b from-blue-900/60 to-slate-900/80 border border-blue-400/30 relative overflow-hidden shadow-xl">
      <div class="absolute -right-3 -bottom-4 w-24 h-24 opacity-30 pointer-events-none">
        <img :src="planeMascot" alt="Airplane" class="w-full h-full object-contain" />
      </div>
      <div class="relative z-10">
        <div class="flex items-center space-x-2 mb-1">
          <span class="text-xs font-bold text-cyan-300">飞行成长路</span>
          <span class="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-400/30">从学徒到机长!</span>
        </div>
        <p class="text-[11px] text-slate-300 leading-relaxed mb-2.5">
          保持每日实操练习，解锁专属波音 737 初始改装资格。
        </p>
        <button 
          @click="currentTab = 'simulation'"
          class="w-full py-1.5 px-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>立即模拟实操</span>
          <el-icon :size="12"><Position /></el-icon>
        </button>
      </div>
    </div>
  </aside>
</template>
