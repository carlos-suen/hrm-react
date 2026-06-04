// 文件: src/store/useHrmStore.ts
//
// 第3天核心交付物：Zustand Store 完整範本
// 包含：兩套 Interface + Mock 數據 + CRUD Action + persist 配置
//
// Flutter 對應：
//   - ChangeNotifier + Provider → Zustand Store
//   - SharedPreferences → Zustand persist middleware
//   - List<Employee> + notifyListeners() → employees + set()
//   - List<LeaveRequest> + notifyListeners() → leaveRequests + set()

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================
// 1. 類型定義（對標 Flutter 的 class + enum）
// ============================================================

export type Department = 'Engineering' | 'HR' | 'Marketing' | 'Sales' | 'Finance'
// Flutter: enum Department { engineering, hr, marketing, sales, finance }

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated'
// Flutter: enum EmployeeStatus { active, onLeave, terminated }

export type LeaveType = 'Annual' | 'Sick' | 'Personal'
// Flutter: enum LeaveType { annual, sick, personal }

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected'
// Flutter: enum LeaveStatus { pending, approved, rejected }

export interface Employee {
  // Flutter: class Employee { final String id; final String name; ... }
  id: string
  name: string
  avatar: string
  email: string
  department: Department
  role: string
  salary: number
  status: EmployeeStatus
  joinDate: string
}

export interface LeaveRequest {
  // Flutter: class LeaveRequest { final String id; final String employeeId; ... }
  id: string
  employeeId: string
  employeeName: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
}

// ============================================================
// 2. Store 類型定義（State + Actions）
// ============================================================

interface HrmState {
  employees: Employee[]
  leaveRequests: LeaveRequest[]
}

interface HrmActions {
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, data: Partial<Omit<Employee, 'id'>>) => void
  deleteEmployee: (id: string) => void

  addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => void
  updateLeaveStatus: (id: string, status: LeaveStatus) => void
  deleteLeaveRequest: (id: string) => void
}

type HrmStore = HrmState & HrmActions

// ============================================================
// 3. ID 生成工具函數
// ============================================================

const generateEmployeeId = (): string => {
  return 'EMP' + Date.now().toString(36).toUpperCase()
}
// Flutter: 'EMP${DateTime.now().millisecondsSinceEpoch.toRadixString(36).toUpperCase()}'

const generateLeaveId = (): string => {
  return 'LV' + Date.now().toString(36).toUpperCase()
}

// ============================================================
// 4. Mock 數據（10 條員工 + 4 條請假）
// ============================================================

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    name: '張偉',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    email: 'zhangwei@company.com',
    department: 'Engineering',
    role: 'Senior Frontend Engineer',
    salary: 28000,
    status: 'Active',
    joinDate: '2022-03-15',
  },
  {
    id: 'EMP002',
    name: '李娜',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
    email: 'lina@company.com',
    department: 'HR',
    role: 'HR Manager',
    salary: 25000,
    status: 'Active',
    joinDate: '2021-08-20',
  },
  {
    id: 'EMP003',
    name: '王強',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
    email: 'wangqiang@company.com',
    department: 'Sales',
    role: 'Sales Representative',
    salary: 18000,
    status: 'Active',
    joinDate: '2023-01-10',
  },
  {
    id: 'EMP004',
    name: '趙敏',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao',
    email: 'zhaomin@company.com',
    department: 'Marketing',
    role: 'Marketing Specialist',
    salary: 20000,
    status: 'On Leave',
    joinDate: '2022-11-05',
  },
  {
    id: 'EMP005',
    name: '陳思',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen',
    email: 'chensi@company.com',
    department: 'Finance',
    role: 'Financial Analyst',
    salary: 22000,
    status: 'Active',
    joinDate: '2023-06-18',
  },
  {
    id: 'EMP006',
    name: '劉洋',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu',
    email: 'liuyang@company.com',
    department: 'Engineering',
    role: 'Backend Engineer',
    salary: 26000,
    status: 'Active',
    joinDate: '2022-09-01',
  },
  {
    id: 'EMP007',
    name: '黃芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huang',
    email: 'huangfang@company.com',
    department: 'HR',
    role: 'Recruiter',
    salary: 16000,
    status: 'Active',
    joinDate: '2024-02-14',
  },
  {
    id: 'EMP008',
    name: '周傑',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhou',
    email: 'zhoujie@company.com',
    department: 'Engineering',
    role: 'DevOps Engineer',
    salary: 30000,
    status: 'Active',
    joinDate: '2021-05-22',
  },
  {
    id: 'EMP009',
    name: '吳靜',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wu',
    email: 'wujing@company.com',
    department: 'Sales',
    role: 'Account Executive',
    salary: 19000,
    status: 'Terminated',
    joinDate: '2022-07-30',
  },
  {
    id: 'EMP010',
    name: '孫磊',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sun',
    email: 'sunlei@company.com',
    department: 'Marketing',
    role: 'Content Strategist',
    salary: 17000,
    status: 'Active',
    joinDate: '2024-01-08',
  },
]

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LV001',
    employeeId: 'EMP001',
    employeeName: '張偉',
    type: 'Annual',
    startDate: '2026-01-20',
    endDate: '2026-01-24',
    days: 5,
    reason: '年度旅行計劃，已提前安排工作交接',
    status: 'Pending',
  },
  {
    id: 'LV002',
    employeeId: 'EMP004',
    employeeName: '趙敏',
    type: 'Sick',
    startDate: '2026-01-15',
    endDate: '2026-01-16',
    days: 2,
    reason: '身體不適需要休息',
    status: 'Pending',
  },
  {
    id: 'LV003',
    employeeId: 'EMP003',
    employeeName: '王強',
    type: 'Personal',
    startDate: '2026-01-10',
    endDate: '2026-01-10',
    days: 1,
    reason: '個人事務需要處理',
    status: 'Approved',
  },
  {
    id: 'LV004',
    employeeId: 'EMP006',
    employeeName: '劉洋',
    type: 'Annual',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    days: 7,
    reason: '春節返鄉探親',
    status: 'Pending',
  },
]

// ============================================================
// 5. Zustand Store 創建（含 persist 中間件）
// ============================================================

export const useHrmStore = create<HrmStore>()(
  persist(
    (set) => ({
      // --- State ---
      employees: MOCK_EMPLOYEES,
      leaveRequests: MOCK_LEAVE_REQUESTS,

      // --- Employee Actions ---

      addEmployee: (data) =>
        set((state) => ({
          employees: [
            ...state.employees,
            {
              ...data,
              id: generateEmployeeId(),
            },
          ],
        })),
      // Flutter 對應:
      // void addEmployee(EmployeeData data) {
      //   _employees.add(Employee(id: generateId(), ...data));
      //   notifyListeners();
      // }

      updateEmployee: (id, data) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...data } : emp
          ),
        })),
      // Flutter 對應:
      // void updateEmployee(String id, Map<String, dynamic> data) {
      //   final index = _employees.indexWhere((e) => e.id == id);
      //   if (index != -1) {
      //     _employees[index] = _employees[index].copyWith(...data);
      //     notifyListeners();
      //   }
      // }

      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),
      // Flutter 對應:
      // void deleteEmployee(String id) {
      //   _employees.removeWhere((e) => e.id == id);
      //   notifyListeners();
      // }

      // --- Leave Request Actions ---

      addLeaveRequest: (data) =>
        set((state) => ({
          leaveRequests: [
            ...state.leaveRequests,
            {
              ...data,
              id: generateLeaveId(),
            },
          ],
        })),
      // Flutter 對應: 同 addEmployee 模式

      updateLeaveStatus: (id, status) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.map((req) =>
            req.id === id ? { ...req, status } : req
          ),
        })),
      // Flutter 對應:
      // void updateLeaveStatus(String id, LeaveStatus status) {
      //   final index = _leaveRequests.indexWhere((r) => r.id == id);
      //   if (index != -1) {
      //     _leaveRequests[index] = _leaveRequests[index].copyWith(status: status);
      //     notifyListeners();
      //   }
      // }

      deleteLeaveRequest: (id) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.filter((req) => req.id !== id),
        })),
      // Flutter 對應: 同 deleteEmployee 模式
    }),
    {
      name: 'hrm-storage',
      partialize: (state) => ({
        employees: state.employees,
        leaveRequests: state.leaveRequests,
      }),
    }
  )
)

// ============================================================
// 6. Selector Hooks（局部渲染優化）
// ============================================================

export const useEmployeeCount = () =>
  useHrmStore((state) => state.employees.length)

export const useActiveRate = () =>
  useHrmStore(
    (state) => {
      const total = state.employees.length
      if (total === 0) return 0
      const active = state.employees.filter((e) => e.status === 'Active').length
      return Math.round((active / total) * 1000) / 10
    }
  )

export const useTotalSalary = () =>
  useHrmStore(
    (state) =>
      state.employees
        .filter((e) => e.status === 'Active')
        .reduce((sum, e) => sum + e.salary, 0)
  )

export const usePendingCount = () =>
  useHrmStore(
    (state) => state.leaveRequests.filter((r) => r.status === 'Pending').length
  )

export const useDepartmentDistribution = () =>
  useHrmStore((state) => {
    const deptMap = state.employees.reduce<Record<string, number>>(
      (acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1
        return acc
      },
      {}
    )
    const colors: Record<string, string> = {
      Engineering: '#3b82f6',
      HR: '#10b981',
      Marketing: '#f59e0b',
      Sales: '#ef4444',
      Finance: '#8b5cf6',
    }
    return Object.entries(deptMap).map(([name, value]) => ({
      name,
      value,
      fill: colors[name] || '#6b7280',
    }))
  })

export const useSalaryByDepartment = () =>
  useHrmStore((state) => {
    const deptMap = state.employees.reduce<
      Record<string, { total: number; count: number }>
    >((acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { total: 0, count: 0 }
      }
      acc[emp.department].total += emp.salary
      acc[emp.department].count += 1
      return acc
    }, {})
    return Object.entries(deptMap).map(([department, { total, count }]) => ({
      department,
      avgSalary: Math.round(total / count),
      totalSalary: total,
    }))
  })

// Flutter 對應 (Selector):
// 在 Flutter/Riverpod 中，使用 select() 或 Provider 的 selector 參數：
// context.watch<UserProvider>().select((state) => state.employees.length)
// 目的相同：只在相關數據變化時才重建 Widget
