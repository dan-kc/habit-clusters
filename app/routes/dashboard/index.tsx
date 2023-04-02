import Header from "@components/Header";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Profile } from "@utils/types";
import ClusterList from "~/components/ClusterList";
import ComingSoonPanel from "~/components/ComingSoonPanel";
import Container from "~/components/Container";
import {
  createCluster,
  createHabits,
  deleteCluster,
  deleteHabits,
  editClusterInfo,
  getFormData,
  getUserData,
  renameHabits,
  toggleIsComplete
} from "~/utils/database";
import { createServerClient, getUser } from "~/utils/server";

export const loader = async ({ request }: LoaderArgs) => {

  const { serverClient } = createServerClient(request);

  const [_, data] = await Promise.all([
    getUser(serverClient), // Redirects if not logged in
    getUserData(serverClient) // Throws if can't get data
  ]);

  return json(data)
};

export async function action({ request }: ActionArgs) {
  // Get form data
  const formData = await getFormData(request);
  const { _action, ...values } = Object.fromEntries(formData);

  const { serverClient } = createServerClient(request);

  // Get user
  const user = await getUser(serverClient);
  const { id: user_id } = user!;

  if (_action === "toggle_is_complete") {

    const { is_complete, habit_id } = values;

    toggleIsComplete(serverClient, is_complete, habit_id, user_id);
    await new Promise(resolve => setTimeout(resolve, 500)) //HACK: Reduces the chance of stale data being fetched from loader
  }

  if (_action === "create_cluster") {

    const { cluster_id, cluster_name, start_time, end_time } = values;

    const { oldHabits, newHabits } = getHabits(formData, cluster_id, user_id);

    const { keptNewHabits } = splitHabits(
      formData,
      oldHabits,
      newHabits
    );

    await createCluster(
      serverClient,
      user_id,
      cluster_id,
      cluster_name,
      start_time,
      end_time
    );

    await createHabits(serverClient, keptNewHabits);
  }

  if (_action === "update_cluster") {

    const { cluster_id, cluster_name, start_time, end_time } = values;

    const { oldHabits, newHabits } = getHabits(formData, cluster_id, user_id);

    const { keptOldHabits, deletedOldHabits, keptNewHabits } = splitHabits(
      formData,
      oldHabits,
      newHabits
    );

    Promise.all([
      await editClusterInfo(
        serverClient,
        cluster_id,
        cluster_name,
        start_time,
        end_time
      ),
      await renameHabits(serverClient, keptOldHabits),
      await deleteHabits(serverClient, deletedOldHabits),
      await createHabits(serverClient, keptNewHabits),
    ]);
  }

  if (_action === "delete_cluster") {

    const { cluster_id } = values;
    deleteCluster(serverClient, cluster_id);
  }

  return null;
}

const Dashboard: React.FC = () => {

  const data = useLoaderData();
  const { clusters } = data[0] as Profile;

  return (
    <Container>
      <Header />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <ClusterList clusters={clusters} />
        <div className="space-y-2">
          {["Tracker", "To-do list", "Ban list"].map((panel) => (
            <ComingSoonPanel heading={panel} key={panel} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;

export interface FormDataHabit {
  id: FormDataEntryValue;
  name: FormDataEntryValue;
  cluster_id: FormDataEntryValue;
  user_id: FormDataEntryValue;
}

function formatHabitArray(
  arr1: FormDataEntryValue[],
  arr2: FormDataEntryValue[],
  cluster_id: FormDataEntryValue,
  user_id: FormDataEntryValue
): FormDataHabit[] {
  return arr1.map((entry, index) => {
    return {
      id: entry,
      name: arr2[index],
      cluster_id,
      user_id,
    };
  });
}

function splitArrayByIsDeleted(
  habitArr: FormDataHabit[],
  isDeletedArr: FormDataEntryValue[]
): FormDataHabit[][] {
  let nonDeletedArr: FormDataHabit[] = [];
  let deletedArr: FormDataHabit[] = [];
  isDeletedArr.map((isDeleted, index) => {
    isDeleted === "true"
      ? deletedArr.push(habitArr[index])
      : nonDeletedArr.push(habitArr[index]);
  });
  return [nonDeletedArr, deletedArr];
}

function getHabits(
  formData: FormData,
  clusterId: FormDataEntryValue,
  userId: FormDataEntryValue
) {
  const oldHabitIds = formData.getAll("old_habit_id");
  const newHabitIds = formData.getAll("new_habit_id");
  const oldHabitNames = formData.getAll("old_habit_name");
  const newHabitNames = formData.getAll("new_habit_name");
  const oldHabits = formatHabitArray(
    oldHabitIds,
    oldHabitNames,
    clusterId,
    userId
  );
  const newHabits = formatHabitArray(
    newHabitIds,
    newHabitNames,
    clusterId,
    userId
  );
  return { oldHabits, newHabits };
}

function splitHabits(
  formData: FormData,
  oldHabits: FormDataHabit[],
  newHabits: FormDataHabit[]
) {
  const isOldHabitDeleted = formData
    .getAll("is_habit_deleted")
    .slice(0, oldHabits.length);
  const isNewHabitDeleted = formData
    .getAll("is_habit_deleted")
    .slice(oldHabits.length, oldHabits.length + newHabits.length);
  const [keptOldHabits, deletedOldHabits] = splitArrayByIsDeleted(
    oldHabits,
    isOldHabitDeleted
  );
  const [keptNewHabits] = splitArrayByIsDeleted(newHabits, isNewHabitDeleted);
  return { keptOldHabits, deletedOldHabits, keptNewHabits };
}
