import { Suspense } from "react";

import Categories from "@/components/templates/search/Categories";
import CoursesList from "@/components/templates/search/CoursesList";
import SearchInput from "@/components/templates/search/SearchInput";

async function SearchPage({searchParams}) {
  const {userId} = await auth();
  if(!userId) return redirect("/");

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const courses = await getCourses({
    userId,
    ...searchParams
  })

  return (
    <>
      <div className="block px-6 pt-6 md:hidden md:mb-0">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchInput/>
        </Suspense>
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}