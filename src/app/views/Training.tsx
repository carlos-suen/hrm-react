import { CommonButton } from "../components/CommonButton.tsx";
import { TrainingCard, type TrainingCourseInfo } from "../components/TrainingCard.tsx";
import { InfoDialog } from "../components/InfoDialog.tsx";
import { AddCourseForm } from "../components/AddCourseForm.tsx";
import type { SelectOption } from "../components/ToolbarTextField.tsx";
import { useState, useEffect } from "react";
import { trainingApi } from "../../server/lib/api.ts";

const typeOptions: SelectOption[] = [
    { value: "技術", label: "Technical" },
    { value: "管理", label: "Management" },
    { value: "合規", label: "Compliance" },
    { value: "入職", label: "Onboarding" },
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

const formatTrainingCourse = (item: any): TrainingCourseInfo => ({
    id: item.id,
    title: item.title,
    type: item.type,
    startTime: item.start_time,
    endTime: item.end_time,
    location: item.location,
    maxPeople: item.max_people,
    currentJoin: item.current_join,
    status: item.status,
    instructor: item.instructor,
});

const testTrainingData = [
    { title: "React 進階實戰", type: "技術", start_time: "2024-06-15", end_time: "2024-06-20", location: "3F 會議室", max_people: 25, current_join: 18, status: "即將開始", instructor: "張偉" },
    { title: "領導力培訓", type: "管理", start_time: "2024-05-20", end_time: "2024-06-15", location: "5F 培訓室", max_people: 20, current_join: 17, status: "進行中", instructor: "李娜" },
    { title: "信息安全培訓", type: "合規", start_time: "2024-04-01", end_time: "2024-04-05", location: "線上", max_people: 30, current_join: 30, status: "已結束", instructor: "周傑" },
    { title: "新員工入職培訓", type: "入職", start_time: "2024-07-01", end_time: "2024-07-03", location: "1F 大廳", max_people: 20, current_join: 8, status: "即將開始", instructor: "黃芳" },
    { title: "TypeScript 實戰", type: "技術", start_time: "2024-07-10", end_time: "2024-07-15", location: "線上", max_people: 20, current_join: 11, status: "即將開始", instructor: "劉洋" },
];

export const Training = () => {
    const [courses, setCourses] = useState<TrainingCourseInfo[]>([]);
    const [isAddCourseDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState(defaultFormData);

    const fetchCourses = async () => {
        try {
            const data = await trainingApi.getAll();
            const formatted = data.map(formatTrainingCourse);
            setCourses(formatted);
        } catch (err) {
            console.error('獲取培訓課程失敗:', err);
        }
    };

    const handleFormChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            const data = await trainingApi.create({
                title: formData.title,
                instructor: formData.instructor,
                type: formData.type,
                start_time: formData.startDate,
                end_time: formData.endDate,
                location: formData.location,
                max_people: parseInt(formData.capacity) || 20,
                current_join: 0,
                status: "即將開始",
            });
            const newCourse = formatTrainingCourse(data);
            setCourses(prev => [...prev, newCourse]);
            setIsAddDialogOpen(false);
            setFormData(defaultFormData);
        } catch (err) {
            console.error('創建課程失敗:', err);
        }
    };

    const handleCancel = () => {
        setIsAddDialogOpen(false);
        setFormData(defaultFormData);
    };

    const handleEnroll = async (id: number) => {
        try {
            const data = await trainingApi.enroll(id);
            const updatedCourse = formatTrainingCourse(data);
            setCourses(prev => prev.map(c => c.id === id ? updatedCourse : c));
        } catch (err) {
            console.error('報名失敗:', err);
        }
    };

    const generateTestData = async () => {
        try {
            const data = await trainingApi.generateRecords(testTrainingData);
            const formatted = data.map(formatTrainingCourse);
            setCourses(formatted);
        } catch (err) {
            console.error('生成測試數據失敗:', err);
        }
    };


    // 刪除所有測試數據
    const clearAll = async () => {
        try {
            await trainingApi.deleteAll();
            setCourses([]);
        } catch (err) {
            console.error('刪除失敗:', err);
            alert('刪除失敗');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <section className="flex flex-col h-full">
            <div className={`flex justify-between items-center mb-4 shrink-0`}>
                <h2 className={`text-xl font-bold text-black dark:text-white`}>
                    培訓課程
                </h2>
                <div className="flex gap-2">
                    {courses.length === 0 && (
                        <CommonButton title={"生成測試數據"} bgColor="purple" onPressed={generateTestData} />
                    )}
                    <CommonButton title={"新增課程"} bgColor="blue" onPressed={() => setIsAddDialogOpen(true)} />
                    {courses.length != 0 && (
                        <CommonButton title={"刪除所有數據"} bgColor="red" onPressed={clearAll} />
                    )}
                </div>
            </div>

            {/* 卡片區域 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto`}>
                {courses.map(course => (
                    <TrainingCard key={course.id} course={course} onEnroll={handleEnroll} />
                ))}
            </div>

            {/* 新增課程 Dialog */}
            <InfoDialog isOpen={isAddCourseDialogOpen} title={`新增課程`} content={
                <AddCourseForm
                    formData={formData}
                    onChange={handleFormChange}
                    typeOptions={typeOptions}
                />
            } onCancel={handleCancel}
                onConfirm={handleSubmit} />

        </section>
    );
}
