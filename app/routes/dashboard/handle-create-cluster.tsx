import type { ActionArgs } from '@remix-run/node';
import { getHabits, splitHabits } from '~/utils/general.server';
import {
  createCluster,
  createHabits,
  createServerClient,
  getFormData,
  getUser,
} from '~/utils/supabase.server';

export async function action({ request }: ActionArgs) {
  // Get form data
  const formData = await getFormData(request);
  const { _action, ...values } = Object.fromEntries(formData);

  const { serverClient } = createServerClient(request);

  // Get user
  const user = await getUser(serverClient);
  const { id: user_id } = user!;

  const { cluster_id, cluster_name, start_time, end_time } = values;

  // Format cluster
  const { oldHabits, newHabits } = getHabits(formData, cluster_id, user_id);
  const { keptNewHabits } = splitHabits(formData, oldHabits, newHabits);

  await createCluster(
    serverClient,
    user_id,
    cluster_id,
    cluster_name,
    start_time,
    end_time
  );

  await createHabits(serverClient, keptNewHabits);

  return null;
}
