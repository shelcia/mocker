import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import type { ReactNode } from 'react';

import { FooterComponent, HeaderActions, HeaderLogo } from './common';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <React.Fragment>
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <header className="sticky top-0 z-20">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <HeaderLogo />

            <div className="flex items-center gap-2">
              <HeaderActions />
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-6xl items-center px-4 py-10 mb-8">
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
                  Define a schema, get unlimited resources & projects, and generate usable endpoints
                  for testing, powered by{' '}
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
        <FooterComponent />
      </div>
    </React.Fragment>
  );
};

export default AuthLayout;

const FeatureChip = ({ children }: { children: ReactNode }) => {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-zinc-900/5 px-3 py-1 text-xs text-zinc-700 ring-1 ring-zinc-900/10 dark:bg-white/5 dark:text-zinc-200 dark:ring-white/10">
      {children}
    </span>
  );
};
