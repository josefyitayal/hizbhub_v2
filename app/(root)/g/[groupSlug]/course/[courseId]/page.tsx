import { orpc } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { CourseSidebar } from "./_components/CourseSidebar"
import { CourseEditor } from "./_components/CourseEditor"

type CourseIdPageProps = {
    params: Promise<{ courseId: string }>;
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
    const { courseId } = await params;

    return (
        <div className="flex gap-5 h-full">
            <CourseSidebar
                courseId={courseId}
            />
            <CourseEditor courseId={courseId} />
        </div>
    )
}
