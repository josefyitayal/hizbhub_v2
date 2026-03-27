import { CourseEditor } from "./_components/CourseEditor"
import { CourseSidebarTwo } from "./_components/CourseSidebarTwo"

type CourseIdPageProps = {
    params: Promise<{ courseId: string }>;
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
    const { courseId } = await params;

    return (
        <div className="flex gap-5 h-full min-w-0 overflow-hidden">
            <div className=" shrink-0 min-w-0 h-full">
                <CourseSidebarTwo courseId={courseId} />
            </div>
            <div className="flex-1 min-w-0 h-full">
                <CourseEditor courseId={courseId} />
            </div>
        </div>
    )
}
