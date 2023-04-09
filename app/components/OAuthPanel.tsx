import React, { useState } from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { useBrowserClient } from '~/root';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

const OAuthPanel = () => {
  const browserClient = useBrowserClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loginWithGithub() {
    const { error } = await browserClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://habitclusters.com/dashboard/',
      },
    });
    if (error !== null) {
      setErrorMessage(error.message);
      return;
    }
    setErrorMessage(null);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    loginWithGithub();
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between pb-8">
        <Separator />
        <p>or</p>
        <Separator />
      </div>
      <button
        onClick={handleSubmit}
        name="oauth-type"
        value="github"
        className="flex w-full items-center justify-center rounded-lg bg-mauve-3 py-2 text-lg text-mauve-12 hover:bg-mauve-4"
      >
        <GitHubLogoIcon className="mr-4 h-7 w-7" />
        Continue with Github
      </button>
      {errorMessage}
    </div>
  );
};

export default OAuthPanel;

function Separator() {
  return (
    <SeparatorPrimitive.Root className="mx-2 h-0.5 w-full bg-gradient-to-r from-transparent via-mauveDark-6 to-transparent opacity-50" />
  );
}
