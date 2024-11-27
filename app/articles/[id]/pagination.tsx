'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
  bookId: string
  prevAndNextPage: {
    prev?: {
      id: string
      title: string
      order: number
    }
    next?: {
      id: string
      title: string
      order: number
    }
  }
}

export function Pagination({ bookId, prevAndNextPage }: Props) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        if (prevAndNextPage.prev) {
          router.push(`/articles/${prevAndNextPage.prev.id}`)
        }
      } else if (event.key === 'ArrowRight') {
        if (prevAndNextPage.next) {
          router.push(`/articles/${prevAndNextPage.next.id}`)
        }
      }
    }
    document.body.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [prevAndNextPage, router])

  return (
    <div className={'mt-8 grid grid-cols-3 gap-4 border border-gray-300'}>
      {prevAndNextPage.prev ? (
        <Link href={`/articles/${prevAndNextPage.prev.id}`} className={'px-4 py-2 text-center'}>
          上一章
        </Link>
      ) : (
        <div className={'px-4 py-2 text-center text-gray-400'}>上一章</div>
      )}
      <Link
        href={`/books/${bookId}`}
        className={'cursor-pointer border-gray-300 border-r border-l px-4 py-2 text-center'}
      >
        目录
      </Link>
      {prevAndNextPage.next ? (
        <Link className={'px-4 py-2 text-center'} href={`/articles/${prevAndNextPage.next.id}`}>
          下一章
        </Link>
      ) : (
        <div className={'px-4 py-2 text-center text-gray-400'}>下一章</div>
      )}
    </div>
  )
}
