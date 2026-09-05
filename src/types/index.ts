export interface UserProfile {
  name: string
  role: string
  major: string
  department: string
  safetyUnit: string
  base: string
  avatar: string
  level: string
  points: number
  growthScore: number
  studyHours: number
  studyHoursWeekChange: number
  taskCompletionRate: number
  taskRateWeekChange: number
  checkinDays: number
  checkinBeatenPercent: number
  isCheckedInToday: boolean
}

export interface TaskItem {
  id: string
  title: string
  category: 'theory' | 'vr' | 'safety'
  categoryLabel: string
  duration: string
  progress: number
  status: 'ongoing' | 'review' | 'not_started' | 'completed'
  icon: string
  description?: string
  totalChapters?: number
  completedChapters?: number
}

export interface LeaderboardUser {
  rank: number
  name: string
  points: number
  avatar: string
  department: string
  change: 'up' | 'down' | 'same'
  badge?: string
  likes: number
  hasLiked?: boolean
}

export interface KnowledgeDoc {
  id: string
  title: string
  category: 'general' | 'specialized'
  type: 'pdf' | 'doc' | 'video' | 'manual'
  size: string
  date: string
  tag: string
  downloads: number
  views: number
  isBookmarked: boolean
  description: string
  contentSnippet: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  hotCount: number
}

export interface BadgeItem {
  id: string
  title: string
  icon: string
  desc: string
  unlocked: boolean
  unlockedDate?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface ShopItem {
  id: string
  title: string
  cost: number
  category: string
  image: string
  stock: number
  exchanged: boolean
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  time: string
  referenceDoc?: string
  options?: string[]
}
