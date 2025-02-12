"use client";

import { cn } from "@/lib/utils"; // Ensure this import is correct
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function CourseSidebarItem({
    label,
    id,
    isCompleted,
    courseId,
    isLocked
}) {
    const pathname = usePathname();
    const router = useRouter();
    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
    const isActive = pathname?.includes(id);

    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-400 text-sm pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-slate-700 bg-slate-200/40 hover:text-slate-700",
                isCompleted && "text-emerald-700 hover:text-emerald-700",
                isCompleted && isActive && "bg-emerald-200/20"
            )}
            aria-label={`Course item ${label}`}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-slate-500",
                        isActive && "text-slate-700",
                        isCompleted && "text-emerald-700"
                    )}
                />
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-100 h-full transition-all",
                isActive && "opacity-100 border-2 border-slate-700",
                isCompleted && "border-emerald-700"
            )}/>
        </button>
    );
}

export default CourseSidebarItem;