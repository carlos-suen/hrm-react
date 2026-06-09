export interface EmployeePerformanceData {
    id: number;
    // 員工姓名
    name: string;
    // 週期
    duration: string;
    // 總分
    score: number;
    // 評級ABCD
    level: string;
    // 0: self review
    // 1: Manager review
    // 2: Completed
    status: number;
    // 監管人
    monitor: string;
}