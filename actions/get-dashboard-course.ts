import db from '@/lib/db'
import { Category, Chapter } from '@prisma/client'
import { getProgress } from './get-progress'

type CourseWithProgressWithCategory = {
  category: Category
  chapters: Chapter[]
  progress: number | null
}

type DashboardCourse = {
  completedCourses: CourseWithProgressWithCategory[]
  coursesInProgress: CourseWithProgressWithCategory[]
}

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourse> => {
  try {
    // یافتن دوره‌های خریداری شده توسط کاربر
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true
              }
            }
          }
        }
      }
    })

    // استخراج دوره‌ها از نتایج خریدها
    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

    // محاسبه پیشرفت کاربر در هر دوره
    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    // دسته‌بندی دوره‌ها به دوره‌های تکمیل شده و دوره‌های در حال پیشرفت
    const completedCourses = courses.filter((course) => course.progress === 100)
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100)

    return {
      completedCourses,
      coursesInProgress
    }
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error)
    return {
      completedCourses: [],
      coursesInProgress: []
    }
  }
}