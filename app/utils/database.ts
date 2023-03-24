import { SupabaseClient } from "@supabase/supabase-js";
import { FormDataHabit } from "~/routes/dashboard";

export async function getFormData(request: Request) {
  return await request.formData();
}
export async function toggleIsComplete(
  serverClient: SupabaseClient<any, "public", any>,
  isComplete: FormDataEntryValue,
  habitId: FormDataEntryValue,
  userId: FormDataEntryValue
) {
  var newToggleValue = isComplete !== "true";
  await serverClient
    .from("habits")
    .update({ is_complete: newToggleValue, user_id: userId })
    .eq("id", habitId);
}

export async function deleteCluster(
  serverClient: SupabaseClient<any, "public", any>,
  clusterId: FormDataEntryValue
) {
  await serverClient.from("clusters").delete().in("id", [clusterId]);
}

export async function createCluster(
  serverClient: SupabaseClient<any, "public", any>,
  userId: string,
  clusterId: FormDataEntryValue,
  clusterName: FormDataEntryValue,
  startTime: FormDataEntryValue,
  endTime: FormDataEntryValue
) {
  await serverClient.from("clusters").insert([
    {
      user_id: userId,
      id: clusterId,
      name: clusterName,
      start_time: startTime,
      end_time: endTime,
    },
  ]);
}

export async function editClusterInfo(
  serverClient: SupabaseClient<any, "public", any>,
  clusterId: FormDataEntryValue,
  clusterName: FormDataEntryValue,
  startTime: FormDataEntryValue,
  endTime: FormDataEntryValue
) {
  await serverClient
    .from("clusters")
    .update({
      name: clusterName,
      start_time: startTime,
      end_time: endTime,
    })
    .eq("id", clusterId);
}

export async function renameHabits(
  serverClient: SupabaseClient<any, "public", any>,
  habits: FormDataHabit[]
) {
  await serverClient.from("habits").upsert(habits);
}

export async function deleteHabits(
  serverClient: SupabaseClient<any, "public", any>,
  habits: FormDataHabit[]
) {
  await serverClient
    .from("habits")
    .delete()
    .in("id", [habits.map((habit) => habit.id)]);
}

export async function createHabits(
  serverClient: SupabaseClient<any, "public", any>,
  newHabits: FormDataHabit[]
) {
  await serverClient.from("habits").insert(newHabits);
}
