// 文件: src/store/useAttendanceStore.ts
//
// 4.2 進階模塊 — 考勤管理 Zustand Store
// 包含：AttendanceRecord 類型 + Mock 數據 + CRUD + 模擬打卡 + persist
//
// Flutter 對應：
//   - ChangeNotifier + Provider → Zustand Store
//   - SharedPreferences → Zustand persist middleware
//   - List<AttendanceRecord> + notifyListeners() → records + set()

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

// ============================================================
// 1. 類型定義
// ============================================================

export type AttendanceStatus = 'Normal' | 'Late' | 'Early Leave' | 'Absent' | 'On Leave'
// Flutter: enum AttendanceStatus { normal, late, earlyLeave, absent, onLeave }

export interface AttendanceRecord {
  // Flutter: class AttendanceRecord { final String id; ... }
  id: string
  employeeId: string
  employeeName: string
  date: string            // 'YYYY-MM-DD'
  clockIn: string         // 'HH:mm'
  clockOut: string | null // null = 未打卡
  status: AttendanceStatus
  workHours: number       // 小時數
}

// ============================================================
// 2. Store 類型定義
// ============================================================

interface AttendanceState {
  records: AttendanceRecord[]
}

interface AttendanceActions {
  addAttendanceRecords: (records: AttendanceRecord[]) => void
  addRecord: (record: Omit<AttendanceRecord, 'id'>) => void
  updateRecord: (id: string, data: Partial<Omit<AttendanceRecord, 'id'>>) => void
  deleteRecord: (id: string) => void
  clearRecords: () => void
}

type AttendanceStore = AttendanceState & AttendanceActions

// ============================================================
// 3. ID 生成
// ============================================================

const generateId = (): string => `ATT${Date.now().toString(36).toUpperCase()}`
// Flutter: 'ATT${DateTime.now().millisecondsSinceEpoch.toRadixString(36).toUpperCase()}'

// ============================================================
// 4. Mock 數據
// ============================================================

const MOCK_RECORDS: AttendanceRecord[] = [
  {
    id: 'ATT001',
    employeeId: 'EMP001',
    employeeName: '張偉',
    date: '2026-06-03',
    clockIn: '08:15',
    clockOut: '18:30',
    status: 'Normal',
    workHours: 9.5,
  },
  {
    id: 'ATT002',
    employeeId: 'EMP002',
    employeeName: '李娜',
    date: '2026-06-03',
    clockIn: '09:45',
    clockOut: '18:20',
    status: 'Late',
    workHours: 7.8,
  },
  {
    id: 'ATT003',
    employeeId: 'EMP003',
    employeeName: '王強',
    date: '2026-06-03',
    clockIn: '—',
    clockOut: null,
    status: 'Absent',
    workHours: 0,
  },
  {
    id: 'ATT004',
    employeeId: 'EMP004',
    employeeName: '趙敏',
    date: '2026-06-03',
    clockIn: '08:05',
    clockOut: '16:30',
    status: 'Early Leave',
    workHours: 7.2,
  },
  {
    id: 'ATT005',
    employeeId: 'EMP005',
    employeeName: '陳思',
    date: '2026-06-03',
    clockIn: '08:20',
    clockOut: '18:00',
    status: 'Normal',
    workHours: 8.5,
  },
  {
    id: 'ATT006',
    employeeId: 'EMP006',
    employeeName: '劉洋',
    date: '2026-06-03',
    clockIn: '08:10',
    clockOut: '18:15',
    status: 'Normal',
    workHours: 9.1,
  },
  {
    id: 'ATT007',
    employeeId: 'EMP007',
    employeeName: '黃芳',
    date: '2026-06-03',
    clockIn: '—',
    clockOut: null,
    status: 'On Leave',
    workHours: 0,
  },
  {
    id: 'ATT008',
    employeeId: 'EMP008',
    employeeName: '周傑',
    date: '2026-06-03',
    clockIn: '08:00',
    clockOut: '18:00',
    status: 'Normal',
    workHours: 8.0,
  },
]

// ============================================================
// 5. Zustand Store
// ============================================================

export const useAttendanceStore = create<AttendanceStore>()(
  persist(
    (set) => ({
      records: MOCK_RECORDS,

      addAttendanceRecords: (newRecords) =>
        set((state) => ({
          records: [...state.records, ...newRecords],
        })),
      // Flutter: void addRecords(List<AttendanceRecord> items) { _records.addAll(items); notifyListeners(); }

      addRecord: (data) =>
        set((state) => ({
          records: [...state.records, { ...data, id: generateId() }],
        })),

      updateRecord: (id, data) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      // Flutter: 同 4.1 updateEmployee 模式，copyWith + notifyListeners()

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),

      clearRecords: () => set({ records: [] }),
    }),
    {
      name: 'hrm-attendance-storage',
      partialize: (state) => ({
        records: state.records,
      }),
    }
  )
)

// ============================================================
// 6. Selector Hooks
// ============================================================

export const useAttendanceByDate = (date: string) =>
  useAttendanceStore((state) => state.records.filter((r) => r.date === date))

export const useAttendanceStats = (date: string) =>
  useAttendanceStore((state) => {
    const dayRecords = state.records.filter((r) => r.date === date)
    const total = dayRecords.length
    const normal = dayRecords.filter((r) => r.status === 'Normal').length
    const late = dayRecords.filter((r) => r.status === 'Late').length
    const earlyLeave = dayRecords.filter((r) => r.status === 'Early Leave').length
    const absent = dayRecords.filter((r) => r.status === 'Absent').length
    const onLeave = dayRecords.filter((r) => r.status === 'On Leave').length
    const attendanceRate = total > 0 ? Math.round(((normal + late + earlyLeave) / total) * 1000) / 10 : 0

    return { total, normal, late, earlyLeave, absent, onLeave, attendanceRate }
  })

// ============================================================
// 7. 模擬打卡生成函數（在組件中調用）
// ============================================================

// 此函數需要從 useHrmStore 獲取員工列表，因此導出為工具函數
// 在組件中這樣使用：
//
// import { useHrmStore } from './useHrmStore'
// import { useAttendanceStore, AttendanceRecord } from './useAttendanceStore'
//
// const generateDailyAttendance = () => {
//   const employees = useHrmStore.getState().employees
//   const addRecords = useAttendanceStore.getState().addAttendanceRecords
//   const today = format(new Date(), 'yyyy-MM-dd')
//
//   const activeEmployees = employees.filter(e => e.status === 'Active')
//   const records = activeEmployees.map(emp => { ... })
//   addRecords(records)
// }

// Flutter 對應 (Selector):
// context.watch<AttendanceProvider>().select((state) => state.records.where((r) => r.date == date).length)
// 目的相同：只在相關數據變化時才重建 Widget
