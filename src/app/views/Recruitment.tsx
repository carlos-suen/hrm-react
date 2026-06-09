import {RecruitmentColumn, type RecruitmentJob} from "../common/components/RecruitmentColumn.tsx";
import {CommonButton} from "../common/components/CommonButton.tsx";
import {InfoDialog} from "../common/components/InfoDialog.tsx";
import {AddRecruitmentForm} from "../common/components/AddRecruitmentForm.tsx";
import type {SelectOption} from "../common/components/ToolbarTextField.tsx";
import {useState, useEffect} from "react";
import {departmentOptions} from "./Directory.tsx";
import {recruitmentApi} from "../../server/lib/api.ts";

const typeOptions: SelectOption[] = [
    {value: "全職", label: "Full-time"},
    {value: "實習", label: "Intern"},
    {value: "兼職", label: "Part-time"},
];

const defaultFormData = {
    title: "",
    department: "",
    type: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
};

const formatRecruitmentJob = (item: any): RecruitmentJob => ({
    id: item.id,
    title: item.title,
    department: item.department,
    location: item.location,
    salaryMin: item.salary_min,
    salaryMax: item.salary_max,
    applicantCount: item.applicant_count,
    type: item.type as '全職' | '實習' | '兼職',
    status: item.status as 'open' | 'paused' | 'closed',
});

const testRecruitmentData = [
    {title: "高級前端工程師", department: "Engineering", location: "北京", salary_min: "25K", salary_max: "35K", applicant_count: 12, type: "全職", status: "open"},
    {title: "產品經理", department: "Marketing", location: "上海", salary_min: "20K", salary_max: "30K", applicant_count: 8, type: "全職", status: "open"},
    {title: "實習設計師", department: "Marketing", location: "廣州", salary_min: "4K", salary_max: "6K", applicant_count: 5, type: "實習", status: "open"},
    {title: "後端工程師", department: "Engineering", location: "深圳", salary_min: "22K", salary_max: "32K", applicant_count: 6, type: "全職", status: "paused"},
    {title: "兼職文案", department: "Marketing", location: "遠程", salary_min: "8K", salary_max: "12K", applicant_count: 3, type: "兼職", status: "closed"},
];

export const Recruitment = () => {
    const [openJobs, setOpenJobs] = useState<RecruitmentJob[]>([]);
    const [pausedJobs, setPausedJobs] = useState<RecruitmentJob[]>([]);
    const [closedJobs, setClosedJobs] = useState<RecruitmentJob[]>([]);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<RecruitmentJob | null>(null);
    const [formData, setFormData] = useState(defaultFormData);

    const fetchAllJobs = async () => {
        try {
            const data = await recruitmentApi.getAll();
            const formatted = data.map(formatRecruitmentJob);
            setOpenJobs(formatted.filter(j => j.status === 'open'));
            setPausedJobs(formatted.filter(j => j.status === 'paused'));
            setClosedJobs(formatted.filter(j => j.status === 'closed'));
        } catch (err) {
            console.error('獲取招聘記錄失敗:', err);
        }
    };

    const generateTestData = async () => {
        try {
            const data = await recruitmentApi.generateRecords(testRecruitmentData);
            const formatted = data.map(formatRecruitmentJob);
            setOpenJobs(formatted.filter(j => j.status === 'open'));
            setPausedJobs(formatted.filter(j => j.status === 'paused'));
            setClosedJobs(formatted.filter(j => j.status === 'closed'));
        } catch (err) {
            console.error('生成測試數據失敗:', err);
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const data = await recruitmentApi.getById(id);
            const job = formatRecruitmentJob(data);
            setEditingJob(job);
            setFormData({
                title: job.title,
                department: job.department,
                type: job.type,
                location: job.location,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                description: "",
                requirements: "",
            });
            setIsEditDialogOpen(true);
        } catch (err) {
            console.error('獲取職位詳情失敗:', err);
        }
    };

    const handleFormChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = async () => {
        if (!editingJob) return;
        try {
            const data = await recruitmentApi.update(editingJob.id, {
                title: formData.title,
                department: formData.department,
                type: formData.type,
                location: formData.location,
                salary_min: formData.salaryMin,
                salary_max: formData.salaryMax,
            });
            const updatedJob = formatRecruitmentJob(data);

            const removeFromAll = (jobs: RecruitmentJob[]) => jobs.filter(j => j.id !== updatedJob.id);
            setOpenJobs(prev => removeFromAll(prev));
            setPausedJobs(prev => removeFromAll(prev));
            setClosedJobs(prev => removeFromAll(prev));

            const targetStatus = updatedJob.status;
            switch (targetStatus) {
                case 'open':
                    setOpenJobs(prev => [...prev, updatedJob]);
                    break;
                case 'paused':
                    setPausedJobs(prev => [...prev, updatedJob]);
                    break;
                case 'closed':
                    setClosedJobs(prev => [...prev, updatedJob]);
                    break;
            }

            setIsEditDialogOpen(false);
            setEditingJob(null);
            setFormData(defaultFormData);
        } catch (err) {
            console.error('更新失敗:', err);
        }
    };

    const handleCancel = () => {
        setIsEditDialogOpen(false);
        setEditingJob(null);
        setFormData(defaultFormData);
    };

    useEffect(() => {
        fetchAllJobs();
    }, []);

    return (
        <section className="flex flex-col h-full">
            {/* 工具按鈕*/}
            <div className={`space-x-2 mb-6 shrink-0`}>
                <CommonButton title={`生成測試數據`} bgColor={`purple`} onPressed={generateTestData}/>
            </div>

            <InfoDialog
                isOpen={isEditDialogOpen}
                title={`編輯職位`}
                content={
                    <AddRecruitmentForm
                        formData={formData}
                        onChange={handleFormChange}
                        departmentOptions={departmentOptions}
                        typeOptions={typeOptions}
                    />
                }
                onCancel={handleCancel}
                onConfirm={handleSubmit}
            />

            {/* 不同狀態的招聘內容 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                <RecruitmentColumn title="開放中" jobs={openJobs} status="open" onEdit={handleEdit}/>
                <RecruitmentColumn title="暫停" jobs={pausedJobs} status="paused" onEdit={handleEdit}/>
                <RecruitmentColumn title="已關閉" jobs={closedJobs} status="closed" onEdit={handleEdit}/>
            </div>
        </section>
    );
}
