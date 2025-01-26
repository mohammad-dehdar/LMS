import db from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
    try {
        const { userId } = getAuth(req);

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                },
                attachments: true // اضافه کردن پیوستها
            }
        });

        if (!course) return new NextResponse("Not Found", { status: 404 });

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !hasPublishedChapter) {
            return new NextResponse("Missing requierd fields", { status: 401 })
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}