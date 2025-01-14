import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";

import db from "@/lib/db"
import { IconBadge } from "@/components/templates/dashboard/icon/icon-badge";
import TitleForm from "@/components/templates/dashboard/TitleForm";
import DescriptionForm from "@/components/templates/dashboard/DescriptionForm";
import ImageForm from "@/components/templates/dashboard/ImageForm";
import CategoryForm from "@/components/templates/dashboard/categoryForm";


async function CourseIdPage({ params }) {

  const { userId } =  await auth();

  if (!userId) {
    return redirect("/");
  }

 const course = await db.course.findUnique({
    where: {
      id: params.courseId
    }
  });

  const categories = await db.category.findMany({
    orderBy: {
        name: "asc"
    }
  })
  
  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course Setup
          </h1>
          <span className="text-sm text-slate-700">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>
      <div className="gird grid-cols-1 md:grid-cols-2  gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge size="sm" icon={LayoutDashboard}/>
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm
          initialData={course}
          courseId={course.id}
          />
          <DescriptionForm
          initialData={course}
          courseId={course.id}
          />
          <ImageForm
          initialData={course}
          courseId={course.id}
          />
          <CategoryForm
          initialData={course}
          courseId={course.id}
          options={categories.map((category) => ({
            label : category.name,
            value: category.id
          }))}
          />
        </div>
      </div>
    </div>
  )
}

export default CourseIdPage;