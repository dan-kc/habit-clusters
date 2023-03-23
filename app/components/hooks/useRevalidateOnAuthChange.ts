import { useFetcher } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const useRevalidateOnAuthChange = (
  browserClient: SupabaseClient<any, "public", any>,
  serverAccessToken: string | undefined
) => {
  const fetcher = useFetcher();

  useEffect(() => {
    console.log(serverAccessToken)
    const {
      data: { subscription },
    } = browserClient.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync.
        // Remix recalls active loaders after actions complete
        fetcher.submit(null, {
          method: "post",
          action: "/handle-supabase-auth",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, SupabaseClient, fetcher]);
};

export default useRevalidateOnAuthChange;
