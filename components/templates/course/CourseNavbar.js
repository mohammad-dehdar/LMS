import NavbarRoutes from "../dashboard/NavbarRoutes"
import CourseMobileSidebar from "./CourseMobileSidebar"

function CourseNavbar({course , progressCount}) {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
        />
        <NavbarRoutes/>
    </div>
  )
}

export default CourseNavbar