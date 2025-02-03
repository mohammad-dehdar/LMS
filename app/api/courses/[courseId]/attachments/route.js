import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { userId } = await auth(); // گرفتن userId از Clerk
    const { url } = await req.json(); // گرفتن url از بدنه درخواست

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
    const attachment = await db.attachments.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment); // ارسال پاسخ موفق
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse(error, { status: 500 });
  }
}
