import db from '@/lib/db'
import { Category, Chapter, Course } from '@prisma/client'
import { getProgress } from './get-progress'

// Extended Course type that includes the properties we need
type CourseWithProgressWithCategory = Course & {
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

    // First cast to unknown, then to our desired type to avoid direct type mismatch
    const courses = await Promise.all(
      purchasedCourses.map(async (purchase) => {
        const courseWithProgress = purchase.course as CourseWithProgressWithCategory;
        const progress = await getProgress(userId, courseWithProgress.id);
        return {
          ...courseWithProgress,
          progress
        };
      })
    );

    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress
    }
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: []
    }
  }
}