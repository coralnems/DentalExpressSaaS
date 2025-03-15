'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function SignInPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignIn
          appearance={{
            baseTheme: theme === 'dark' ? dark : undefined,
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-background',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'bg-background text-foreground border border-input',
              formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
              footerActionLink: 'text-primary hover:text-primary/90',
            },
          }}
          redirectUrl="/dashboard"
          routing="path"
          path="/signin"
        />
      </div>
    </div>
  );
}
