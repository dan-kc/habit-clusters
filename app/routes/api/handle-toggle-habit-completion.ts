import type { ActionArgs } from '@remix-run/node';
import { createServerClient, getFormData } from '~/utils/supabase.server';

export async function action({ request }: ActionArgs) {
  // Get form data
  const formData = await getFormData(request);
  const { _action, ...values } = Object.fromEntries(formData);
  const { serverClient } = createServerClient(request);
  const { habit_id, date } = values;

  if (_action === 'toggle_completion_on') {
    if ((typeof habit_id === "string") && (typeof date === "string")) {
      await serverClient
        .from('habit_dates_completed')
        .insert([{ habit_id: habit_id, date: date }]);
    }
  }

  if (_action === 'toggle_completion_off') {
    await serverClient
      .from('habit_dates_completed')
      .delete()
      .eq('habit_id', habit_id)
      .eq('date', date);
  }

  await new Promise((resolve) => setTimeout(resolve, 500)); //HACK: Reduces the chance of stale data being fetched from loader

  return null;
}
