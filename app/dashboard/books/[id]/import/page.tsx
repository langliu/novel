import { getBook } from '@/actions/books'
import { TxtUploader } from '@/app/dashboard/books/[id]/import/txt-uploader'
import { NavBreadcrumb } from '@/components/nav-breadcrumb'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Home({ params }: Props) {
  const bookId = (await params).id
  const book = await getBook(bookId)

  return (
    <>
      <NavBreadcrumb
        breadcrumbList={[
          { title: '书籍管理', href: '/dashboard/books' },
          { title: '书籍列表', href: '/dashboard/books' },
          { title: book?.title ?? '', href: `/dashboard/books/${bookId}` },
          { title: '导入文章' },
        ]}
      />
      <TxtUploader bookId={bookId} />
    </>
  )
}
