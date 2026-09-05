<script setup lang="ts">
import { ref, computed } from 'vue'
import { user } from '../stores/appStore'
import confetti from 'canvas-confetti'
import { ElMessage } from 'element-plus'
import pilotMascot from '../assets/pilot-mascot.png'
import planeMascot from '../assets/plane-mascot.png'
import {
  Position,
  Check,
  CircleCheckFilled,
  Warning,
  Refresh,
  Trophy,
  Compass,
  Monitor
} from '@element-plus/icons-vue'

// Checklist Items
const checklistItems = ref([
  { id: 1, name: '机组氧气面罩与机内麦克风', req: '100% 测试通过并指示正常', done: false },
  { id: 2, name: '全机主航向与备用姿态仪', req: 'QNH 场压调定核对一致', done: false },
  { id: 3, name: 'APU 发电机与左右主汇流条', req: '全部接通供电正常', done: false },
  { id: 4, name: '左右翼主燃油泵开关', req: '4具燃油泵 ON / 低压灯熄灭', done: false },
  { id: 5, name: 'TCAS 防撞系统与应答机', req: 'TA/RA 模式接通，编码 4721', done: false },
  { id: 6, name: '起飞襟翼设定与指示', req: '设定 FLAPS 5 绿灯常亮', done: false },
])

const completedChecksCount = computed(() => checklistItems.value.filter(i => i.done).length)

const toggleCheckItem = (item: any) => {
  item.done = !item.done
  if (completedChecksCount.value === checklistItems.value.length) {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    })
    ElMessage.success('🎉 恭喜！起飞前检查单全部项目交叉核对通过，允许滑入跑道！')
    user.points += 30
  }
}

const resetChecklist = () => {
  checklistItems.value.forEach(i => i.done = false)
}

// Emergency Scenario Simulation
const selectedScenarioStep = ref(1)
const scenarioResult = ref<string | null>(null)

const handleScenarioChoice = (choice: 'interrupt' | 'continue') => {
  if (choice === 'continue') {
    scenarioResult.value = 'success'
    ElMessage.success('决策准确！V1 之后风切变必须全推力爬升并保持俯仰姿态！')
    user.points += 40
    confetti({ particleCount: 80, spread: 70 })
  } else {
    scenarioResult.value = 'failed'
    ElMessage.error('严禁在 V1 之后中断起飞！高速中断起飞极易造成冲出跑道重大事故！')
  }
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header Banner -->
    <div class="glass-card rounded-3xl p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      <div class="flex items-center justify-between">
        <div class="space-y-2 max-w-xl">
          <span class="text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            虚拟座舱交互实训
          </span>
          <h2 class="text-2xl font-black">波音 737 / A320 飞行前标准操作与特情仿真</h2>
          <p class="text-xs text-slate-300 leading-relaxed">
            支持鼠标互动式打钩排查飞行前检查单（Before Takeoff Checklist），以及关键决断速度下的突发特情处置推演。
          </p>
        </div>

        <div class="w-32 h-32 shrink-0 pointer-events-none pr-4">
          <img :src="planeMascot" alt="" class="w-full h-full object-contain animate-float drop-shadow-xl" />
        </div>
      </div>
    </div>

    <!-- Main 2-Column Simulators -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Left: 飞行前检查单交互演练 (7 cols) -->
      <div class="col-span-7 glass-card rounded-3xl p-6">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
              <el-icon class="text-blue-600"><Check /></el-icon>
              飞行前检查单（Checklist）交互式演练
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">请用鼠标逐项核实仪表状态并打钩确认</p>
          </div>

          <button
            @click="resetChecklist"
            class="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
          >
            <el-icon><Refresh /></el-icon> 重置检查单
          </button>
        </div>

        <!-- Progress meter -->
        <div class="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-slate-700">完成进度：</span>
            <span class="text-sm font-black text-blue-600 font-mono">{{ completedChecksCount }} / {{ checklistItems.length }}</span>
          </div>
          <div class="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-emerald-500 rounded-full transition-all duration-300"
              :style="{ width: (completedChecksCount / checklistItems.length) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <!-- Checklist List -->
        <div class="space-y-2.5">
          <div
            v-for="item in checklistItems"
            :key="item.id"
            @click="toggleCheckItem(item)"
            class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group"
            :class="item.done 
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 shadow-xs' 
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300'"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                :class="item.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 group-hover:text-blue-500'"
              >
                <el-icon :size="16"><Check /></el-icon>
              </div>
              <div>
                <div class="text-xs font-bold" :class="item.done ? 'line-through text-slate-500' : 'text-slate-800'">
                  {{ item.name }}
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">标准要求：{{ item.req }}</div>
              </div>
            </div>

            <span 
              class="text-xs font-bold font-mono px-2 py-0.5 rounded-md"
              :class="item.done ? 'bg-emerald-200/80 text-emerald-800' : 'bg-slate-100 text-slate-400'"
            >
              {{ item.done ? 'CHECKED ✓' : 'STANDBY' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: 特情处置决断演练 (5 cols) -->
      <div class="col-span-5 glass-card rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div class="pb-3 border-b border-slate-100 mb-4">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
              <el-icon class="text-rose-500"><Warning /></el-icon>
              突发特情处置决策分支模拟
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">情境模拟考验机长决策意识与SOP执行力</p>
          </div>

          <!-- Scenario Card -->
          <div class="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 text-xs text-rose-900 leading-relaxed mb-4">
            <div class="font-bold mb-1 flex items-center gap-1.5 text-rose-800">
              <span>⚠️ 情境警报：起飞滑跑速度达 152 节（已超过 V1 决断速度 148 节）</span>
            </div>
            <p>
              此时机载增强型气象雷达突然触发强烈语音警报：“WINDSHEAR AHEAD! WINDSHEAR AHEAD!”，且前方跑道端出现强下冲气流。
            </p>
          </div>

          <h4 class="text-xs font-bold text-slate-700 mb-2">机组当务之急的决定是：</h4>
          
          <div class="space-y-3">
            <div
              @click="handleScenarioChoice('interrupt')"
              class="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 transition-all cursor-pointer text-xs"
            >
              <div class="font-bold text-slate-800">分支 A：立即收上油门杆，最大手动刹车中止起飞</div>
              <div class="text-[11px] text-slate-400 mt-1">强行刹车停在跑道内</div>
            </div>

            <div
              @click="handleScenarioChoice('continue')"
              class="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/50 transition-all cursor-pointer text-xs"
            >
              <div class="font-bold text-slate-800">分支 B：继续起飞，推力手柄前推至最大起飞推力，保持俯仰</div>
              <div class="text-[11px] text-slate-400 mt-1">遵照风切变规避程序离地建立正上升率</div>
            </div>
          </div>

          <!-- Feedback alert -->
          <div v-if="scenarioResult" class="mt-4 p-3 rounded-xl text-xs font-semibold"
            :class="scenarioResult === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
          >
            <span v-if="scenarioResult === 'success'">
              🎯 考官评分：100分。完全符合 CCAR-121 SOP 规范，严谨保全机组安全！
            </span>
            <span v-else>
              ❌ 考官扣分：0分。V1 后强行中断起飞会导致机轮起火爆胎甚至冲出跑道！
            </span>
          </div>
        </div>

        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-500 mt-4">
          <span>完成模拟可累计特情加分</span>
          <span class="text-blue-600 font-bold">+40 EXP</span>
        </div>
      </div>
    </div>
  </div>
</template>
