import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import db from "@/lib/db";
import SearchInput from "@/components/templates/search/SearchInput";
import { getCourses } from "@/actions/get-courses";
import Categories from "@/components/templates/search/Categories";
import CoursesList from "@/components/templates/search/CoursesList";

const SearchPage = async ({ searchParams }) => {
  const { userId } = await auth();
  
  if(!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const courses = await getCourses({
    userId,
    ...searchParams
  });

  return (
    <>
      <div className="block px-6 pt-6 md:hidden md:mb-0">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="p-6 space-y-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Categories items={categories} />
        </Suspense>
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;