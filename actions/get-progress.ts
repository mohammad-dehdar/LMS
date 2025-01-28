import db from '@/lib/db'

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    // Count valid completed chapters directly in one query
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        isCompleted: true,
        chapter: {
          courseId,
          isPublished: true
        }
      }
    });

    // Get total published chapters count for the course
    const totalPublishedChapters = await db.chapter.count({
      where: {
        courseId,
        isPublished: true
      }
    });

    const progressPercentage =
      (validCompletedChapters / totalPublishedChapters) * 100 || 0;

    return progressPercentage;
  } catch (error) {
    console.log('[GET_PROGRESS]', error);
    return 0;
  }
};
