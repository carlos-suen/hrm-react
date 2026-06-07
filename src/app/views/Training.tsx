import {CommonButton} from "../components/CommonButton.tsx";
import {TrainingCard, type TrainingCourseInfo} from "../components/TrainingCard.tsx";
import {InfoDialog} from "../components/InfoDialog.tsx";
import {AddCourseForm} from "../components/AddCourseForm.tsx";
import type {SelectOption} from "../components/ToolbarTextField.tsx";
import {useState} from "react";

const typeOptions: SelectOption[] = [
    {value: "技術", label: "Technical"},
    {value: "管理", label: "Management"},
    {value: "合規", label: "Compliance"},
    {value: "入職", label: "Onboarding"},
];

const defaultFormData = {
    title: "",
    instructor: "",
    type: "",
    startDate: "",
    endDate: "",
    duration: "",
    capacity: "",
    location: "",
    description: "",
};

const trainingCourses: TrainingCourseInfo[] = [
    {
        id: 1,
        title: "React 進階實戰",
        type: "技術",
        startTime: "6/15",
        endTime: "6/20",
        location: "3F 會議室",
        maxPeople: 25,
        currentJoin: 18,
        status: "即將開始",
        instructor: "張偉",
    },
    {
        id: 2,
        title: "領導力培訓",
        type: "管理",
        startTime: "5/20",
        endTime: "6/15",
        location: "5F 培訓室",
        maxPeople: 20,
        currentJoin: 17,
        status: "進行中",
        instructor: "李娜",
    },
    {
        id: 3,
        title: "信息安全培訓",
        type: "合規",
        startTime: "4/1",
        endTime: "4/5",
        location: "線上",
        maxPeople: 30,
        currentJoin: 30,
        status: "已結束",
        instructor: "周傑",
    },
    {
        id: 4,
        title: "新員工入職培訓",
        type: "入職",
        startTime: "7/1",
        endTime: "7/3",
        location: "1F 大廳",
        maxPeople: 20,
        currentJoin: 8,
        status: "即將開始",
        instructor: "黃芳",
    },
    {
        id: 5,
        title: "TypeScript 實戰",
        type: "技術",
        startTime: "7/10",
        endTime: "7/15",
        location: "線上",
        maxPeople: 20,
        currentJoin: 11,
        status: "即將開始",
        instructor: "劉洋",
    },
    {
        id: 6,
        title: "項目管理基礎",
        type: "管理",
        startTime: "8/1",
        endTime: "8/5",
        location: "5F 培訓室",
        maxPeople: 25,
        currentJoin: 5,
        status: "即將開始",
        instructor: "趙敏",
    },
];

export const Training = () => {
    const [isAddCourseDialogOpen, setIsAddDialogOpen] = useState(false);
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
        <section>
            <div className={`flex justify-between items-center mb-4`}>
                <h2 className={`text-xl font-bold text-black dark:text-white`}>
                    培訓課程
                </h2>
                <CommonButton title={"新增課程"} bgColor="blue" onPressed={() => setIsAddDialogOpen(true)}/>
            </div>

            {/* 卡片區域 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                {trainingCourses.map(course => (
                    <TrainingCard key={course.id} course={course}/>
                ))}
            </div>

            {/* 新增課程 Dialog */}
            <InfoDialog isOpen={isAddCourseDialogOpen} title={`新增課程`} content={
                <AddCourseForm
                    formData={formData}
                    onChange={handleFormChange}
                    typeOptions={typeOptions}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                />
            }/>

        </section>
    );
}
