import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";

import db from "@/lib/db"
import { IconBadge } from "@/components/templates/dashboard/icon/icon-badge";
import TitleForm from "@/components/templates/dashboard/TitleForm";
import DescriptionForm from "@/components/templates/dashboard/DescriptionForm";
import ImageForm from "@/components/templates/dashboard/ImageForm";
import CategoryForm from "@/components/templates/dashboard/categoryForm";
import PriceForm from "@/components/templates/dashboard/PriceForm"
import AttachmentForm from "@/components/templates/dashboard/AttachmentForm"
import ChaptersForm  from "@/components/templates/dashboard/ChaptersForm"

async function CourseIdPage({ params }) {

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters :{
        orderBy:{
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  };

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.ispublished)
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
            <IconBadge size="sm" icon={LayoutDashboard} />
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
              label: category.name,
              value: category.id
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge size="sm" icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <ChaptersForm
              initialData={course}
              courseId={course.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge size="sm" icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm
              initialData={course}
              courseId={course.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge size="sm" icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm
              initialData={course}
              courseId={course.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseIdPage;