import {
  createServerClient as _createServerClient,
  SupabaseClient,
} from "@supabase/auth-helpers-remix";

export const createServerClient = (request: Request) => {
  const response = new Response();
  const serverClient = _createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  return { serverClient, response };
};
export async function getServerSession(
  serverClient: SupabaseClient<any, "public", any>
) {
  const {
    data: { session },
  } = await serverClient.auth.getSession();
  return session;
}

export async function getUser(
  serverClient: SupabaseClient<any, "public", any>
) {
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  return user;
}
