import db from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: true,
      },
    });

    const groupedData = groupByCourse(purchases as PurchaseWithCourse[]);
    const totalRevenue = Object.values(groupedData).reduce((acc, value) => acc + value, 0);
    const totalSales = purchases.length;

    return {
      data: groupedData,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    throw new Error("Error fetching analytics data");
  }
};