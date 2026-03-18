import { CourseList } from "./_components/CourseList";
import { CreateCourseButton } from "./_components/CreateCourseButton";

export default function CoursePage() {
    return (
        <div className="px-36 py-10">
            <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Courses</p>
                <CreateCourseButton />
            </div>
            <div className="py-10">
                <CourseList />
            </div>
        </div>
    )
}
