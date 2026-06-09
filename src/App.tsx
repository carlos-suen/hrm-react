import { BaseLayout } from './app/views/BaseLayout.tsx'
import { PerformanceDetail } from './app/views/performance/PerformanceDetail.tsx'

function App() {
  const isDetailPage = window.location.pathname === '/performance-detail';

  if (isDetailPage) {
    return <PerformanceDetail />;
  }

  return (
    <BaseLayout />
  )
}

export default App
