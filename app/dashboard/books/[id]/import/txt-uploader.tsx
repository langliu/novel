'use client'

import { batchImportArticles } from '@/actions/articles'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { getWordCount } from '@/lib/utils'
import { type ChangeEvent, useState } from 'react'
import { fileContentHandler } from './file-content-handler'

type TxtUploaderProps = {
  bookId: string
}

export function TxtUploader({ bookId }: TxtUploaderProps) {
  const [fileContent, setFileContent] = useState<
    { order: number; title: string; content: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [start, setStart] = useState(0)
  const { toast } = useToast()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const chapters = fileContentHandler(content)
        console.log(chapters?.[0], chapters.at(-1))
        setStart(chapters?.[0]?.order ?? 0)
        setFileContent(chapters ?? [])
        setIsLoading(false)
      }
      reader.onerror = () => {
        console.error('文件读取失败')
        setIsLoading(false)
      }
      reader.readAsText(file, 'gbk')
    }
  }

  const handleImport = async () => {
    if (fileContent.length === 0) {
      toast({
        title: '导入失败',
        description: '请选择文件',
        variant: 'destructive',
      })
      return
    }
    try {
      await batchImportArticles(
        fileContent.map((item, index) => ({
          bookId,
          title: item.title,
          content: item.content,
          order: start ? start + index : item.order,
          wordCount: getWordCount(item.content),
        })),
      )
      toast({
        title: '导入成功',
        description: `共导入${fileContent.length}条数据`,
      })
    } catch (e) {
      toast({
        title: '导入失败',
        description: (e as Error)?.message,
        variant: 'destructive',
      })
    }
  }

  const handleStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStart(Number(event.target.value))
  }

  return (
    <div className='p-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className={'flex justify-between'}>
            本地TXT文件阅读器
            <Button type={'button'} variant={'default'} onClick={handleImport}>
              导入
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={'mb-4'}>
            <label htmlFor={'start'}>起始章节：</label>
            <Input id={'start'} type={'number'} value={start} onChange={handleStartChange} />
          </div>
          <div className='mb-4'>
            <label htmlFor='file-input'>
              <span className={buttonVariants({ variant: 'default', className: 'cursor-pointer' })}>
                选择文件
              </span>
            </label>
            <input
              type='file'
              accept='.txt'
              onChange={handleFileChange}
              className='hidden'
              id='file-input'
            />
          </div>
          {isLoading && <p>正在加载文件内容...</p>}
          {fileContent.length > 0 && <div className='mt-4'>共{fileContent.length}章</div>}
          {fileContent.map((chapter, index) => (
            <Collapsible key={chapter.order}>
              <CollapsibleTrigger className={'py-2'}>
                {index + 1} 第{start ? start + index : chapter.order}章 {chapter.title} 共
                {getWordCount(chapter.content)}字
              </CollapsibleTrigger>
              <CollapsibleContent
                className={'whitespace-pre-line rounded-md bg-gray-100 p-4 text-lg'}
              >
                {chapter.content}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
