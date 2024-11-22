import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata, ResolvingMetadata } from 'next'
import { getBook } from '@/actions/books'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata (
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id

  const book = await getBook(id)

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  const title = book?.title ?? '万卷书阁'
  const description = book?.introduction ?? '万卷书阁'
  return {
    title,
    description,
    openGraph: {
      images: [book?.cover ?? '', ...previousImages],
      title,
      description,
      siteName: '万卷书阁',
    },
  }
}

function getBookArticles(bookId: string) {
  // 使用 bookId 过滤 article
  return prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      articles: {
        orderBy: {
          order: 'asc',
        },
        select: {
          order: true,
          title: true,
          id: true,
        },
      },
    },
  })
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const bookId = (await params).id
  // 获取关联的文章
  const book = await getBookArticles(bookId)
  if (!book) {
    return null
  }
  return (
    <div className={'p-4 pb-10'}>
      <div className={'mb-4 flex gap-3'}>
        {book.cover && (
          <Image alt={book.title} src={book.cover} width={80} height={160} className={'rounded'} />
        )}
        <div className={'flex-1'}>
          <h1 className={'mb-2 font-medium text-base'}>{book.title}</h1>
          <p className={'line-clamp-2 overflow-hidden text-ellipsis text-muted-foreground text-sm'}>
            {book.introduction}
          </p>
        </div>
      </div>
      <ul className={'grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 '}>
        {book.articles.map((article) => (
          <Link href={`/articles/${article.id}`} key={article.id} className={'h-6 line-clamp-1 overflow-hidden text-ellipsis'}>
            第{article.order}章&nbsp;{article.title}
          </Link>
        ))}
      </ul>
    </div>
  )
}
