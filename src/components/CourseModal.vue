<script setup lang="ts">
import { ref } from 'vue'
import { modalState, completeCurrentTask } from '../stores/appStore'
import { ElMessage } from 'element-plus'
import { VideoPlay, CircleCheckFilled, Trophy, Close, Clock, Reading } from '@element-plus/icons-vue'

const quizAnswer = ref('')
const isQuizSubmitted = ref(false)
const isQuizCorrect = ref(false)

const handleQuizSubmit = (option: string) => {
  quizAnswer.value = option
  isQuizSubmitted.value = true
  if (option === 'B') {
    isQuizCorrect.value = true
    ElMessage.success('回答正确！获得随堂测验奖励 +10 积分')
  } else {
    isQuizCorrect.value = false
    ElMessage.warning('回答错误，请重温课件要点。正确答案为 B')
  }
}

const handleFinishCourse = () => {
  if (modalState.activeTask) {
    completeCurrentTask(modalState.activeTask.id)
    ElMessage.success(`恭喜完成《${modalState.activeTask.title}》！已发放 50 积分`)
    modalState.isCourseModalOpen = false
  }
}
</script>

<template>
  <el-dialog
    v-model="modalState.isCourseModalOpen"
    :title="modalState.activeTask?.title || '在线课程研习'"
    width="850px"
    destroy-on-close
    center
    align-center
  >
    <div v-if="modalState.activeTask" class="space-y-5">
      <!-- Course Meta Header -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
              {{ modalState.activeTask.categoryLabel }}
            </span>
            <span class="text-xs text-slate-500 flex items-center gap-1">
              <el-icon><Clock /></el-icon> 建议学时：{{ modalState.activeTask.duration }}
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-1">
            {{ modalState.activeTask.description }}
          </p>
        </div>
        <div class="text-right shrink-0">
          <div class="text-2xl font-black text-blue-600 font-mono">{{ modalState.activeTask.progress }}%</div>
          <div class="text-[11px] text-slate-400">当前完成进度</div>
        </div>
      </div>

      <!-- Simulated Video / 3D Simulation Frame -->
      <div class="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col items-center justify-center text-white group">
        <!-- Background Grid / Avionics HUD Graphic -->
        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

        <!-- Center Interactive Animation -->
        <div class="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
          <div class="w-16 h-16 rounded-full bg-blue-600/80 hover:bg-blue-500 border border-blue-400/50 flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform duration-300 group-hover:scale-110 cursor-pointer">
            <el-icon :size="32" class="text-white ml-1"><VideoPlay /></el-icon>
          </div>
          <div>
            <h4 class="text-base font-bold text-slate-100">第 04 讲：副翼与扰流板差动铰链联锁检查</h4>
            <p class="text-xs text-slate-400 mt-1">深航飞行技术专家录制 · 1080P 超清实操录屏</p>
          </div>
        </div>

        <!-- Video Player Bottom Controls Bar -->
        <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-between text-xs text-slate-300 z-10">
          <div class="flex items-center space-x-3">
            <span class="text-emerald-400 flex items-center gap-1 font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              播放中 18:42 / 24:00
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 rounded bg-white/10 text-[10px]">1.25X</span>
            <span class="px-2 py-0.5 rounded bg-white/10 text-[10px]">高清</span>
          </div>
        </div>
      </div>

      <!-- Quick Quiz section -->
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <h5 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <el-icon class="text-amber-500"><Trophy /></el-icon>
            随堂即时微测验（通关必答）
          </h5>
          <span class="text-[11px] text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-full font-medium">
            答对加 10 积分
          </span>
        </div>
        <p class="text-xs text-slate-600 mb-3">
          问题：在标准进近着陆阶段，主飞行操纵指令优先权原则中，副翼与地面减速板（飞行扰流板）何时发生复合偏转？
        </p>

        <div class="space-y-2">
          <div 
            @click="handleQuizSubmit('A')"
            class="p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between"
            :class="quizAnswer === 'A' ? 'bg-rose-50 border-rose-400 text-rose-700' : 'bg-white border-slate-200 hover:border-blue-400'"
          >
            <span>A. 仅在主轮接地压缩电门闭合瞬间</span>
            <span v-if="quizAnswer === 'A'" class="text-rose-600 font-bold">✕ 错误</span>
          </div>

          <div 
            @click="handleQuizSubmit('B')"
            class="p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between"
            :class="quizAnswer === 'B' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold' : 'bg-white border-slate-200 hover:border-blue-400'"
          >
            <span>B. 驾驶盘转角超过 10° 时，扰流板协同副翼参与横侧操纵</span>
            <span v-if="quizAnswer === 'B'" class="text-emerald-600 font-bold">✓ 正确</span>
          </div>

          <div 
            @click="handleQuizSubmit('C')"
            class="p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between"
            :class="quizAnswer === 'C' ? 'bg-rose-50 border-rose-400 text-rose-700' : 'bg-white border-slate-200 hover:border-blue-400'"
          >
            <span>C. 在反推完全展开后才生效</span>
            <span v-if="quizAnswer === 'C'" class="text-rose-600 font-bold">✕ 错误</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full pt-2">
        <span class="text-xs text-slate-400">
          完成学习后，任务进度将自动同步到首页仪表盘
        </span>
        <div class="space-x-3">
          <el-button @click="modalState.isCourseModalOpen = false">稍后继续</el-button>
          <el-button type="primary" @click="handleFinishCourse">
            完成本节学习并领取积分 (+50分)
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
