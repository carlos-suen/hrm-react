import type { ChartData } from "../../app/common/components/ChartCard.tsx"

interface Employee {
  id: string;
  name: string;
  eid: string;
  department: string;
  pos: string;
  created_at: string;
  sal: number;
  status: number;
  start_date: string;
}

interface SearchFilters {
  name?: string;
  department?: string;
  status?: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  const contentType = res.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T
  }

  const text = await res.text()
  if (!text) {
    return {} as T
  }

  return JSON.parse(text) as T
}


export const employeeApi = {
  getAll: (filters?: SearchFilters) => {
    const params = new URLSearchParams()
    if (filters?.name) params.set('name', filters.name)
    if (filters?.department) params.set('department', filters.department)
    if (filters?.status) params.set('status', filters.status)

    const query = params.toString()
    return request<Employee[]>(`/api/employees${query ? `?${query}` : ''}`)
  },

  createEmployee: (data: Omit<Employee, 'id' | 'created_at'>) =>
    request<Employee>('/api/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateEmployees: (data: Omit<Employee, 'id' | 'created_at'>[]) =>
    request<Employee[]>('/api/employees/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEmployeeData: (id: string, data: Partial<Employee>) =>
    request<Employee>(`/api/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteEmployee: (id: string) =>
    request<{ success: boolean }>(`/api/employees/${id}`, {
      method: 'DELETE',
    }),

  clearAll: () =>
    request<{ success: boolean }>('/api/employees/all', {
      method: 'DELETE',
    }),
}


interface Approval {
  id: number;
  ename: string;
  type: number;
  start_time: string;
  end_time: string;
  reason: string;
  status: number;
}

export const approvalApi = {
  getPending: () =>
    request<Approval[]>('/api/approvals/pending'),

  getApproved: () =>
    request<Approval[]>('/api/approvals/approved'),

  getRejected: () =>
    request<Approval[]>('/api/approvals/rejected'),

  updateStatus: (id: number, data: { status: number }) =>
    request<Approval>(`/api/approvals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  generateApprovals: (data: Omit<Approval, 'id'>[]) =>
    request<Approval[]>('/api/approvals/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  clearAll: () =>
    request<{ success: boolean }>('/api/approvals/all', {
      method: 'DELETE',
    }),
}


export const dashboardApi = {
  getDepartmentStats: () =>
    request<ChartData[]>('/api/dashboard/department-stats'),

  getSalaryStats: () =>
    request<ChartData[]>('/api/dashboard/salary-stats'),
}


interface AttendanceRecord {
  id: number;
  name: string;
  email: string;
  record_date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: string;
  hours: string;
}

export const attendanceApi = {
  getAll: () =>
    request<AttendanceRecord[]>('/api/attendance'),

  generateRecords: (data: Omit<AttendanceRecord, 'id'>[]) =>
    request<AttendanceRecord[]>('/api/attendance/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  clearAll: () =>
    request<{ success: boolean }>('/api/attendance/all', {
      method: 'DELETE',
    }),
}


interface PayrollRecord {
  id: number;
  name: string;
  bsalary: number;
  bonus: number;
  deduction: number;
  asalary: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const payrollApi = {
  getAll: () =>
    request<PayrollRecord[]>('/api/payroll'),

  getById: (id: number) =>
    request<PayrollRecord>(`/api/payroll/${id}`),

  updateStatus: (id: number, data: { status: string }) =>
    request<PayrollRecord>(`/api/payroll/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  generateRecords: (data: Omit<PayrollRecord, 'id' | 'created_at' | 'updated_at'>[]) =>
    request<PayrollRecord[]>('/api/payroll/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}


interface RecruitmentRecord {
  id: number;
  title: string;
  department: string;
  location: string;
  salary_min: string;
  salary_max: string;
  applicant_count: number;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const recruitmentApi = {
  getAll: () =>
    request<RecruitmentRecord[]>('/api/recruitment'),

  getById: (id: number) =>
    request<RecruitmentRecord>(`/api/recruitment/${id}`),

  update: (id: number, data: Partial<RecruitmentRecord>) =>
    request<RecruitmentRecord>(`/api/recruitment/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  generateRecords: (data: Omit<RecruitmentRecord, 'id' | 'created_at' | 'updated_at'>[]) =>
    request<RecruitmentRecord[]>('/api/recruitment/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}


interface TrainingRecord {
  id: number;
  title: string;
  type: string;
  start_time: string;
  end_time: string;
  location: string;
  max_people: number;
  current_join: number;
  status: string;
  instructor: string;
  created_at: string;
  updated_at: string;
}

export const trainingApi = {
  getAll: () =>
    request<TrainingRecord[]>('/api/training'),

  create: (data: Omit<TrainingRecord, 'id' | 'created_at' | 'updated_at'>) =>
    request<TrainingRecord>('/api/training', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  enroll: (id: number) =>
    request<TrainingRecord>(`/api/training/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ current_join: 1 }),
    }),

  generateRecords: (data: Omit<TrainingRecord, 'id' | 'created_at' | 'updated_at'>[]) =>
    request<TrainingRecord[]>('/api/training/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAll: () =>
    request<{ success: boolean }>('/api/training/all', {
      method: 'DELETE',
    }),
}


interface PerformanceRecord {
  id: number;
  name: string;
  duration: string;
  score: number;
  level: string;
  status: number;
  monitor: string;
  created_at: string;
  updated_at: string;
}


export const performanceApi = {
  getAll: () =>
    request<PerformanceRecord[]>('/api/performance'),

  add: (data: Omit<PerformanceRecord, 'id' | 'created_at' | 'updated_at'>) =>
    request<PerformanceRecord>('/api/performance/add', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateData: (data: Omit<PerformanceRecord, 'id' | 'created_at' | 'updated_at'>[]) =>
    request<PerformanceRecord[]>('/api/performance/generateData', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteById: (id: number) =>
    request<{ success: boolean }>(`/api/performance/${id}`, {
      method: 'DELETE',
    }),

  deleteAll: () =>
    request<{ success: boolean }>('/api/performance/deleteAll', {
      method: 'DELETE',
    }),

  getById: (id: number) =>
    request<PerformanceRecord>(`/api/performance/getById/${id}`),
}


