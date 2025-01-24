const Mux = require("@mux/mux-node");
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import db from "@/lib/db";


const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(req, { params }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        try {
          await video.assets.del(existingMuxData.assetId);
        } catch (error) {
          console.warn("Failed to delete Mux asset:", error);
        }
        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }
    }

    const deletedChapter =await db.chapter.delete({
      where : {
        id : params.chapterId
      }
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true
      }
    })

    if(!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId
        },
        data : {
          isPublished: false
        }
      })
    }

    return NextResponse.json(deletedChapter)
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}


export async function PATCH(req, { params }) {
  try {
    const { userId } = getAuth(req);
    const { isPublished, ...values } = await req.json();

    console.log("PATCH params:", params); // بررسی مقادیر params
    console.log("PATCH values:", values); // بررسی داده‌های ورودی

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.courseId || !params.chapterId) {
      return new NextResponse("Course ID or Chapter ID missing", { status: 400 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { ...values },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        try {
          await video.assets.del(existingMuxData.assetId);
        } catch (error) {
          console.warn("Failed to delete Mux asset:", error);
        }
        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }

      try {
        const asset = await video.assets.create({
          input: { url: values.videoUrl },
          playback_policy: "public",
        });

        const playbackId = asset.playback_ids?.[0]?.id;
        if (!playbackId) {
          return new NextResponse("Failed to get playback ID", { status: 500 });
        }
        await db.muxData.create({
          data: {
            chapterId: params.chapterId,
            assetId: asset.id,
            playbackId: playbackId,
          },
        });
      } catch (error) {
        console.error("Detailed Mux Asset Creation Error:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
          response: error.response ? await error.response.text() : 'No response'
        });
      }
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}