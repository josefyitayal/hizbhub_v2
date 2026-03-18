import { CreateGroupForm } from "./_components/CreateGroupForm";

export default function CreateGroupPage() {
    return (
        <div className="h-screen w-full flex p-3 gap-3">
            <div className="relative flex-1 h-full bg-green-950 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500 rounded-full blur-[100px] opacity-30"></div>

                <div className="absolute top-1/2 -right-10 w-[500px] h-[500px] bg-green-600 rounded-full blur-[120px] opacity-20"></div>

                <div className="relative z-10 p-12">
                    <h1 className="text-white text-4xl font-bold">Get Started with Us</h1>
                </div>
            </div>
            <div className="flex-[0.6] flex items-center justify-center">
                <CreateGroupForm />
            </div>
        </div>
    )
}
