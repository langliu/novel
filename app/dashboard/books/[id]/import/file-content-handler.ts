import nzhcn from 'nzh/cn'
/**
 * 判断是否是数字
 * @param str
 */
function isNumeric(str: string) {
  return /^\d+$/.test(str)
}

export function fileContentHandler(content: string) {
  const regex = /正文卷\s第?.+章?\s.+\r\n/g
  const chaptersTitles = content.match(regex)

  // 输出每个章节的标题
  const chapterList =
    chaptersTitles
      ?.map((chapter) => {
        const result = chapter.match(/正文卷\s第?(.+?)章?\s(.+)/)
        if (result) {
          const order = isNumeric(result[1]) ? result[1] : nzhcn.decodeS(result[1])
          return {
            order: Number.parseInt(order),
            title: result[2],
          }
        }
        return null
      })
      .filter((item) => !!item) ?? []
  // 拆分章节
  const chapters = content.split(regex)
  // 去除每个章节的空行
  chapters.forEach((chapter, index) => {
    if (index === 0) return // 跳过第一个空章节
    chapters[index] = chapter.trim()
  })
  return (
    chapterList?.map((chapter, index) => {
      return {
        ...chapter,
        content: chapters[index + 1],
      }
    }) ?? []
  )
}
