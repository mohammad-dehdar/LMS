"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react";

import SearchInput from "@/components/templates/search/SearchInput"

function NavbarRoutes() {
    const pathName = usePathname();

    const isTeacherPage = pathName?.startsWith("/teacher");
    const isCoursesPage = pathName?.includes("/courses");
    const isSearchPage = pathName === "/search"

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput/>
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isCoursesPage || isTeacherPage ? (
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : (
                    <Link href="teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher mode
                        </Button>
                    </Link>
                )}
                <UserButton afterSignOutUrl="/" />
            </div>
        </>
    )
}

export default NavbarRoutes