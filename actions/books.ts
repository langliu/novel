'use server'
import prisma from '@/lib/prisma'
import type { Book } from '@prisma/client'

export async function getBook(bookId: string): Promise<Book | null> {
  return prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })
}

/**
 * 更新书籍统计信息
 * @param book
 */
export async function updateBookStatic(
  book: Pick<Book, 'id' | 'chapters' | 'wordCount'>,
): Promise<Book> {
  return prisma.book.update({
    where: {
      id: book.id,
    },
    data: {
      chapters: book.chapters,
      wordCount: book.wordCount,
    },
  })
}
