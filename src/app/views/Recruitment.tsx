import {RecruitmentColumn, type RecruitmentJob} from "../components/RecruitmentColumn.tsx";
import {CommonButton} from "../components/CommonButton.tsx";
import {InfoDialog} from "../components/InfoDialog.tsx";
import {AddRecruitmentForm} from "../components/AddRecruitmentForm.tsx";
import type {SelectOption} from "../components/ToolbarTextField.tsx";
import {useState} from "react";
import {departmentOptions} from "./Directory.tsx";

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

const openJobs: RecruitmentJob[] = [
    {
        id: 1,
        title: "高級前端工程師",
        department: "Engineering",
        location: "北京",
        salaryMin: "25K",
        salaryMax: "35K",
        applicantCount: 12,
        type: "全職"
    },
    {
        id: 2,
        title: "產品經理",
        department: "Marketing",
        location: "上海",
        salaryMin: "20K",
        salaryMax: "30K",
        applicantCount: 8,
        type: "全職"
    },
    {
        id: 3,
        title: "實習設計師",
        department: "Marketing",
        location: "廣州",
        salaryMin: "4K",
        salaryMax: "6K",
        applicantCount: 5,
        type: "實習"
    },
];

const pausedJobs: RecruitmentJob[] = [
    {
        id: 4,
        title: "後端工程師",
        department: "Engineering",
        location: "深圳",
        salaryMin: "22K",
        salaryMax: "32K",
        applicantCount: 6,
        type: "全職"
    },
];

const closedJobs: RecruitmentJob[] = [
    {
        id: 5,
        title: "兼職文案",
        department: "Marketing",
        location: "遠程",
        salaryMin: "8K",
        salaryMax: "12K",
        applicantCount: 3,
        type: "兼職"
    },
];

export const Recruitment = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState(defaultFormData);

    const handleFormChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = () => {
        console.log("提交表單:", formData);
        setIsAddDialogOpen(false);
        setFormData(defaultFormData);
    };

    const handleCancel = () => {
        setIsAddDialogOpen(false);
        setFormData(defaultFormData);
    };

    return (
        <section className="flex flex-col">
            {/* 工具按鈕*/}
            <div className={`space-x-2 mb-6`}>
                <CommonButton title={`新增`} onPressed={() => setIsAddDialogOpen(true)}/>
                <CommonButton title={'生成測試數據'} bgColor={`purple`}/>
            </div>

            <InfoDialog isOpen={isAddDialogOpen} title={`新增職位`} content={
                <AddRecruitmentForm
                    formData={formData}
                    onChange={handleFormChange}
                    departmentOptions={departmentOptions}
                    typeOptions={typeOptions}
                />
            } onCancel={handleCancel} onConfirm={handleSubmit}/>


            {/* 不同天內炸UN櫃檯的相關內容 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                <RecruitmentColumn title="開放中" jobs={openJobs} status="open"/>
                <RecruitmentColumn title="暫停" jobs={pausedJobs} status="paused"/>
                <RecruitmentColumn title="已關閉" jobs={closedJobs} status="closed"/>
            </div>
        </section>
    );
}
