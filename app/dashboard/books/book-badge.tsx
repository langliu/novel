import { Badge } from '@/components/ui/badge'
import type { BookType } from '@prisma/client'

type Props = {
  type?: BookType
}
export function BookBadge({ type = 'NORMAL' }: Props) {
  if (type === 'ADULT') {
    return (
      <Badge variant={'outline'} className={'text-yellow-500'}>
        18X
      </Badge>
    )
  }
  if (type === 'CHILDREN') {
    return <Badge variant={'outline'}>儿童</Badge>
  }
  return <Badge variant={'outline'}>普通</Badge>
}
