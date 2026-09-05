<script setup lang="ts">
import { ref } from 'vue'
import { modalState, toggleDocBookmark } from '../stores/appStore'
import { ElMessage } from 'element-plus'
import { Document, Star, StarFilled, Download, Printer, ZoomIn, ZoomOut, Search } from '@element-plus/icons-vue'

const isDownloading = ref(false)
const zoomLevel = ref(100)

const handleDownload = () => {
  isDownloading.value = true
  setTimeout(() => {
    isDownloading.value = false
    ElMessage.success(`《${modalState.activeDoc?.title}》已成功下载至本地`)
    if (modalState.activeDoc) {
      modalState.activeDoc.downloads += 1
    }
  }, 1000)
}

const handleBookmark = () => {
  if (modalState.activeDoc) {
    toggleDocBookmark(modalState.activeDoc.id)
    if (modalState.activeDoc.isBookmarked) {
      ElMessage.success('已加入个人常备手册收藏夹')
    } else {
      ElMessage.info('已取消收藏')
    }
  }
}
</script>

<template>
  <el-dialog
    v-model="modalState.isDocModalOpen"
    :title="modalState.activeDoc?.title || '技术资料在线预览'"
    width="900px"
    destroy-on-close
    center
    align-center
  >
    <div v-if="modalState.activeDoc" class="space-y-4">
      <!-- Doc Toolbar -->
      <div class="flex items-center justify-between p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 rounded bg-blue-600 text-white font-bold uppercase text-[10px]">
            {{ modalState.activeDoc.type }}
          </span>
          <span class="text-slate-500 font-medium">文件大小: {{ modalState.activeDoc.size }}</span>
          <span class="text-slate-300">|</span>
          <span class="text-slate-500">更新时间: {{ modalState.activeDoc.date }}</span>
          <span class="text-slate-300">|</span>
          <span class="text-blue-600 font-medium">标签: {{ modalState.activeDoc.tag }}</span>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="handleBookmark"
            class="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <el-icon :size="14" :class="modalState.activeDoc.isBookmarked ? 'text-amber-500' : 'text-slate-400'">
              <StarFilled v-if="modalState.activeDoc.isBookmarked" />
              <Star v-else />
            </el-icon>
            <span>{{ modalState.activeDoc.isBookmarked ? '已收藏' : '收藏' }}</span>
          </button>

          <button
            @click="handleDownload"
            :disabled="isDownloading"
            class="flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <el-icon :size="14"><Download /></el-icon>
            <span>{{ isDownloading ? '下载中...' : '下载文档' }}</span>
          </button>
        </div>
      </div>

      <!-- Reader Document Body -->
      <div class="border border-slate-200 rounded-2xl bg-slate-50 p-6 max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner font-sans">
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200/80 space-y-6 text-slate-800">
          <div class="text-center pb-4 border-b border-slate-200">
            <span class="text-[10px] text-blue-600 font-mono tracking-wider uppercase bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              ZHENXIN AVIATION FLIGHT OPERATIONS
            </span>
            <h3 class="text-xl font-bold mt-2 text-slate-900">{{ modalState.activeDoc.title }}</h3>
            <p class="text-xs text-slate-400 mt-1">文件编号: CAAC-FS-2026-{{ modalState.activeDoc.id }} · 内部受控培训资料</p>
          </div>

          <div class="space-y-3 text-xs leading-relaxed text-slate-700">
            <div class="p-3 bg-blue-50/60 rounded-lg border-l-4 border-blue-600">
              <span class="font-bold text-blue-900">核心概要：</span>
              <p class="mt-1 text-slate-600">{{ modalState.activeDoc.description }}</p>
            </div>

            <h4 class="font-bold text-sm text-slate-800 pt-2 border-b border-slate-100 pb-1">
              第一章节：总则与安全运行底线标准
            </h4>
            <p>
              1.1 本手册依据中国民用航空局（CAAC）CCAR-121部法规最新修订版编制，适用于深圳航空承德实训基地全体新入职飞行学员、副驾驶及改装机组人员。
            </p>
            <p>
              1.2 飞行安全是不可动摇的底线。机组成员必须严格遵循飞行前绕机检查单、起飞性能计算表、以及高原机场特殊起降程序。任何人不得在仪表指示超限或特情未处置完毕前盲目起飞。
            </p>

            <h4 class="font-bold text-sm text-slate-800 pt-2 border-b border-slate-100 pb-1">
              第二章节：关键动作与标准操作程序 (SOP)
            </h4>
            <div class="grid grid-cols-2 gap-3 my-2">
              <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span class="font-bold text-blue-700">起飞滑跑 (Takeoff Roll)</span>
                <p class="text-[11px] text-slate-500 mt-1">按压 TO/GA 电门，核实 N1 达到目标推力，80节时副驾驶交叉核对空速表。</p>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span class="font-bold text-emerald-700">决断速度 (V1 Decision)</span>
                <p class="text-[11px] text-slate-500 mt-1">达到 V1 之前出现任何严重警报立即中止起飞；V1 之后必须继续起飞空中处置。</p>
              </div>
            </div>

            <p class="text-slate-500 text-[11px] italic pt-2">
              【提示】如需查看本手册完整 368 页附录图表与机电图纸，可点击右上角“下载文档”获取离线高清单行本。
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <span class="text-xs text-slate-400">已阅读该文档可自动累计专业学分</span>
        <el-button type="primary" @click="modalState.isDocModalOpen = false">已完成阅读</el-button>
      </div>
    </template>
  </el-dialog>
</template>
