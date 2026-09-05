<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  user, 
  tasks, 
  leaderboardUsers, 
  openTaskDetail, 
  triggerCheckIn,
  currentTab
} from '../stores/appStore'
import pilotMascot from '../assets/pilot-mascot.png'
import planeMascot from '../assets/plane-mascot.png'
import {
  Clock,
  CircleCheck,
  CircleCheckFilled,
  Medal,
  Trophy,
  Promotion,
  DataAnalysis,
  UserFilled
} from '@element-plus/icons-vue'

const activeTaskFilter = ref<'all' | 'ongoing' | 'review'>('all')

const filteredTasks = computed(() => {
  if (activeTaskFilter.value === 'all') return tasks.value
  return tasks.value.filter(t => t.status === activeTaskFilter.value)
})

// Training stages
const trainingStages = [
  { id: 1, name: '飞行业务', status: 'completed', score: '100分', icon: '✈️' },
  { id: 2, name: '安全素养', status: 'completed', score: '98分', icon: '🛡️' },
  { id: 3, name: '应急处理', status: 'current', score: '进行中', icon: '🚨' },
  { id: 4, name: '航空法规', status: 'locked', score: '待解锁', icon: '📜' },
  { id: 5, name: '机场空域', status: 'locked', score: '待解锁', icon: '🌐' },
]
</script>

<template>
  <div class="space-y-5 pb-10">
    <!-- Top Hero Banner Card -->
    <div class="relative overflow-hidden rounded-3xl p-7 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-2xl border border-blue-400/30">
      <!-- Glow background circles -->
      <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"></div>
      <div class="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"></div>
      
      <div class="relative z-10 flex items-center justify-between">
        <div class="space-y-3 max-w-xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-xs font-semibold text-cyan-200">
            <span>✨ 深圳航空新员工翱翔领航计划</span>
          </div>

          <h2 class="text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
            学习成就未来 · 智慧引领飞行
          </h2>
          <p class="text-xs text-blue-100/90 leading-relaxed">
            深圳新员工成长实训平台，融合智能伴学与高保真模拟实操，助您快速胜任岗位，守护蓝天安全！
          </p>

          <!-- Quick Action Buttons -->
          <div class="flex items-center space-x-3 pt-2">
            <button 
              @click="currentTab = 'simulation'"
              class="px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-800 hover:bg-blue-50 shadow-md shadow-black/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>实践演练</span>
              <el-icon><Promotion /></el-icon>
            </button>
            <button 
              @click="currentTab = 'knowledge'"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              知识交流
            </button>
            <button 
              @click="currentTab = 'ai'"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cyan-200 border border-cyan-400/30 backdrop-blur-md transition-all cursor-pointer"
            >
              智能学习
            </button>
          </div>
        </div>

        <!-- Mascots Art Area -->
        <div class="relative flex items-center space-x-2 shrink-0 pointer-events-none pr-4">
          <!-- Plane Mascot Floating -->
          <div class="w-36 h-36 relative animate-float">
            <img :src="planeMascot" alt="Plane Mascot" class="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <!-- Pilot Mascot Standing -->
          <div class="w-40 h-40 relative drop-shadow-2xl">
            <img :src="pilotMascot" alt="Pilot Mascot" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Stats Cards Row (4 Cards) -->
    <div class="grid grid-cols-4 gap-4">
      <!-- Card 1: 学习时长 -->
      <div class="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span class="font-bold text-slate-700">学习时长</span>
          <div class="p-1.5 rounded-lg bg-blue-100/80 text-blue-600">
            <el-icon :size="16"><Clock /></el-icon>
          </div>
        </div>
        <div class="flex items-baseline space-x-1.5">
          <span class="text-2xl font-black text-slate-900 font-mono">{{ user.studyHours }}</span>
          <span class="text-xs text-slate-500 font-medium">小时</span>
        </div>
        <div class="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-2">
          <span>本周 +{{ user.studyHoursWeekChange }}%</span>
          <span class="text-slate-400 font-normal">较上周</span>
        </div>
      </div>

      <!-- Card 2: 任务完成率 -->
      <div class="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span class="font-bold text-slate-700">任务完成率</span>
          <div class="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-600">
            <el-icon :size="16"><CircleCheck /></el-icon>
          </div>
        </div>
        <div class="flex items-baseline space-x-1.5">
          <span class="text-2xl font-black text-slate-900 font-mono">{{ user.taskCompletionRate }}</span>
          <span class="text-xs text-slate-500 font-medium">%</span>
        </div>
        <div class="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-2">
          <span>较上周 +{{ user.taskRateWeekChange }}%</span>
          <span class="text-slate-400 font-normal">稳步提升</span>
        </div>
      </div>

      <!-- Card 3: 累计积分 -->
      <div class="glass-card rounded-2xl p-4.5 relative overflow-hidden group">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span class="font-bold text-slate-700">累计积分</span>
          <div class="p-1.5 rounded-lg bg-amber-100/80 text-amber-600">
            <el-icon :size="16"><Medal /></el-icon>
          </div>
        </div>
        <div class="flex items-baseline space-x-1.5">
          <span class="text-2xl font-black text-slate-900 font-mono">{{ user.points }}</span>
          <span class="text-xs text-slate-500 font-medium">分</span>
        </div>
        <div class="flex items-center space-x-1 text-[11px] text-amber-600 font-semibold mt-2">
          <span>本月 +380分</span>
          <span class="text-slate-400 font-normal">可兑换机模</span>
        </div>
      </div>

      <!-- Card 4: 连续打卡 -->
      <div 
        @click="triggerCheckIn"
        class="glass-card rounded-2xl p-4.5 relative overflow-hidden group cursor-pointer transition-all hover:border-blue-400"
        :class="user.isCheckedInToday ? '' : 'ring-2 ring-blue-400/40'"
      >
        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span class="font-bold text-slate-700">连续打卡</span>
          <div class="p-1.5 rounded-lg bg-indigo-100/80 text-indigo-600">
            <el-icon :size="16"><Calendar /></el-icon>
          </div>
        </div>
        <div class="flex items-baseline space-x-1.5">
          <span class="text-2xl font-black text-slate-900 font-mono">{{ user.checkinDays }}</span>
          <span class="text-xs text-slate-500 font-medium">天</span>
        </div>
        <div class="flex items-center justify-between text-[11px] mt-2">
          <span class="text-indigo-600 font-semibold">超 {{ user.checkinBeatenPercent }}% 同期学员</span>
          <span class="text-[10px] text-blue-600 font-bold underline">{{ user.isCheckedInToday ? '已签到' : '点击打卡' }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Split Grid -->
    <div class="grid grid-cols-12 gap-5">
      <!-- Left Column: 推荐学习任务 (7 cols) -->
      <div class="col-span-7 space-y-5">
        <!-- 推荐任务 Panel -->
        <div class="glass-card rounded-3xl p-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-3">
              <h3 class="text-base font-bold text-slate-800 flex items-center gap-1.5">
                推荐学习任务
              </h3>
              <!-- Task Filter Pills -->
              <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  v-for="filter in [
                    { id: 'all', label: '全部' },
                    { id: 'ongoing', label: '进行中' },
                    { id: 'review', label: '待复习' }
                  ]"
                  :key="filter.id"
                  @click="activeTaskFilter = filter.id as any"
                  class="px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer"
                  :class="activeTaskFilter === filter.id ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>

            <span class="text-xs text-slate-400">已自动根据入职画像定制</span>
          </div>

          <!-- Task Cards List -->
          <div class="space-y-3 mt-4">
            <div
              v-for="task in filteredTasks"
              :key="task.id"
              class="p-4 rounded-2xl bg-white/90 hover:bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-xs hover:shadow-md flex items-center justify-between group"
            >
              <div class="flex items-center space-x-3.5">
                <div 
                  class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  :class="{
                    'bg-blue-100/80 text-blue-600': task.category === 'theory',
                    'bg-purple-100/80 text-purple-600': task.category === 'vr',
                    'bg-emerald-100/80 text-emerald-600': task.category === 'safety'
                  }"
                >
                  <el-icon :size="20">
                    <Search v-if="task.category === 'theory'" />
                    <Monitor v-else-if="task.category === 'vr'" />
                    <CircleCheckFilled v-else />
                  </el-icon>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {{ task.title }}
                  </h4>
                  <div class="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                    <span>{{ task.categoryLabel }}</span>
                    <span>·</span>
                    <span class="text-slate-500">进度 {{ task.progress }}%</span>
                  </div>
                  <!-- Mini Progress Bar -->
                  <div class="w-36 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-500"
                      :class="task.progress >= 90 ? 'bg-emerald-500' : 'bg-blue-600'"
                      :style="{ width: task.progress + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div>
                <button
                  @click="openTaskDetail(task)"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                  :class="{
                    'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20': task.status === 'ongoing',
                    'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200': task.status === 'review',
                    'bg-slate-100 hover:bg-slate-200 text-slate-700': task.status === 'not_started',
                    'bg-emerald-50 text-emerald-600 border border-emerald-200': task.status === 'completed'
                  }"
                >
                  <span v-if="task.status === 'ongoing'">继续学习</span>
                  <span v-else-if="task.status === 'review'">去复习</span>
                  <span v-else-if="task.status === 'completed'">已结课 · 查看</span>
                  <span v-else>开始学习</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Left: VR 实操与维修模拟卡片 -->
        <div class="glass-card rounded-3xl p-5 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
          <div class="relative z-10 flex items-center justify-between">
            <div class="space-y-2 max-w-sm">
              <span class="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                VR 模拟实训营
              </span>
              <h4 class="text-base font-bold">VR 操纵模拟与实操排故</h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                沉浸式全动座舱演练，涵盖起飞滑跑、失压特情处置与绕机检查。全天候提升岗位实战技能！
              </p>
              <button
                @click="currentTab = 'simulation'"
                class="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>立即体验</span>
                <el-icon><ArrowRight /></el-icon>
              </button>
            </div>

            <div class="w-32 h-32 shrink-0 pointer-events-none relative">
              <img :src="pilotMascot" alt="VR Pilot" class="w-full h-full object-contain drop-shadow-xl animate-float" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: 培训进阶路径 & 小组英雄榜 & 成长积分 (5 cols) -->
      <div class="col-span-5 space-y-5">
        <!-- 培训进阶路径 -->
        <div class="glass-card rounded-3xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-bold text-slate-800">培训进阶路径</h3>
            <span class="text-xs text-blue-600 font-medium">当前阶段: 应急处理</span>
          </div>

          <!-- Stage Pathway Nodes -->
          <div class="flex items-center justify-between relative py-2">
            <!-- Background connecting line -->
            <div class="absolute left-6 right-6 top-6 h-1 bg-slate-200 -z-0"></div>
            <div class="absolute left-6 w-1/2 top-6 h-1 bg-blue-600 -z-0 transition-all duration-700"></div>

            <div 
              v-for="stage in trainingStages" 
              :key="stage.id" 
              class="flex flex-col items-center relative z-10 text-center"
            >
              <div 
                class="w-9 h-9 rounded-full flex items-center justify-center text-xs shadow-md transition-all"
                :class="{
                  'bg-blue-600 text-white ring-4 ring-blue-100': stage.status === 'completed',
                  'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse': stage.status === 'current',
                  'bg-slate-200 text-slate-400': stage.status === 'locked'
                }"
              >
                <span>{{ stage.icon }}</span>
              </div>
              <span class="text-xs font-bold text-slate-700 mt-2">{{ stage.name }}</span>
              <span 
                class="text-[10px] mt-0.5 font-medium"
                :class="stage.status === 'completed' ? 'text-emerald-600' : stage.status === 'current' ? 'text-amber-600 font-bold' : 'text-slate-400'"
              >
                {{ stage.score }}
              </span>
            </div>
          </div>
        </div>

        <!-- 小组排行榜微件 -->
        <div class="glass-card rounded-3xl p-5">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <div class="flex items-center space-x-1.5">
              <el-icon class="text-amber-500"><Trophy /></el-icon>
              <h3 class="text-base font-bold text-slate-800">小组英雄榜</h3>
            </div>
            <button 
              @click="currentTab = 'leaderboard'" 
              class="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              全部排名 <el-icon :size="12"><ArrowRight /></el-icon>
            </button>
          </div>

          <!-- Podium Mini Items -->
          <div class="space-y-2">
            <div 
              v-for="(u, idx) in leaderboardUsers.slice(0, 3)"
              :key="u.rank"
              class="flex items-center justify-between p-2.5 rounded-xl transition-all"
              :class="u.rank === 1 ? 'bg-amber-50/80 border border-amber-200/80' : 'bg-slate-50/80 border border-slate-100'"
            >
              <div class="flex items-center space-x-2.5">
                <span 
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs"
                  :class="{
                    'bg-amber-400 text-white': idx === 0,
                    'bg-slate-300 text-slate-700': idx === 1,
                    'bg-amber-600 text-white': idx === 2
                  }"
                >
                  {{ u.rank }}
                </span>
                <div class="w-7 h-7 rounded-full overflow-hidden bg-white border border-slate-200">
                  <img :src="u.avatar" alt="" class="w-full h-full object-cover" />
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-800">{{ u.name }}</div>
                  <div class="text-[10px] text-slate-400">{{ u.badge }}</div>
                </div>
              </div>

              <div class="text-right">
                <span class="text-xs font-black text-blue-600 font-mono">{{ u.points }}</span>
                <span class="text-[10px] text-slate-400 ml-0.5">分</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 成长积分与分段仪表卡 -->
        <div class="glass-card rounded-3xl p-5">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-slate-800">成长积分与等级</h3>
            <span class="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {{ user.level }}
            </span>
          </div>

          <div class="flex items-baseline space-x-2 my-2">
            <span class="text-3xl font-black text-slate-900 font-mono">{{ user.growthScore }}</span>
            <span class="text-xs text-slate-400">/ 2000 EXP 升级到中级副驾驶</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
              :style="{ width: (user.growthScore / 2000) * 100 + '%' }"
            ></div>
          </div>

          <!-- 4 Breakdown categories -->
          <div class="grid grid-cols-4 gap-1 text-center pt-2 border-t border-slate-100">
            <div class="p-1 rounded-lg bg-slate-50">
              <div class="text-[11px] font-bold text-blue-600 font-mono">+40</div>
              <div class="text-[10px] text-slate-400">学习任务</div>
            </div>
            <div class="p-1 rounded-lg bg-slate-50">
              <div class="text-[11px] font-bold text-indigo-600 font-mono">+20</div>
              <div class="text-[10px] text-slate-400">AI互动</div>
            </div>
            <div class="p-1 rounded-lg bg-slate-50">
              <div class="text-[11px] font-bold text-cyan-600 font-mono">+50</div>
              <div class="text-[10px] text-slate-400">VR操纵</div>
            </div>
            <div class="p-1 rounded-lg bg-slate-50">
              <div class="text-[11px] font-bold text-emerald-600 font-mono">+30</div>
              <div class="text-[10px] text-slate-400">考核满分</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
