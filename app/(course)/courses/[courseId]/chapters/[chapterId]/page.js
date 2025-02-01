import { getChapter } from "@/actions/get-chapter";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { Separator } from "@/components/ui/separator"
import Banner from "@/components/templates/dashboard/Banner";
import VideoPlayer from "@/components/templates/course/VideoPlayer";
import CourseEnrollButton from "@/components/templates/course/CourseEnrollButton"
import Preview from "@/components/templates/dashboard/preview";
import CourseProgressButton from "@/components/templates/course/CourseProgressButton";

async function ChapterIdPage({ params }) {
  const { userId } = await auth()

  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  })


  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase & !userProgress?.isCompleted;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4 w-full">
          <VideoPlayer
            chapter={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2 md:mb-0">
            {chapter.title}
          </h2>
          {purchase ? (
            <div>
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            </div>
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price}
            />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description} />
        </div>
        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                  <File className="mr-2" />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ChapterIdPage