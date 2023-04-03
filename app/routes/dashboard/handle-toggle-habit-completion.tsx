import type { ActionArgs } from '@remix-run/node';
import {
  createServerClient,
  getFormData,
  getUser,
  toggleIsComplete,
} from '~/utils/supabase.server';

export async function action({ request }: ActionArgs) {
  // Get form data
  const formData = await getFormData(request);
  const { _action, ...values } = Object.fromEntries(formData);

  const { serverClient } = createServerClient(request);

  // Get user
  const user = await getUser(serverClient);
  const { id: user_id } = user!;

  const { is_complete, habit_id } = values;

  toggleIsComplete(serverClient, is_complete, habit_id, user_id);
  await new Promise((resolve) => setTimeout(resolve, 500)); //HACK: Reduces the chance of stale data being fetched from loader

  return null;
}
