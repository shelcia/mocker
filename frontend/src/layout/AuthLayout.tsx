import React, { ReactNode } from 'react';
import CustomToggle from '../components/CustomToggle';
import { FiGithub } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <React.Fragment>
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <header className="sticky top-0 z-20">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-400 to-fuchsia-500" />
              <span className="text-sm font-semibold tracking-wide">Mocker</span>
              <Badge
                variant="secondary"
                className="ml-2 bg-zinc-900/10 text-zinc-700 dark:bg-white/10 dark:text-zinc-100"
              >
                beta
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="h-9 rounded-full bg-zinc-900/5 px-3 hover:bg-zinc-900/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <a
                  href="https://mocker-docs.vercel.app/docs/intro"
                  target="_blank"
                  rel="noreferrer"
                >
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
                  <FiGithub className="h-4 w-4" />
                </a>
              </Button>

              <Separator
                orientation="vertical"
                className="mx-1 h-6 bg-zinc-900/10 dark:bg-white/10"
              />

              <div className="rounded-full bg-zinc-900/5 px-2 py-1 hover:bg-zinc-900/10 dark:bg-white/5 dark:hover:bg-white/10">
                <CustomToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-6xl items-center px-4 py-10">
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/5 px-3 py-1 text-xs text-zinc-700 ring-1 ring-zinc-900/10 dark:bg-white/5 dark:text-zinc-200 dark:ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  Generate mock APIs in minutes — not days
                </div>

                <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Mock data + endpoints{' '}
                  <span className="bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-300 bg-clip-text text-transparent">
                    that feel real
                  </span>
                  .
                </h1>

                <p className="max-w-xl text-base text-muted-foreground">
                  Define a schema, get unlimited resources & projects, and ship usable endpoints
                  powered by{' '}
                  <a
                    href="https://fakerjs.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:opacity-90"
                  >
                    faker.js
                  </a>
                  .
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <FeatureChip>Unlimited projects</FeatureChip>
                  <FeatureChip>Unlimited resources</FeatureChip>
                  <FeatureChip>Schema options</FeatureChip>
                  <FeatureChip>Instant endpoints</FeatureChip>
                </div>

                <div className="mt-6 rounded-2xl bg-white/70 p-4 ring-1 ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10">
                  <div className="text-xs text-muted-foreground">Example endpoint</div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-zinc-900/5 p-3 text-xs text-zinc-700 ring-1 ring-zinc-900/10 dark:bg-black/30 dark:text-zinc-100 dark:ring-white/10">
                    {`GET /user/:endpoint
→ 200 OK
[
  { "id": 1, "firstName": "Jeanne", "email": "jeanne@example.com" }
]`}
                  </pre>
                </div>
              </div>
            </section>

            <section className="lg:col-span-5">
              <div className="relative">
                <Card className="relative rounded-3xl border-border/60 bg-card/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <CardContent className="p-6">{children}</CardContent>
                </Card>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  By continuing, you agree to the terms and privacy policy.
                </p>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4 text-xs text-muted-foreground">
          <span>Built by</span>
          <a
            href="https://shelcia-dev.me/"
            target="_blank"
            rel="noreferrer"
            className="ml-1 font-medium text-foreground underline underline-offset-4 hover:opacity-90"
          >
            Shelcia
          </a>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default AuthLayout;

function FeatureChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-zinc-900/5 px-3 py-1 text-xs text-zinc-700 ring-1 ring-zinc-900/10 dark:bg-white/5 dark:text-zinc-200 dark:ring-white/10">
      {children}
    </span>
  );
}
