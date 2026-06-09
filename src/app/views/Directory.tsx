import { ToolbarTextField } from "../common/components/ToolbarTextField.tsx";
import type { SelectOption } from "../common/components/ToolbarTextField.tsx";
import { CommonButton } from "../common/components/CommonButton.tsx";
import { InfoDialog } from "../common/components/InfoDialog.tsx";
import { useState, useEffect } from "react";
import { employeeApi } from "../../server/lib/api.ts";
import { EditEmployeeForm } from "../common/components/EditEmployeeForm.tsx";

// 下拉測試數據
export const departmentOptions: SelectOption[] = [
    { value: "all", label: "全部" },
    { value: "Engineering", label: "Engineering" },
    { value: "HR", label: "HR" },
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
];

export const statusOptions: SelectOption[] = [
    { value: 0, label: "全部" },
    { value: -1, label: "On Leave" },
    { value: 1, label: "Active" },
    { value: 2, label: "Terminated" },
];

// 測試數據
const testData = [
    {
        name: '張三',
        eid: 'EMP001',
        department: 'Engineering',
        pos: 'Senior Developer',
        sal: 85000,
        status: 1,
        start_date: '2024-01-15'
    },
    {
        name: '李四',
        eid: 'EMP002',
        department: 'Engineering',
        pos: 'Junior Developer',
        sal: 55000,
        status: 1,
        start_date: '2024-03-20'
    },
    {
        name: '王五',
        eid: 'EMP003',
        department: 'Marketing',
        pos: 'Marketing Manager',
        sal: 72000,
        status: 1,
        start_date: '2023-11-05'
    },
    {
        name: '趙六',
        eid: 'EMP004',
        department: 'HR',
        pos: 'HR Specialist',
        sal: 58000,
        status: 1,
        start_date: '2024-02-14'
    },
    {
        name: '錢七',
        eid: 'EMP005',
        department: 'Engineering',
        pos: 'Tech Lead',
        sal: 96000,
        status: 1,
        start_date: '2023-06-18'
    },
    {
        name: '孫八',
        eid: 'EMP006',
        department: 'Sales',
        pos: 'Sales Representative',
        sal: 52000,
        status: 2,
        start_date: '2024-04-01'
    },
    {
        name: '周九',
        eid: 'EMP007',
        department: 'Marketing',
        pos: 'Content Writer',
        sal: 48000,
        status: 1,
        start_date: '2024-05-12'
    },
    {
        name: '吳十',
        eid: 'EMP008',
        department: 'Engineering',
        pos: 'DevOps Engineer',
        sal: 82000,
        status: 1,
        start_date: '2023-09-25'
    },
    {
        name: '鄭十一',
        eid: 'EMP009',
        department: 'HR',
        pos: 'Recruiter',
        sal: 54000,
        status: 3,
        start_date: '2024-01-30'
    },
    {
        name: '王十二',
        eid: 'EMP010',
        department: 'Sales',
        pos: 'Sales Manager',
        sal: 78000,
        status: 1,
        start_date: '2023-08-14'
    },
];

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

interface ToolBarFieldData {
    name: string;
    department: string;
    status: string;
}

interface EmployeeFormData {
    id: string;
    name: string;
    eid: string;
    department: string;
    pos: string;
    sal: string;
    status: string;
    start_date: string;
}

const initialFormData: EmployeeFormData = {
    id: '',
    name: '',
    eid: '',
    department: '',
    pos: '',
    sal: '',
    status: '1',
    start_date: ''
};

const statusBadgeMap = {
    1: { label: "Active", classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    2: { label: "On Leave", classes: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    3: { label: "Terminated", classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

export const Directory = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteWarningDialogOpen, setIsDeleteWarningDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
    const [toolBarFieldData, setToolBarFieldData] = useState<ToolBarFieldData>({
        name: '',
        department: '',
        status: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    /// 獲取數據
    const fetchEmployees = async () => {
        try {
            const data = await employeeApi.getAll();
            setEmployees(data);
        } catch (err) {
            console.error('獲取員工數據失敗:', err);
        } finally {
            setLoading(false);
        }
    };

    // 新增員工
    const addEmployee = async (newEmployee: Omit<Employee, 'id' | 'created_at'>) => {
        try {
            const data = await employeeApi.createEmployee(newEmployee);
            setEmployees(prev => [data, ...prev]);
            setIsAddDialogOpen(false);
        } catch (err) {
            console.error('新增失敗:', err);
        }
    };

    // 更新員工
    const updateEmployee = async (id: string, updates: Partial<Employee>) => {
        try {
            const data = await employeeApi.updateEmployeeData(id, updates);
            setEmployees(prev =>
                prev.map(emp => emp.id === id ? { ...emp, ...data } : emp)
            );
            setIsEditDialogOpen(false);
        } catch (err) {
            console.error('更新失敗:', err);
        }
    };

    // 刪除員工
    const deleteEmployee = async (id: string) => {
        try {
            await employeeApi.deleteEmployee(id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
            setIsDeleteWarningDialogOpen(false);
        } catch (err) {
            console.error('刪除失敗:', err);
        }
    };

    // 搜索員工（支持工號、部門、狀態組合查詢）
    const searchEmployee = async (filters: ToolBarFieldData) => {
        const hasName = filters.name.trim();
        const hasDepartment = filters.department && filters.department !== 'all';
        const hasStatus = filters.status && Number(filters.status) !== 0;

        if (!hasName && !hasDepartment && !hasStatus) {
            setIsSearching(false);
            fetchEmployees();
            return;
        }
        try {
            setLoading(true);
            setIsSearching(true);

            const data = await employeeApi.getAll({
                name: hasName ? filters.name : undefined,
                department: hasDepartment ? filters.department : undefined,
                status: hasStatus ? filters.status : undefined,
            });

            setEmployees(data);
        } catch (err) {
            console.error('搜索失敗:', err);
        } finally {
            setLoading(false);
        }
    };

    // 生成測試數據
    const generateTestData = async () => {
        try {
            const data = await employeeApi.generateEmployees(testData);
            setEmployees(prev => [...data, ...prev]);
        } catch (err) {
            console.error('生成測試數據失敗:', err);
        }
    };

    // 刪除所有測試數據
    const deleteAllTestData = async () => {
        try {
            await employeeApi.clearAll();
            setEmployees([]);
            setIsDeleteWarningDialogOpen(false);
        } catch (err) {
            console.error('刪除失敗:', err);
            alert('刪除失敗');
        }
    };


    return (
        <section>
            {/*工具欄*/}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-stretch w-auto">
                <div className="flex flex-col md:flex-row gap-2 items-stretch">
                    <ToolbarTextField prefixIcon={'🔍'} hintText={'搜索員工姓名...'} value={toolBarFieldData.name}
                        onChange={(value) => setToolBarFieldData(prev => ({
                            ...prev,
                            name: value
                        }))} />

                    <ToolbarTextField prefixIcon={'部門:'} type={'select'}
                        options={departmentOptions}
                        value={toolBarFieldData.department}
                        onChange={(value) => setToolBarFieldData(prev => ({
                            ...prev,
                            department: value
                        }))} />
                    <ToolbarTextField prefixIcon={'狀態:'} type={'select'}
                        options={statusOptions}
                        value={toolBarFieldData.status}
                        onChange={(value) => setToolBarFieldData(prev => ({
                            ...prev,
                            status: value
                        }))} />
                    <CommonButton title={'查找'} bgColor={'green'} onPressed={() => {
                        searchEmployee(toolBarFieldData)
                    }} />
                    <CommonButton title={'新增'} onPressed={() => {
                        // 打開對話框
                        setIsAddDialogOpen(true);
                    }} />
                </div>
                <div className={`space-x-4`}>
                    {employees.length == 0 ? <CommonButton title={'生成測試數據'} bgColor={'purple'} onPressed={() => {
                        generateTestData();
                    }} /> : null}
                    <CommonButton title={'刪除所有數據(慎用)'} bgColor={'red'} onPressed={() => {
                        deleteAllTestData();
                    }} />
                </div>
            </div>

            {/* 新增相關員工的Dialog */}
            <InfoDialog
                isOpen={isAddDialogOpen}
                title="添加員工"
                content={
                    <EditEmployeeForm
                        formData={formData}
                        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                        departmentOptions={departmentOptions}
                    />
                }
                onCancel={() => {
                    setFormData(initialFormData);
                    setIsAddDialogOpen(false);
                }}
                onConfirm={() => {

                    //
                    if (!formData.eid || !formData.department || !formData.pos || !formData.sal) {
                        alert('請填寫所有必填字段');
                        return;
                    }
                    addEmployee({
                        eid: formData.eid,
                        name: formData.name,
                        department: formData.department,
                        pos: formData.pos,
                        sal: Number(formData.sal),
                        status: Number(formData.status),
                        start_date: formData.start_date,
                    });
                    setFormData(initialFormData);
                }}
            />

            {/* 更新員工信息的dialog */}
            <InfoDialog
                isOpen={isEditDialogOpen}
                title="更新員工信息"
                content={
                    <EditEmployeeForm
                        formData={formData}
                        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                        departmentOptions={departmentOptions}
                    />
                }
                onCancel={() => {
                    setFormData(initialFormData);
                    setIsEditDialogOpen(false);
                }}
                onConfirm={() => {
                    if (!formData.eid || !formData.department || !formData.pos || !formData.sal) {
                        alert('請填寫所有必填字段');
                        return;
                    }
                    updateEmployee(formData.id, {
                        eid: formData.eid,
                        name: formData.name,
                        department: formData.department,
                        pos: formData.pos,
                        sal: Number(formData.sal),
                        status: Number(formData.status),
                        start_date: formData.start_date
                    });
                    setFormData(initialFormData);
                }}
                confirmText={'更新'}
                isDelete={false}
            />

            {/* 刪除相關員工的dialog */}
            <InfoDialog
                isOpen={isDeleteWarningDialogOpen}
                title="刪除員工"
                content={
                    `確定刪除該員工「${formData.name}」?`
                }
                onCancel={() => {
                    setFormData(initialFormData);
                    setIsDeleteWarningDialogOpen(false);
                }}
                onConfirm={() => {
                    deleteEmployee(formData.id);
                    setFormData(initialFormData);
                }}
                confirmText={'刪除'}
                isDelete={true}
            />


            {/*表格*/}
            {/* 這裡mobile端中出現的slideBar需要調整樣式 */}
            <div
                className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-zinc-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">姓名</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">工號</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">部門</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">職位</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">入職日期</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">薪資</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">狀態</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                                    加載中...
                                </td>
                            </tr>
                        ) : employees.length === 0 ? (
                            <tr>
                                <td colSpan={8}>
                                    {isSearching ? (
                                        <div className="flex flex-col items-center justify-center py-16">
                                            <span className="text-6xl mb-4">🔍</span>
                                            <p className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
                                                未找到匹配的員工
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                嘗試調整搜索條件
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16">
                                            <span className="text-6xl mb-4">👥</span>
                                            <p className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
                                                還沒有員工記錄
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                                點擊「添加員工」開始錄入
                                            </p>
                                            <CommonButton
                                                title="+ 添加第一位員工"
                                                bgColor="blue"
                                                onPressed={() => setIsAddDialogOpen(true)}
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-zinc-700/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-4">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            <div>
                                                <div
                                                    className="text-sm font-medium text-slate-900 dark:text-slate-50">{emp.name}</div>
                                                <div
                                                    className="text-xs text-slate-500 dark:text-slate-400">{emp.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-50">{emp.eid}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-50">{emp.department}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-50">{emp.pos}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-50">
                                        {emp.start_date ? new Date(emp.start_date).toLocaleDateString('zh-CN') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-50">
                                        ¥{emp.sal.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusBadgeMap[emp.status as keyof typeof statusBadgeMap]?.classes}`}>
                                            {statusBadgeMap[emp.status as keyof typeof statusBadgeMap]?.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="text-slate-400 hover:text-blue-500 transition-colors"
                                                onClick={() => {
                                                    setFormData({
                                                        id: emp.id,
                                                        name: emp.name,
                                                        eid: emp.eid,
                                                        department: emp.department,
                                                        pos: emp.pos,
                                                        sal: String(emp.sal),
                                                        status: String(emp.status),
                                                        start_date: emp.start_date,
                                                    });
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        id: emp.id,
                                                        name: emp.name
                                                    }));
                                                    setIsDeleteWarningDialogOpen(true);
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
