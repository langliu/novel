import { BookOpenText, Github, Moon, Sun } from 'lucide-react'
import Link from 'next/link'

export function AppHeader() {
  return (
    <header className='sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border'>
      <div className='flex h-14 items-center px-4'>
        <div className='mr-4 hidden md:flex'>
          <Link className='mr-4 flex items-center gap-2 lg:mr-6' href='/'>
            <BookOpenText />
            <span className='hidden font-bold lg:inline-block'>万卷书阁</span>
          </Link>
          <nav className='flex items-center gap-4 text-sm xl:gap-6'>
            <Link
              className='text-foreground/80 transition-colors hover:text-foreground/80'
              href='/books'
            >
              书籍
            </Link>
            {/*<a*/}
            {/*  className='text-foreground/80 transition-colors hover:text-foreground/80'*/}
            {/*  href='/docs/components'*/}
            {/*>*/}
            {/*  Components*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  className='text-foreground transition-colors hover:text-foreground/80'*/}
            {/*  href='/blocks'*/}
            {/*>*/}
            {/*  Blocks*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  className='text-foreground/80 transition-colors hover:text-foreground/80'*/}
            {/*  href='/charts'*/}
            {/*>*/}
            {/*  Charts*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  className='text-foreground/80 transition-colors hover:text-foreground/80'*/}
            {/*  href='/themes'*/}
            {/*>*/}
            {/*  Themes*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  className='text-foreground/80 transition-colors hover:text-foreground/80'*/}
            {/*  href='/colors'*/}
            {/*>*/}
            {/*  Colors*/}
            {/*</a>*/}
          </nav>
        </div>
        <div className='flex flex-1 items-center justify-between gap-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            <button
              type={'button'}
              className='relative inline-flex h-8 w-full items-center justify-start gap-2 whitespace-nowrap rounded-[0.5rem] border border-input bg-muted/50 px-4 py-2 font-normal text-muted-foreground text-sm shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-56 xl:w-64 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0'
            >
              <span className='hidden lg:inline-flex'>Search documentation...</span>
              <span className='inline-flex lg:hidden'>Search...</span>
              <kbd className='pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex'>
                <span className='text-xs'>⌘</span>K
              </kbd>
            </button>
          </div>
          <nav className='flex items-center gap-0.5'>
            <button
              type={'button'}
              className='inline-flex h-8 w-8 items-center justify-center gap-2 whitespace-nowrap rounded-md px-0 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0'
            >
              <a target='_blank' rel='noreferrer' href='https://github.com/shadcn-ui/ui'>
                <Github />
                <span className='sr-only'>GitHub</span>
              </a>
            </button>
            <button
              type={'button'}
              className='group/toggle inline-flex h-8 w-8 items-center justify-center gap-2 whitespace-nowrap rounded-md px-0 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0'
            >
              <Moon className='lucide lucide-sun hidden [html.dark]:block' />
              <Sun className='lucide lucide-moon block' />

              <span className='sr-only'>Toggle theme</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
