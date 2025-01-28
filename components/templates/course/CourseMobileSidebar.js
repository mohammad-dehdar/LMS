import { Menu } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import CourseSidebar from "@/components/templates/course/CourseSidebar"

function CourseMobileSidebar({ course, progressCount }) {

  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 bg-white w-72" side="left">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}

export default CourseMobileSidebar