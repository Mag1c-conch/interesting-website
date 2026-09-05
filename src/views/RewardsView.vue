<script setup lang="ts">
import { user, badges, shopItems, exchangeReward } from '../stores/appStore'
import { ElMessage } from 'element-plus'
import pilotMascot from '../assets/pilot-mascot.png'
import planeMascot from '../assets/plane-mascot.png'
import {
  Medal,
  Present,
  Trophy,
  Check,
  Star,
  ShoppingBag,
  Calendar,
  Tickets,
  Lock
} from '@element-plus/icons-vue'

const handleExchange = (item: any) => {
  const result = exchangeReward(item)
  if (result.success) {
    ElMessage.success(result.msg)
  } else {
    ElMessage.error(result.msg)
  }
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Rewards Hero Overview -->
    <div class="glass-card rounded-3xl p-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-blue-500/10 border border-amber-300/40 relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div class="space-y-2 max-w-lg">
          <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 text-xs font-bold border border-amber-400/40">
            <el-icon><Medal /></el-icon>
            <span>学员成长与荣誉激励中心</span>
          </div>
          <h2 class="text-2xl font-black text-slate-900">
            累计学习积分：<span class="text-3xl text-amber-600 font-mono">{{ user.points }}</span> 分
          </h2>
          <p class="text-xs text-slate-600 leading-relaxed">
            您当前段位为 <span class="font-bold text-blue-700">{{ user.level }}</span>。完成实操培训课程、坚持每日打卡及通过特情考核，均可快速赢取积分，兑换独家定制机模与实训进阶权益！
          </p>
        </div>

        <div class="flex items-center space-x-4 shrink-0 pr-4">
          <div class="w-28 h-28 relative">
            <img :src="pilotMascot" alt="Mascot" class="w-full h-full object-contain animate-float drop-shadow-xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- Badges Wall Section (荣誉勋章墙) -->
    <div class="glass-card rounded-3xl p-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <el-icon class="text-amber-500"><Trophy /></el-icon>
            飞行学员荣誉勋章墙
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">已点亮 4 / 6 枚专属荣誉勋章</p>
        </div>
        <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
          勋章点亮率 67%
        </span>
      </div>

      <div class="grid grid-cols-6 gap-4">
        <div
          v-for="badge in badges"
          :key="badge.id"
          class="p-4 rounded-2xl border text-center transition-all group flex flex-col items-center justify-between"
          :class="badge.unlocked 
            ? 'bg-gradient-to-b from-amber-50/80 to-white border-amber-200 shadow-xs hover:shadow-md hover:scale-105' 
            : 'bg-slate-50/80 border-slate-200 opacity-60'"
        >
          <div 
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner mb-2 transition-transform duration-300 group-hover:scale-110"
            :class="badge.unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-400/40' : 'bg-slate-200 text-slate-400'"
          >
            <el-icon v-if="badge.unlocked"><Trophy /></el-icon>
            <el-icon v-else><Lock /></el-icon>
          </div>

          <h4 class="text-xs font-bold text-slate-800">{{ badge.title }}</h4>
          <p class="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{{ badge.desc }}</p>

          <span 
            class="text-[9px] font-bold px-2 py-0.5 rounded-full mt-3 uppercase tracking-wider"
            :class="badge.unlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'"
          >
            {{ badge.unlocked ? '已解锁' : '未解锁' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Points Exchange Mall (积分商城) -->
    <div class="glass-card rounded-3xl p-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <el-icon class="text-rose-500"><Present /></el-icon>
            新员工实训积分商城
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">积分可兑换精美航空周边及模拟机进阶体验权益</p>
        </div>
        <div class="text-xs text-slate-500">
          可用积分：<span class="font-bold text-amber-600 font-mono text-sm">{{ user.points }}</span> 分
        </div>
      </div>

      <div class="grid grid-cols-4 gap-5">
        <div
          v-for="item in shopItems"
          :key="item.id"
          class="glass-card rounded-2xl p-4 flex flex-col justify-between border border-slate-200 hover:border-blue-300 transition-all group"
        >
          <div>
            <!-- Item visual -->
            <div class="w-full h-36 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-blue-50/80 transition-colors">
              <img :src="item.image" alt="" class="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
              <span class="absolute top-2 left-2 text-[10px] bg-white/90 text-blue-700 font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                {{ item.category }}
              </span>
            </div>

            <h4 class="text-xs font-bold text-slate-800 mt-3 group-hover:text-blue-600 transition-colors">
              {{ item.title }}
            </h4>
            <div class="flex items-baseline justify-between mt-2">
              <span class="text-sm font-black text-amber-600 font-mono">{{ item.cost }} <span class="text-[10px] font-normal text-slate-400">积分</span></span>
              <span class="text-[11px] text-slate-400">仅剩 {{ item.stock }} 件</span>
            </div>
          </div>

          <button
            @click="handleExchange(item)"
            :disabled="user.points < item.cost || item.stock <= 0"
            class="w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :class="item.exchanged
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'"
          >
            <span v-if="item.exchanged">再次兑换</span>
            <span v-else-if="user.points < item.cost">积分不足</span>
            <span v-else>立即兑换</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
