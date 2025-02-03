import { Category, Course } from '@prisma/client'

import { getProgress } from './get-progress'
import db from '@/lib/db'


type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapter: { id: string }[]
  progress: number | null
}

type GetCourse = {
  userId: string
  title?: string
  categoryId?: string
}

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourse): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title
        },
        categoryId
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true
          },
          select: {
            id: true
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy:{
        createdAt: "desc"
      }
    })

    const courseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
            chapter: course.chapters, // Ensure chapter is included
          };
        }
    
        const progressPercentage = await getProgress(userId, course.id);
    
        return {
          ...course,
          progress: progressPercentage,
          chapter: course.chapters, // Ensure chapter is included
        };
      })
    );

    return courseWithProgress;
  } catch (error) {
    console.log('[GET_COURSES]', error)
    return [];
  }
}
