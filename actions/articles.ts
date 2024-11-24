'use server'
import prisma from '@/lib/prisma'

export async function fetchArticle(articleId: string) {
  return prisma.article.findUnique({ where: { id: articleId } })
}

/**
 * 获取上一篇和下一篇的文章
 * @param articleId 文章ID
 * @param order 文章序号
 */
export async function getPrevAndNextPage(articleId: string, order: number) {
  const res = await prisma.article.findMany({
    where: {
      bookId: articleId,
      order: {
        in: [order - 1, order + 1],
      },
    },
    select: {
      id: true,
      title: true,
      order: true,
    },
  })
  return {
    prev: res.find((item) => item.order === order - 1),
    next: res.find((item) => item.order === order + 1),
  }
}