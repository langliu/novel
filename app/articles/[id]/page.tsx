import { fetchArticle, getPrevAndNextPage } from '@/actions/articles'
import { Pagination } from '@/app/articles/[id]/pagination'
import { getArticle } from '@/app/dashboard/books/[id]/actions'
import { NavBreadcrumb } from '@/components/article-breadcrumb'
import type { Metadata, ResolvingMetadata } from 'next'

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
    <main className={'bg-repeat'} style={{ backgroundImage: `url('/body_base_bg.png')` }}>
      <div
        className={'mx-auto max-w-[800px] bg-repeat p-4 shadow-muted md:p-8'}
        style={{ backgroundImage: `url('/basic_bg.png')` }}
      >
        <NavBreadcrumb
          breadcrumbList={[
            { title: '首页', href: '/' },
            { title: article?.book?.title ?? '', href: `/books/${article?.bookId}` },
            { title: article?.title ?? '' },
          ]}
        />
        <h1 className={'mb-2 font-bold text-xl md:mb-4 md:text-2xl'}>
          第{article?.order ?? 1}章 {article?.title ?? ''}
        </h1>
        <div className={'mb-2 whitespace-break-spaces leading-6'}>
          {(article?.content.split('\n') ?? []).map((p, index) => {
            const key = p + index
            return (
              <p key={key} className={'mb-2 indent-[2em] font-normal text-xl md:mb-3'}>
                {p}
              </p>
            )
          })}
        </div>
        <Pagination bookId={article?.bookId ?? ''} prevAndNextPage={prevAndNextPage} />
      </div>
    </main>
  )
}
