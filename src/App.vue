<script setup lang="ts">
import { currentTab } from './stores/appStore'
import Sidebar from './components/Sidebar.vue'
import HeaderBar from './components/HeaderBar.vue'
import AiCopilotWidget from './components/AiCopilotWidget.vue'
import DashboardView from './views/DashboardView.vue'
import KnowledgeView from './views/KnowledgeView.vue'
import RewardsView from './views/RewardsView.vue'
import AiAssistantView from './views/AiAssistantView.vue'
import SimulationView from './views/SimulationView.vue'
import LeaderboardView from './views/LeaderboardView.vue'
import CourseModal from './components/CourseModal.vue'
import DocPreviewModal from './components/DocPreviewModal.vue'
import CheckinModal from './components/CheckinModal.vue'
</script>

<template>
  <div class="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
    <!-- Left Navigation Sidebar -->
    <Sidebar />

    <!-- Main Container -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-gradient-to-b from-blue-50/40 via-slate-100/60 to-blue-100/30 backdrop-blur-2xl">
      <!-- Top Fixed Header -->
      <HeaderBar />

      <!-- Center & Right Flex Body -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Main Scrollable Content View -->
        <main class="flex-1 overflow-y-auto px-8 pt-6 pb-12 custom-scrollbar">
          <transition name="fade" mode="out-in">
            <DashboardView v-if="currentTab === 'dashboard'" />
            <RewardsView v-else-if="currentTab === 'rewards'" />
            <AiAssistantView v-else-if="currentTab === 'ai'" />
            <SimulationView v-else-if="currentTab === 'simulation'" />
            <KnowledgeView v-else-if="currentTab === 'knowledge'" />
            <LeaderboardView v-else-if="currentTab === 'leaderboard'" />
          </transition>
        </main>

        <!-- Right Docked AI Assistant (Shown on non-AI full screen pages) -->
        <AiCopilotWidget v-if="currentTab !== 'ai'" />
      </div>
    </div>

    <!-- Global Modals for Interactions -->
    <CourseModal />
    <DocPreviewModal />
    <CheckinModal />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
