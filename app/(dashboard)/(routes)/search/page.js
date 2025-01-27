import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import db from "@/lib/db";
import SearchInput from "@/components/templates/search/SearchInput";
import { getCourses } from "@/actions/get-courses";

import Categories from "@/components/templates/search/Categories"
import CoursesList from "@/components/templates/search/CoursesList";


async function SearchPage({searchParams}) {
  const {userId} = await auth();
  console.log(userId)
  if(!userId) return redirect("/");



  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",

    }
  })

  const courses = await getCourses({
      userId,
      ...searchParams
  })
  return (
    <>
    <div className="block px-6 pt-6 md:hidden md:mb-0">
      <SearchInput/>
    </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default SearchPage;  