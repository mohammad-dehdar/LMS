import Mux from "@mux/mux-node";
import db from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(req, { params }) {
  try {
    const {userId} = getAuth(req);

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

    if(!course) return new NextResponse("Not Found", {status: 404});

    // حذف پیوستهای دوره
    await db.attachments.deleteMany({
      where: {
        courseId: params.courseId
      }
    });

    // حذف داراییهای Mux
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        try {
          await video.assets.delete(chapter.muxData.assetId);
        } catch (error) {
          // هندلینگ خطای 404 به صورت خاص
          if (error.status === 404) {
            console.log(`Asset ${chapter.muxData.assetId} already deleted`);
          } else {
            console.error('Mux deletion error:', error);
            throw error; // خطاهای دیگر را propagate کنید
          }
        }
      }
    }

    // حذف دوره و دادههای مرتبط به صورت آبشاری
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId
      }
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}


export async function PATCH(req, { params }) {
  try {
    const { userId } = getAuth(req);
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    const existingCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!existingCourse) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[PATCH_ERROR]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
