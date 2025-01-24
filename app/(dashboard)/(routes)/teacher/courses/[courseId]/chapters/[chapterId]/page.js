import { IconBadge } from "@/components/templates/dashboard/icon/icon-badge";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import ChapterTitleForm from "@/components/templates/dashboard/ChapterTitleForm"
import ChapterDescriptionForm from "@/components/templates/dashboard/ChapterDescriptionForm "
import ChapterAccessForm from "@/components/templates/dashboard/ChapterAccessForm"
import ChapterVideoForm from "@/components/templates/dashboard/ChapterVideoForm"

async function ChapterId({ params }) {
  const { userId } = await auth();

  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId
    },
    include: {
      muxData: true
    },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl
  ]

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;


  const completionText = `(${completedFields}/${totalFields})`


  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}/`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4  w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Chapter creation
              </h1>
              <span className="text-sm text-slate-700">
                Compele All fields {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">
                Customize your chapter
              </h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">
                  Access setting
                </h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterId