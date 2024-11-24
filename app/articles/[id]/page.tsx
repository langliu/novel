import { fetchArticle, getPrevAndNextPage } from '@/actions/articles'
import { getArticle } from '@/app/dashboard/books/[id]/actions'
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = (await params).id
  const article = await getArticle(id)

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  const title = article ? `第${article.order}章 ${article.title} | 万卷书阁` : '万卷书阁'
  const description = article?.title ?? '万卷书阁'
  return {
    title,
    description,
    openGraph: {
      images: [...previousImages],
      title,
      description,
      siteName: '万卷书阁',
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const articleId = (await params).id
  // 获取关联的文章
  const article = await fetchArticle(articleId)
  if (!article) {
    return null
  }
  const prevAndNextPage = await getPrevAndNextPage(article?.bookId, article?.order ?? 0)

  return (
    <main className={'bg-orange-50 '}>
      <div className={'mx-auto max-w-[800px] bg-orange-100 p-4 pt-0 md:p-8'}>
        <h1 className={'mb-2 font-bold text-xl md:mb-4 md:text-2xl'}>
          第{article?.order ?? 1}章 {article?.title ?? ''}
        </h1>
        <div className={'mb-2 whitespace-break-spaces leading-6'}>
          {(article?.content.split('\n') ?? []).map((p, index) => {
            const key = p + index
            return (
              <p key={key} className={'mb-3 font-normal text-lg'}>
                {p}
              </p>
            )
          })}
        </div>
        <div className={'grid grid-cols-3 gap-4 border border-gray-200'}>
          {prevAndNextPage.prev ? (
            <Link href={`/articles/${prevAndNextPage.prev.id}`} className={'px-4 py-2 text-center'}>
              上一章
            </Link>
          ) : (
            <div className={'px-4 py-2 text-center text-gray-400'}>上一章</div>
          )}
          <Link
            href={`/books/${article.bookId}`}
            className={'cursor-pointer border-gray-200 border-r border-l px-4 py-2 text-center'}
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
      </div>
    </main>
  )
}
