export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "instructor" | "trainee" | "admin"
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

export interface Module {
  title: string
  description: string
  content: string
  instructorId: string
  estimatedDuration?: number // in minutes
}

export interface Assignment {
  id: string
  moduleId: string
  traineeId: string
  assignedBy: string
  assignedAt: Date
  completedAt?: Date
  isCompleted: boolean
  score?: number
  feedback?: string
  attempts: number
}

export interface ModuleWithProgress extends Module {
  isCompleted?: boolean
  completedAt?: Date
  progress?: number
  score?: number
}

export interface TraineeWithProgress extends User {
  totalModules: number
  completedModules: number
  progressPercentage: number
  averageScore?: number
  streak?: number
}

export interface ProgressTracking {
  userId: string
  moduleId: string
  startedAt: Date
  lastAccessedAt: Date
  timeSpent: number // in minutes
  currentSection?: string
  bookmarks: string[]
  notes: string[]
}
