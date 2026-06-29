import { BaseLayout } from './app/views/BaseLayout.tsx'
import { Login } from './app/views/Login.tsx'
import { useAuthStore } from './app/common/stores/authStore.ts'
import { PerformanceDetail } from './app/views/performance/PerformanceDetail.tsx'
import { EmployeeStatsView } from './app/views/reports/EmployeeStatsView.tsx'
import { SalaryStatsView } from './app/views/reports/SalaryStatsView.tsx'
import { NotificationSettingView } from './app/views/notifications/NotificationSettingView.tsx'

function App() {
  const isLogin = useAuthStore((s) => s.is_login)

  // 路由守衛：未登錄跳轉登錄頁
  if (!isLogin) {
    return <Login />
  }

  const path = window.location.pathname;

  if (path === '/performance-detail') {
    return <PerformanceDetail />;
  }

  if (path === '/reports/employee-stats') {
    return <EmployeeStatsView />;
  }

  if (path === '/reports/salary-stats') {
    return <SalaryStatsView />;
  }

  if (path === '/notifications/settings') {
    return <NotificationSettingView />;
  }

  return (
    <BaseLayout />
  )
}

export default App
