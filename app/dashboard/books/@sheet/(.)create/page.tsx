'use client'
import { getAuthors } from '@/actions/authors'
import { insertBook } from '@/app/dashboard/books/actions'
import ImageUploader from '@/components/image-uploader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { getWordCount } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Author } from '@prisma/client'
import { useDebounceFn } from 'ahooks'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import {  useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string({ required_error: '请输入书名' }),
  introduction: z.string({ required_error: '请输入书籍简介' }).min(1, '请输入书籍简介'),
  authorId: z.string().nullable(),
  endStatus: z.boolean(),
  cover: z.string().nullable(),
})

export default function EditSheet() {
  const router = useRouter()
  const { toast } = useToast()
  const [authors, setAuthors] = useState<Author[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      introduction: '',
      endStatus: false,
      authorId: null,
      cover: null,
    },
  })

  const { run: handleSubmit } = useDebounceFn(
    async (values: z.infer<typeof formSchema>) => {
      console.log(values)
      try {
        await insertBook({
          ...values,
        })
        handleOpenChange(false)
      } catch (error) {
        console.error(error)
        toast({
          title: '编辑失败',
          description: (error as Error)?.message ?? '',
          variant: 'destructive',
        })
      }
    },
    {
      wait: 1000,
    },
  )

  function handleOpenChange(open: boolean) {
    if (!open) {
      router.back()
    }
  }

  useEffect(() => {
    getAuthors().then((res) => {
      setAuthors(res)
    })
  }, [])

  return (
    <Sheet open onOpenChange={handleOpenChange}>
      <SheetContent
        className={clsx('flex w-[600px] flex-col overflow-y-auto sm:w-[800px] sm:max-w-full')}
      >
        <SheetHeader>
          <SheetTitle>{'新建书籍'}</SheetTitle>
          <SheetDescription>
            请注意，新建或编辑章节后，您的内容将被保存并可能对其他读者可见。请确保您的内容符合相关法律法规和社区准则。
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-1 flex-col space-y-4 px-0.5'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>书籍名称</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入书籍名称' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='cover'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>书籍封面</FormLabel>
                  <FormControl>
                    <ImageUploader {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='authorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>书籍作者</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择书籍作者' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='introduction'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>书籍简介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='请输入章节内容'
                      className={clsx('h-32 leading-6 md:leading-6')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    共记有 {getWordCount(form.watch('introduction') ?? '')} 字
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='endStatus'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>是否完结</FormLabel>
                  <FormControl>
                    <div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type='submit' className='px-8'>
                提交
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
