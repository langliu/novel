'use client'

import { batchImportArticles } from '@/actions/articles'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { getWordCount } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fileContentHandler } from './file-content-handler'

type TxtUploaderProps = {
  bookId: string
}

const FormSchema = z.object({
  start: z.preprocess(
    (value) => Number.parseInt(z.string().parse(value), 10),
    z
      .number({
        required_error: '请输入起始章节序号',
      })
      .min(0, '序号不能小于1'),
  ),
  fileCode: z.enum(['utf-8', 'gbk'], { required_error: '请选择编码' }),
})

let originalContent = ''

export function TxtUploader({ bookId }: TxtUploaderProps) {
  const [fileContent, setFileContent] = useState<
    { order: number; title: string; content: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      start: 0,
      fileCode: 'utf-8',
    },
  })

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const fileCode = form.getValues('fileCode')
    if (file) {
      setIsLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        originalContent = content
        const chapters = fileContentHandler(content)
        console.log(chapters?.[0], chapters.at(-1))
        form.setValue('start', chapters?.[0]?.order ?? 0)
        setFileContent(chapters ?? [])
        setIsLoading(false)
      }
      reader.onerror = () => {
        console.error('文件读取失败')
        setIsLoading(false)
      }
      reader.readAsText(file, fileCode)
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
      const start = form.getValues('start')
      await batchImportArticles(
        fileContent.map((item, index) => ({
          bookId,
          title: item.title,
          content: item.content,
          order: start ? Number(start) + index : item.order,
          wordCount: getWordCount(item.content),
        })),
      )
      toast({
        title: '导入成功',
        description: `共导入${fileContent.length}条数据`,
      })
      handleClear()
    } catch (e) {
      console.error(e)
      toast({
        title: '导入失败',
        description: (e as Error)?.message,
        variant: 'destructive',
      })
    }
  }

  const handleClear = () => {
    setFileContent([])
    originalContent = ''
  }

  return (
    <div className='p-4'>
      <Card className={'w-full'}>
        <CardHeader>
          <CardTitle>文件读取配置</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name='start'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>起始章节序号</FormLabel>
                    <FormControl>
                      <Input placeholder='请输入章节序号' type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fileCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>文件编码</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-col space-y-1'
                      >
                        <FormItem className='flex items-center space-x-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='utf-8' />
                          </FormControl>
                          <FormLabel className='font-normal'>UTF-8</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-x-3 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='gbk' />
                          </FormControl>
                          <FormLabel className='font-normal'>GBK</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
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
              value={''}
              className='hidden'
              id='file-input'
            />
            <Button type={'button'} variant={'default'} className={'ml-4'} onClick={handleClear}>
              清空
            </Button>
          </div>
          {isLoading && <p>正在加载文件内容...</p>}
          {originalContent && (
            <>
              <div className='mt-4'>文件内容：</div>
              <pre className='whitespace-pre-line rounded-md bg-gray-100 p-4'>
                <code>{originalContent.slice(0, 300)}</code>
              </pre>
            </>
          )}
          {fileContent.length > 0 && <div className='mt-4'>共{fileContent.length}章</div>}
          {fileContent.map((chapter, index) => (
            <Collapsible key={chapter.order + chapter.title}>
              <CollapsibleTrigger className={'py-2'}>
                {index + 1} 第{form.watch('start') ? form.watch('start') + index : chapter.order}章{' '}
                {chapter.title} 共{getWordCount(chapter.content)}字
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
