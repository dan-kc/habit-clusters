import type { ActionArgs } from '@remix-run/node';
import { getHabits, splitHabits } from '~/utils/general.server';
import {
  createHabits,
  createServerClient,
  deleteCluster,
  deleteHabits,
  editClusterInfo,
  getFormData,
  getUser,
  renameHabits,
} from '~/utils/supabase.server';

export async function action({ request }: ActionArgs) {
  // Get form data
  const formData = await getFormData(request);
  const { _action, ...values } = Object.fromEntries(formData);

  const { serverClient } = createServerClient(request);

  if (_action === 'update_cluster') {
    // Get user
    const user = await getUser(serverClient);
    const { id: user_id } = user!;
    console.log(values);

    const { cluster_id, cluster_name, start_time, end_time } = values;

    // Format cluster
    const { oldHabits, newHabits } = getHabits(formData, cluster_id, user_id);

    const { keptOldHabits, deletedOldHabits, keptNewHabits } = splitHabits(
      formData,
      oldHabits,
      newHabits
    );

    Promise.all([
      await editClusterInfo(serverClient, cluster_id, cluster_name, start_time, end_time),
      await renameHabits(serverClient, keptOldHabits),
      await deleteHabits(serverClient, deletedOldHabits),
      await createHabits(serverClient, keptNewHabits),
    ]);
  }

  if (_action === 'delete_cluster') {
    const { cluster_id } = values;
    deleteCluster(serverClient, cluster_id);
  }

  return null;
}
