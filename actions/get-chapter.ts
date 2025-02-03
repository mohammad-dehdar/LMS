import db from '@/lib/db'
import { Attachments, Chapter } from '@prisma/client'

interface GetChapterProps {
  userId: string
  courseId: string
  chapterId: string
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })
    console.log('Purchase:', purchase)

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId
      },
      select: {
        price: true
      }
    })
    console.log('Course:', course)

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true
      }
    })
    console.log('Chapter:', chapter)

    if (!chapter || !course) {
      throw new Error('Chapter or course not Found')
    }

    let muxData = null
    let attachments: Attachments[] = []
    let nextChapter: Chapter | null = null

    if (purchase) {
      attachments = await db.attachments.findMany({
        where: {
          courseId: courseId
        }
      })
      console.log('Attachments:', attachments)
    }

    if(chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId
        }
      })
      console.log('MuxData:', muxData)

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position
          }
        },
        orderBy: {
          position: 'asc'
        }
      })
      console.log('NextChapter:', nextChapter)
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId
        }
      }
    })
    console.log('UserProgress:', userProgress)

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase
    }
  } catch (error) {
    console.error('Error fetching chapter data:', error)
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null
    }
  }
}