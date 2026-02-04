import { CustomToggle } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { Component, Github } from 'lucide-react';

export const HeaderActions = () => {
  return (
    <>
      <Button
        asChild
        variant="ghost"
        className="h-9 rounded-full bg-zinc-900/5 px-3 hover:bg-zinc-900/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <a href="https://mocker-docs.vercel.app/docs/intro" target="_blank" rel="noreferrer">
          Docs
        </a>
      </Button>

      <Button
        asChild
        variant="ghost"
        className="h-9 w-9 rounded-full bg-zinc-900/5 p-0 hover:bg-zinc-900/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <a
          href="https://github.com/shelcia/mocker"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </a>
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6 bg-zinc-900/10 dark:bg-white/10" />

      <div className="rounded-full bg-zinc-900/5 px-2 py-1 hover:bg-zinc-900/10 dark:bg-white/5 dark:hover:bg-white/10">
        <CustomToggle />
      </div>
    </>
  );
};

export const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Component className="size-4" />
      <span className="text-md font-semibold tracking-wide">Mocker</span>
      <Badge
        variant="secondary"
        className="bg-zinc-900/10 text-zinc-700 dark:bg-white/10 dark:text-zinc-100 text-xs font-light"
      >
        beta
      </Badge>
    </div>
  );
};

export const FooterComponent = () => {
  return (
    <footer className="border-t py-6 fixed bottom-0 w-full bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Mocker. All rights reserved.</span>
        <Separator orientation="vertical" className="h-4 bg-zinc-900/10 dark:bg-white/10" />
        <a
          href="https://shelcia-dev.me/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:opacity-90"
        >
          Built by <b>Shelcia</b>
        </a>
      </div>
    </footer>
  );
};
