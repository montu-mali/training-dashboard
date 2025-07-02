import type { User, Module, Assignment, ProgressTracking } from "./types"

// Enhanced in-memory database with more realistic data
export const users: User[] = [
  {
    id: "1",
    name: "John Instructor",
    email: "instructor@example.com",
    password: "password123",
    role: "instructor",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "2",
    name: "Jane Trainee",
    email: "trainee@example.com",
    password: "password123",
    role: "trainee",
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    role: "trainee",
    createdAt: new Date("2024-02-15"),
    lastLogin: new Date("2024-06-28"),
    isActive: true,
  },
  {
    id: "5",
    name: "Mike Wilson",
    email: "mike@example.com",
    password: "password123",
    role: "trainee",
    createdAt: new Date("2024-03-01"),
    lastLogin: new Date("2024-06-27"),
    isActive: true,
  },
]

export const modules: Module[] = [
  {
    id: "1",
    title: "Introduction to Safety Protocols",
    description: "Basic safety guidelines and emergency procedures",
    content:
      "This comprehensive module covers essential safety protocols including emergency evacuation procedures, first aid basics, and workplace hazard identification. Learn how to create a safer work environment for everyone.",
    createdBy: "1",
    createdAt: new Date("2024-01-20"),
    isActive: true,
    difficulty: "beginner",
    estimatedDuration: 45,
  },
  {
    id: "2",
    title: "Advanced Communication Techniques",
    description: "Professional communication and conflict resolution",
    content:
      "Master the art of effective communication in professional settings. This module covers active listening, non-verbal communication, conflict resolution strategies, and presentation skills.",
    createdBy: "1",
    createdAt: new Date("2024-02-05"),
    isActive: true,
    difficulty: "intermediate",
    estimatedDuration: 60,
  },
  {
    id: "3",
    title: "Leadership Fundamentals",
    description: "Core principles of effective leadership",
    content:
      "Develop essential leadership skills including team management, decision-making, delegation, and motivation techniques. Learn how to inspire and guide teams toward success.",
    createdBy: "1",
    createdAt: new Date("2024-02-20"),
    isActive: true,
    difficulty: "intermediate",
    estimatedDuration: 90,
  },
  {
    id: "4",
    title: "Digital Literacy Basics",
    description: "Essential computer and internet skills",
    content:
      "Build foundational digital skills including email management, file organization, basic software usage, and internet safety practices.",
    createdBy: "1",
    createdAt: new Date("2024-03-10"),
    isActive: true,
    difficulty: "beginner",
    estimatedDuration: 30,
  },
]

export const assignments: Assignment[] = [
  {
    id: "1",
    moduleId: "1",
    traineeId: "2",
    assignedBy: "1",
    assignedAt: new Date("2024-02-10"),
    completedAt: new Date("2024-02-15"),
    isCompleted: true,
    score: 92,
    attempts: 1,
  },
  {
    id: "2",
    moduleId: "2",
    traineeId: "2",
    assignedBy: "1",
    assignedAt: new Date("2024-02-20"),
    isCompleted: false,
    attempts: 0,
  },
  {
    id: "3",
    moduleId: "1",
    traineeId: "4",
    assignedBy: "1",
    assignedAt: new Date("2024-03-01"),
    completedAt: new Date("2024-03-05"),
    isCompleted: true,
    score: 88,
    attempts: 2,
  },
  {
    id: "4",
    moduleId: "3",
    traineeId: "4",
    assignedBy: "1",
    assignedAt: new Date("2024-03-10"),
    isCompleted: false,
    attempts: 1,
  },
  {
    id: "5",
    moduleId: "4",
    traineeId: "5",
    assignedBy: "1",
    assignedAt: new Date("2024-03-15"),
    completedAt: new Date("2024-03-18"),
    isCompleted: true,
    score: 95,
    attempts: 1,
  },
]

export const progressTracking: ProgressTracking[] = [
  {
    userId: "2",
    moduleId: "2",
    startedAt: new Date("2024-02-20"),
    lastAccessedAt: new Date("2024-06-28"),
    timeSpent: 35,
    currentSection: "Communication Styles",
    bookmarks: ["slide-15", "slide-23"],
    notes: ["Important: Active listening requires full attention", "Practice conflict resolution scenarios"],
  },
  {
    userId: "4",
    moduleId: "3",
    startedAt: new Date("2024-03-10"),
    lastAccessedAt: new Date("2024-06-27"),
    timeSpent: 45,
    currentSection: "Team Management",
    bookmarks: ["slide-8"],
    notes: ["Leadership styles vary by situation"],
  },
]

// Database helper functions
export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email)
}

export const findUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id)
}

export const createUser = (userData: Omit<User, "id" | "createdAt" | "isActive">): User => {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
    isActive: true,
  }
  users.push(newUser)
  return newUser
}

export const getAllTrainees = (): User[] => {
  return users.filter((user) => user.role === "trainee")
}

export const getModulesByInstructor = (instructorId: string): Module[] => {
  return modules.filter((module) => module.createdBy === instructorId)
}

export const getAssignedModules = (traineeId: string): Assignment[] => {
  return assignments.filter((assignment) => assignment.traineeId === traineeId)
}

export const getTraineesByInstructor = (instructorId: string): User[] => {
  const instructorAssignments = assignments.filter((assignment) => assignment.assignedBy === instructorId)
  const traineeIds = [...new Set(instructorAssignments.map((assignment) => assignment.traineeId))]
  return users.filter((user) => traineeIds.includes(user.id) && user.role === "trainee")
}

export const updateUserProgress = (userId: string, moduleId: string, progress: Partial<ProgressTracking>): void => {
  const existingIndex = progressTracking.findIndex((p) => p.userId === userId && p.moduleId === moduleId)

  if (existingIndex >= 0) {
    progressTracking[existingIndex] = { ...progressTracking[existingIndex], ...progress }
  } else {
    progressTracking.push({
      userId,
      moduleId,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      timeSpent: 0,
      bookmarks: [],
      notes: [],
      ...progress,
    })
  }
}

export const getUserProgress = (userId: string, moduleId: string): ProgressTracking | undefined => {
  return progressTracking.find((p) => p.userId === userId && p.moduleId === moduleId)
}
