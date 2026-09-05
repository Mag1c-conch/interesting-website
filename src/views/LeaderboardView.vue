<script setup lang="ts">
import { ref } from 'vue'
import { leaderboardUsers, likeUser } from '../stores/appStore'
import pilotMascot from '../assets/pilot-mascot.png'
import planeMascot from '../assets/plane-mascot.png'
import { Trophy, Medal, Star, ArrowUp, ArrowDown, Search } from '@element-plus/icons-vue'

const activeBoard = ref<'week' | 'month' | 'overall'>('week')
const searchQuery = ref('')

const handleLike = (userRank: number) => {
  likeUser(userRank)
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header & Podium Top -->
    <div class="glass-card rounded-3xl p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      <div class="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40 mb-2">
            <el-icon><Trophy /></el-icon>
            <span>新员工班级争先榜</span>
          </div>
          <h2 class="text-2xl font-black">2026年承德基地飞行学员排行榜</h2>
          <p class="text-xs text-slate-300 mt-1">
            实时汇总学员线上理论学时、VR实操得分及每日考勤。榜单前三名将获颁“优秀飞天之星”荣誉勋章。
          </p>
        </div>

        <!-- Board Switch -->
        <div class="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20">
          <button
            @click="activeBoard = 'week'"
            class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="activeBoard === 'week' ? 'bg-white text-blue-900 shadow-md' : 'text-white/80 hover:text-white'"
          >
            本周学时榜
          </button>
          <button
            @click="activeBoard = 'month'"
            class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="activeBoard === 'month' ? 'bg-white text-blue-900 shadow-md' : 'text-white/80 hover:text-white'"
          >
            本月积分榜
          </button>
          <button
            @click="activeBoard = 'overall'"
            class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="activeBoard === 'overall' ? 'bg-white text-blue-900 shadow-md' : 'text-white/80 hover:text-white'"
          >
            实训总排行
          </button>
        </div>
      </div>

      <!-- 3D Podium Layout (Top 3) -->
      <div class="grid grid-cols-3 gap-4 pt-6 max-w-2xl mx-auto items-end text-center">
        <!-- 2nd Place (Silver) -->
        <div class="flex flex-col items-center space-y-2">
          <div class="relative w-16 h-16 rounded-full ring-4 ring-slate-300 bg-white p-1 shadow-lg">
            <img :src="leaderboardUsers[1].avatar" alt="" class="w-full h-full object-cover rounded-full" />
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded-full bg-slate-300 text-slate-900 shadow-xs">
              TOP 2
            </span>
          </div>
          <div class="text-xs font-bold">{{ leaderboardUsers[1].name }}</div>
          <div class="text-[11px] text-slate-300 font-mono font-bold">{{ leaderboardUsers[1].points }} 分</div>
          <div class="w-full h-24 bg-gradient-to-t from-slate-700 to-slate-600/60 rounded-t-2xl flex items-center justify-center border-t border-slate-400">
            <span class="text-2xl font-black text-slate-300">2</span>
          </div>
        </div>

        <!-- 1st Place (Gold Champion) -->
        <div class="flex flex-col items-center space-y-2">
          <div class="relative w-20 h-20 rounded-full ring-4 ring-amber-400 bg-white p-1 shadow-2xl animate-float">
            <img :src="leaderboardUsers[0].avatar" alt="" class="w-full h-full object-cover rounded-full" />
            <span class="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md">
              👑 榜首
            </span>
          </div>
          <div class="text-xs font-bold text-amber-300">{{ leaderboardUsers[0].name }}</div>
          <div class="text-xs text-amber-400 font-mono font-black">{{ leaderboardUsers[0].points }} 分</div>
          <div class="w-full h-32 bg-gradient-to-t from-amber-600 to-amber-500/70 rounded-t-2xl flex items-center justify-center border-t border-amber-300">
            <span class="text-3xl font-black text-amber-100">1</span>
          </div>
        </div>

        <!-- 3rd Place (Bronze) -->
        <div class="flex flex-col items-center space-y-2">
          <div class="relative w-16 h-16 rounded-full ring-4 ring-amber-700 bg-white p-1 shadow-lg">
            <img :src="leaderboardUsers[2].avatar" alt="" class="w-full h-full object-cover rounded-full" />
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded-full bg-amber-700 text-white shadow-xs">
              TOP 3
            </span>
          </div>
          <div class="text-xs font-bold">{{ leaderboardUsers[2].name }}</div>
          <div class="text-[11px] text-slate-300 font-mono font-bold">{{ leaderboardUsers[2].points }} 分</div>
          <div class="w-full h-18 bg-gradient-to-t from-amber-900 to-amber-800/60 rounded-t-2xl flex items-center justify-center border-t border-amber-600">
            <span class="text-2xl font-black text-amber-500">3</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Table of Rankings -->
    <div class="glass-card rounded-3xl p-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h3 class="text-base font-bold text-slate-800">全员学习榜单细目</h3>
        <span class="text-xs text-slate-400">数据每小时动态核算</span>
      </div>

      <div class="space-y-2">
        <div
          v-for="u in leaderboardUsers"
          :key="u.rank"
          class="p-3 rounded-2xl transition-all flex items-center justify-between"
          :class="u.name.includes('我')
            ? 'bg-blue-50/90 border-2 border-blue-400/80 shadow-xs'
            : 'bg-white hover:bg-slate-50 border border-slate-100'"
        >
          <div class="flex items-center space-x-4">
            <span 
              class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black"
              :class="{
                'bg-amber-400 text-white': u.rank === 1,
                'bg-slate-300 text-slate-800': u.rank === 2,
                'bg-amber-700 text-white': u.rank === 3,
                'bg-slate-100 text-slate-500': u.rank > 3
              }"
            >
              {{ u.rank }}
            </span>

            <div class="w-9 h-9 rounded-full overflow-hidden bg-white border border-slate-200">
              <img :src="u.avatar" alt="" class="w-full h-full object-cover" />
            </div>

            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold text-slate-800">{{ u.name }}</span>
                <span v-if="u.badge" class="text-[10px] bg-blue-100/70 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {{ u.badge }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ u.department }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-6">
            <div class="text-right">
              <span class="text-sm font-black text-blue-600 font-mono">{{ u.points }}</span>
              <span class="text-[10px] text-slate-400 ml-1">分</span>
            </div>

            <!-- Like button -->
            <button
              @click="handleLike(u.rank)"
              class="flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer"
              :class="u.hasLiked ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-500'"
            >
              <span>❤️</span>
              <span>{{ u.likes }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
