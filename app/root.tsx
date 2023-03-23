import {
  json,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import {
  createBrowserClient,
  SupabaseClient,
} from "@supabase/auth-helpers-remix";
import { useState } from "react";
import stylesheet from "~/globals.css";
import useRevalidateOnAuthChange from "./components/hooks/useRevalidateOnAuthChange";
import { createServerClient } from "./utils/server";

export const loader = async ({ request }: LoaderArgs) => {
  console.log("ISITTHIS?")
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };

  const { serverClient, response } = createServerClient(request);

  const {
    data: { session },
  } = await serverClient.auth.getSession();

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
  const { env, session } = useLoaderData();

  const [browserClient] = useState(() =>
    createBrowserClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!)
  );

  useRevalidateOnAuthChange(browserClient, session);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-grayDark-1 font-sans text-grayDark-12 dark:bg-grayDark-1 dark:text-grayDark-12">
        <Outlet context={browserClient} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

type ContextType = SupabaseClient<any, "public", any>;

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
          Root error page sorry sumn happened
          <Scripts />
        </>
      </body>
    </html>
  );
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Habit Clusters",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
