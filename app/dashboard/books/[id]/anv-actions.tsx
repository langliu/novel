'use client'

import { ChartScatter, FolderInput, MoreHorizontal, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { updateBookStatic } from '@/actions/books'
import { EditSheet } from '@/app/dashboard/books/[id]/edit-sheet'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

type Props = {
  bookId: string
  chapters?: number
  /** 静态数据 */
  statistics: {
    chapters: number
    wordCount: number
  }
}

export function NavActions({ bookId, chapters = 0, statistics }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  const currentDate = new Intl.DateTimeFormat('zh', {
    dateStyle: 'full',
  }).format(new Date())
  const importHref = `${pathname}/import`

  const handleUpdate = async () => {
    try {
      await updateBookStatic({
        ...statistics,
        id: bookId,
      })
      setIsOpen(false)
      toast({
        title: '更新成功',
        description: `共更新${statistics.chapters}章`,
      })
    } catch (e) {
      toast({
        title: '更新失败',
      })
    }
  }

  return (
    <div className='flex items-center gap-2 text-sm'>
      <div className='hidden font-medium text-muted-foreground md:inline-block'>{currentDate}</div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant='ghost' size='icon' className='h-7 w-7 data-[state=open]:bg-accent'>
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-56 overflow-hidden rounded-lg p-0' align='end'>
          <Sidebar collapsible='none' className='bg-transparent'>
            <SidebarContent>
              <SidebarGroup className='border-b last:border-none'>
                <SidebarGroupContent className='gap-0'>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <EditSheet
                        bookId={bookId}
                        type={'create'}
                        last={chapters + 1}
                        customTrigger={
                          <SidebarMenuButton>
                            <Plus /> <span>新建文章</span>
                          </SidebarMenuButton>
                        }
                      />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href={importHref}>
                        <SidebarMenuButton>
                          <FolderInput /> <span>批量导入</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={handleUpdate}>
                        <ChartScatter /> <span>更新统计信息</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
