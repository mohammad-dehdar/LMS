"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import SideBarItem from "./SideBarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
    { icon: Layout, label: "Dashboard", href: "/" },
    { icon: Compass, label: "Browse", href: "/search" },
];

const teacherRoutes = [
    { icon: List, label: "Courses", href: "/teacher/courses" },
    { icon: BarChart, label: "Analytics", href: "/teacher/analytics" },
]

function SideBarRoutes() {
    const pathName = usePathname();
    const isTeacherPage = pathName?.includes("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SideBarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
}

export default SideBarRoutes;
