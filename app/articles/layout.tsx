import { AppHeader } from '@/components/app-header'
import type { ReactNode } from 'react'

export default function ArticleLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div>
      <AppHeader />
      {children}
    </div>
  )
}
