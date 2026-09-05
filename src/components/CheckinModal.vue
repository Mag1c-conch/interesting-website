<script setup lang="ts">
import { user, modalState } from '../stores/appStore'
import pilotMascot from '../assets/pilot-mascot.png'
import planeMascot from '../assets/plane-mascot.png'

const closeModal = () => {
  modalState.isCheckinModalOpen = false
}
</script>

<template>
  <el-dialog
    v-model="modalState.isCheckinModalOpen"
    width="420px"
    :show-close="false"
    align-center
    class="checkin-modal"
  >
    <div class="text-center p-6 space-y-4">
      <!-- Top Mascot Animation -->
      <div class="relative w-28 h-28 mx-auto">
        <div class="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <img :src="pilotMascot" alt="Mascot" class="w-full h-full object-contain relative z-10 animate-float drop-shadow-xl" />
      </div>

      <div>
        <span class="inline-block text-xs font-bold px-3 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-300 shadow-xs mb-2">
          🎉 签到成功！
        </span>
        <h3 class="text-xl font-black text-slate-800">连续打卡 {{ user.checkinDays }} 天</h3>
        <p class="text-xs text-slate-500 mt-1">
          超过了同期 <span class="text-blue-600 font-bold font-mono">{{ user.checkinBeatenPercent }}%</span> 的新员工学员
        </p>
      </div>

      <!-- Score Rewards card -->
      <div class="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/80 flex items-center justify-around shadow-sm">
        <div>
          <div class="text-lg font-black text-blue-600 font-mono">+20</div>
          <div class="text-[11px] text-slate-500">积分奖励</div>
        </div>
        <div class="w-px h-8 bg-blue-200"></div>
        <div>
          <div class="text-lg font-black text-indigo-600 font-mono">+10</div>
          <div class="text-[11px] text-slate-500">成长经验</div>
        </div>
      </div>

      <p class="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        “每一次起飞都始于严谨，每一次安全降落都源于勤勉。”
      </p>

      <button
        @click="closeModal"
        class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
      >
        收下奖励，开始今日学习
      </button>
    </div>
  </el-dialog>
</template>
