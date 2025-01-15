import db from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { userId } = getAuth(req); // گرفتن userId از Clerk
  
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // چک کردن اینکه کاربر مالک دوره است
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    // ساخت attachment جدید
    const attachment = await db.attachments.delete({
      where : {
        courseId : params.courseId,
        id: params.attachmentId
      }
    });

    return NextResponse.json(attachment); // ارسال پاسخ موفق
  } catch (error) {
    console.log("COURSE_ID", error);
    return new NextResponse(error, { status: 500 });
  }
}
