import { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from '@remix-run/react';
import type { SupabaseClient } from '@supabase/auth-helpers-remix';
import { createBrowserClient } from '@supabase/auth-helpers-remix';
import { useEffect, useState } from 'react';
import stylesheet from '~/globals.css';
import { createServerClient, getServerSession } from '@utils/supabase.server';
import useUpdateDeviceMode from './components/hooks/useUpdateDeviceMode';

export const loader = async ({ request }: LoaderArgs) => {

  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };

  const { serverClient, response } = createServerClient(request);

  // Redirect to dashboard if user is logged in
  const session = await getServerSession(serverClient);

  return json(
    {
      env,
      session,
    },
    {
      headers: response.headers,
    }
  );
};

export default function App() {

  // Get enviroment variables from server
  const { env, session } = useLoaderData();

  const [browserClient] = useState(() =>
    createBrowserClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!) // Only gets called once
  );

  const serverAccessToken = session?.access_token;

  const fetcher = useFetcher();

  useEffect(() => {
    const {
      data: { subscription },
    } = browserClient.auth.onAuthStateChange((_, session) => {
      if (session?.access_token !== serverAccessToken) {
        // Server and client are out of sync so we send an Action to recall the Loaders
        fetcher.submit(null, {
          method: 'post',
          action: '/api/handle-supabase-auth',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, browserClient]);

  useUpdateDeviceMode()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-mauveDark-1 font-sans text-mauveDark-12 dark:bg-mauveDark-1 dark:text-mauveDark-12">
        <Outlet context={browserClient} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

type ContextType = SupabaseClient<any, 'public', any>;

export function useBrowserClient() {
  return useOutletContext<ContextType>();
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <>
          Something went wrong. Refresh to try again.
          <Scripts />
        </>
      </body>
    </html>
  );
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Habit Clusters',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [{
  rel: 'stylesheet',
  href: stylesheet
}];
