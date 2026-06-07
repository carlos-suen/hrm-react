// 文件: src/store/usePerformanceStore.ts
//
// 4.3 高級模塊 — 績效管理 Zustand Store
// 包含：PerformanceReview 類型 + Mock 數據 + CRUD + 審批流程 + 等級計算 + persist
//
// Flutter 對應：
//   - ChangeNotifier + Provider → Zustand Store
//   - SharedPreferences → Zustand persist middleware
//   - List<PerformanceReview> + notifyListeners() → reviews + set()

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================
// 1. 類型定義
// ============================================================

export type Department = 'Engineering' | 'HR' | 'Marketing' | 'Sales' | 'Finance'
// Flutter: enum Department { engineering, hr, marketing, sales, finance }

export type PerformanceGrade = 'S' | 'A' | 'B' | 'C' | 'D'
// Flutter: enum PerformanceGrade { S, A, B, C, D }

export type ReviewStatus = 'Self Review' | 'Manager Review' | 'HR Review' | 'Completed'
// Flutter: enum ReviewStatus { selfReview, managerReview, hrReview, completed }

export interface PerformanceScores {
  // Flutter: class PerformanceScores { final double quality, efficiency, teamwork, initiative, communication; }
  quality: number       // 1-5 工作質量
  efficiency: number    // 1-5 工作效率
  teamwork: number      // 1-5 團隊協作
  initiative: number    // 1-5 主動性
  communication: number // 1-5 溝通能力
}

export interface PerformanceReview {
  // Flutter: class PerformanceReview { final String id; ... }
  id: string
  employeeId: string
  employeeName: string
  department: Department
  period: string            // 'YYYY-H1' 或 'YYYY-H2'
  reviewerId: string
  reviewerName: string
  scores: PerformanceScores
  overallScore: number      // 加權平均 1-5
  grade: PerformanceGrade
  comments: string
  status: ReviewStatus
  createdAt: string
  updatedAt: string
}

// ============================================================
// 2. 等級計算工具函數
// ============================================================

export function calculateGrade(score: number): PerformanceGrade {
  // Flutter: PerformanceGrade calculateGrade(double score) { ... }
  if (score >= 4.5) return 'S'
  if (score >= 4.0) return 'A'
  if (score >= 3.0) return 'B'
  if (score >= 2.0) return 'C'
  return 'D'
}

export function calculateOverallScore(scores: PerformanceScores): number {
  // 加權計算：質量×0.25 + 效率×0.25 + 協作×0.20 + 主動×0.15 + 溝通×0.15
  // Flutter: double calculateOverallScore(PerformanceScores s) { ... }
  const weighted =
    scores.quality * 0.25 +
    scores.efficiency * 0.25 +
    scores.teamwork * 0.20 +
    scores.initiative * 0.15 +
    scores.communication * 0.15
  return Math.round(weighted * 10) / 10
}

// ============================================================
// 3. Store 類型定義
// ============================================================

interface PerformanceState {
  reviews: PerformanceReview[]
}

interface PerformanceActions {
  addReview: (review: Omit<PerformanceReview, 'id' | 'overallScore' | 'grade' | 'createdAt' | 'updatedAt'>) => void
  updateReview: (id: string, data: Partial<Omit<PerformanceReview, 'id'>>) => void
  deleteReview: (id: string) => void
  advanceStatus: (id: string) => void  // 推進審批流程
  rejectReview: (id: string, comments: string) => void  // 退回
  clearReviews: () => void
}

type PerformanceStore = PerformanceState & PerformanceActions

// ============================================================
// 4. ID 生成
// ============================================================

const generateId = (): string => `PERF${Date.now().toString(36).toUpperCase()}`
// Flutter: 'PERF${DateTime.now().millisecondsSinceEpoch.toRadixString(36).toUpperCase()}'

// ============================================================
// 5. 審批流程推進邏輯
// ============================================================

const NEXT_STATUS: Record<ReviewStatus, ReviewStatus | null> = {
  'Self Review': 'Manager Review',
  'Manager Review': 'HR Review',
  'HR Review': 'Completed',
  'Completed': null,
}
// Flutter: Map<ReviewStatus, ReviewStatus?> nextStatus = { ... }

// ============================================================
// 6. Mock 數據
// ============================================================

const MOCK_REVIEWS: PerformanceReview[] = [
  {
    id: 'PERF001', employeeId: 'EMP001', employeeName: '張偉',
    department: 'Engineering', period: '2026-H1',
    reviewerId: 'MGR001', reviewerName: '王強',
    scores: { quality: 4.5, efficiency: 4.0, teamwork: 4.5, initiative: 4.0, communication: 3.5 },
    overallScore: 4.1, grade: 'A',
    comments: '技術能力突出，團隊協作良好，建議加強溝通表達。',
    status: 'Completed', createdAt: '2026-05-01', updatedAt: '2026-05-15',
  },
  {
    id: 'PERF002', employeeId: 'EMP002', employeeName: '李娜',
    department: 'Marketing', period: '2026-H1',
    reviewerId: 'MGR002', reviewerName: '趙敏',
    scores: { quality: 4.0, efficiency: 3.5, teamwork: 4.0, initiative: 4.5, communication: 4.5 },
    overallScore: 4.1, grade: 'A',
    comments: '溝通能力強，主動性高，效率可進一步提升。',
    status: 'Manager Review', createdAt: '2026-05-10', updatedAt: '2026-05-20',
  },
  {
    id: 'PERF003', employeeId: 'EMP003', employeeName: '王強',
    department: 'Engineering', period: '2026-H1',
    reviewerId: 'MGR001', reviewerName: '劉洋',
    scores: { quality: 4.5, efficiency: 4.5, teamwork: 3.5, initiative: 4.0, communication: 3.0 },
    overallScore: 3.9, grade: 'B',
    comments: '技術和效率出色，需提升團隊協作和溝通。',
    status: 'HR Review', createdAt: '2026-05-05', updatedAt: '2026-05-18',
  },
  {
    id: 'PERF004', employeeId: 'EMP004', employeeName: '趙敏',
    department: 'HR', period: '2026-H1',
    reviewerId: 'MGR003', reviewerName: '陳思',
    scores: { quality: 4.0, efficiency: 4.0, teamwork: 4.5, initiative: 3.5, communication: 4.5 },
    overallScore: 4.1, grade: 'A',
    comments: '溝通和協作能力優秀，主動性可加強。',
    status: 'Completed', createdAt: '2026-05-02', updatedAt: '2026-05-16',
  },
  {
    id: 'PERF005', employeeId: 'EMP005', employeeName: '陳思',
    department: 'Finance', period: '2026-H1',
    reviewerId: 'MGR004', reviewerName: '張偉',
    scores: { quality: 3.5, efficiency: 3.0, teamwork: 3.5, initiative: 3.0, communication: 3.5 },
    overallScore: 3.3, grade: 'B',
    comments: '各項指標平穩，建議在效率和主動性上突破。',
    status: 'Self Review', createdAt: '2026-05-12', updatedAt: '2026-05-12',
  },
  {
    id: 'PERF006', employeeId: 'EMP006', employeeName: '劉洋',
    department: 'Engineering', period: '2026-H1',
    reviewerId: 'MGR001', reviewerName: '王強',
    scores: { quality: 5.0, efficiency: 4.5, teamwork: 4.5, initiative: 5.0, communication: 4.0 },
    overallScore: 4.6, grade: 'S',
    comments: '全方位優秀，是團隊的核心骨幹。',
    status: 'Completed', createdAt: '2026-05-03', updatedAt: '2026-05-14',
  },
  {
    id: 'PERF007', employeeId: 'EMP007', employeeName: '黃芳',
    department: 'Marketing', period: '2026-H1',
    reviewerId: 'MGR002', reviewerName: '趙敏',
    scores: { quality: 2.5, efficiency: 2.0, teamwork: 3.0, initiative: 2.0, communication: 2.5 },
    overallScore: 2.4, grade: 'C',
    comments: '多項指標低於預期，需要制定改善計劃。',
    status: 'Manager Review', createdAt: '2026-05-08', updatedAt: '2026-05-19',
  },
  {
    id: 'PERF008', employeeId: 'EMP008', employeeName: '周傑',
    department: 'Engineering', period: '2026-H1',
    reviewerId: 'MGR001', reviewerName: '劉洋',
    scores: { quality: 3.0, efficiency: 3.5, teamwork: 3.0, initiative: 2.5, communication: 3.0 },
    overallScore: 3.0, grade: 'B',
    comments: '表現穩定，建議提升主動性。',
    status: 'Completed', createdAt: '2026-05-04', updatedAt: '2026-05-17',
  },
]

// ============================================================
// 7. Zustand Store
// ============================================================

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set) => ({
      reviews: MOCK_REVIEWS,

      addReview: (data) => {
        const overallScore = calculateOverallScore(data.scores)
        const grade = calculateGrade(overallScore)
        const now = new Date().toISOString().slice(0, 10)
        set((state) => ({
          reviews: [...state.reviews, {
            ...data,
            id: generateId(),
            overallScore,
            grade,
            createdAt: now,
            updatedAt: now,
          }],
        }))
      },
      // Flutter: void addReview(PerformanceReviewData data) { final score = calculateOverallScore(data.scores); ... notifyListeners(); }

      updateReview: (id, data) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...data,
                  overallScore: data.scores ? calculateOverallScore(data.scores) : r.overallScore,
                  grade: data.scores ? calculateGrade(calculateOverallScore(data.scores)) : r.grade,
                  updatedAt: new Date().toISOString().slice(0, 10),
                }
              : r
          ),
        })),

      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),

      advanceStatus: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) => {
            if (r.id !== id) return r
            const nextStatus = NEXT_STATUS[r.status]
            if (!nextStatus) return r
            return { ...r, status: nextStatus, updatedAt: new Date().toISOString().slice(0, 10) }
          }),
        })),
      // Flutter: void advanceStatus(String id) { final review = _reviews.firstWhere((r) => r.id == id); ... notifyListeners(); }

      rejectReview: (id, comments) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? { ...r, status: 'Self Review' as ReviewStatus, comments, updatedAt: new Date().toISOString().slice(0, 10) }
              : r
          ),
        })),

      clearReviews: () => set({ reviews: [] }),
    }),
    {
      name: 'hrm-performance-storage',
      partialize: (state) => ({
        reviews: state.reviews,
      }),
    }
  )
)

// ============================================================
// 8. Selector Hooks
// ============================================================

export const usePerformanceByPeriod = (period: string) =>
  usePerformanceStore((state) => state.reviews.filter((r) => r.period === period))

export const usePerformanceByDepartment = (department: Department) =>
  usePerformanceStore((state) => state.reviews.filter((r) => r.department === department))

export const usePerformanceStats = (period: string) =>
  usePerformanceStore((state) => {
    const periodReviews = state.reviews.filter((r) => r.period === period)
    const total = periodReviews.length
    const completed = periodReviews.filter((r) => r.status === 'Completed').length
    const pending = total - completed
    const avgScore = total > 0
      ? Math.round((periodReviews.reduce((sum, r) => sum + r.overallScore, 0) / total) * 10) / 10
      : 0
    const saCount = periodReviews.filter((r) => r.grade === 'S' || r.grade === 'A').length
    const saRate = total > 0 ? Math.round((saCount / total) * 100) : 0

    const gradeDistribution: Record<PerformanceGrade, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 }
    periodReviews.forEach((r) => { gradeDistribution[r.grade]++ })

    return { total, completed, pending, avgScore, saCount, saRate, gradeDistribution }
  })

// Flutter 對應 (Selector):
// context.watch<PerformanceProvider>().select((state) => state.reviews.where((r) => r.period == period).length)
