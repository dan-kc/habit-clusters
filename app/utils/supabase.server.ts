import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient as _createServerClient } from '@supabase/auth-helpers-remix';

import { redirect } from '@remix-run/node';
import type { FormDataHabit } from './general.server';
import { Database } from 'supabase-types';
export const createServerClient = (request: Request) => {
  const response = new Response();
  const serverClient = _createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  return { serverClient, response };
};

export async function getServerSession(serverClient: SupabaseClient<any, 'public', any>) {
  const {
    data: { session },
  } = await serverClient.auth.getSession();
  return session;
}

export async function getUser(serverClient: SupabaseClient<any, 'public', any>) {
  const {
    data: { user },
    error,
  } = await serverClient.auth.getUser();
  if (error) throw redirect('/');
  return user;
}
export async function getFormData(request: Request) {
  return await request.formData();
}
export async function deleteCluster(
  serverClient: SupabaseClient<any, 'public', any>,
  clusterId: FormDataEntryValue
) {
  await serverClient.from('clusters').delete().in('id', [clusterId]);
}

export async function createCluster(
  serverClient: SupabaseClient<any, 'public', any>,
  userId: string,
  clusterId: FormDataEntryValue,
  clusterName: FormDataEntryValue,
  startTime: FormDataEntryValue,
  endTime: FormDataEntryValue
) {
  await serverClient.from('clusters').insert([
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
  serverClient: SupabaseClient<any, 'public', any>,
  clusterId: FormDataEntryValue,
  clusterName: FormDataEntryValue,
  startTime: FormDataEntryValue,
  endTime: FormDataEntryValue
) {
  await serverClient
    .from('clusters')
    .update({
      name: clusterName,
      start_time: startTime,
      end_time: endTime,
    })
    .eq('id', clusterId);
}

export async function renameHabits(
  serverClient: SupabaseClient<any, 'public', any>,
  habits: FormDataHabit[]
) {
  await serverClient.from('habits').upsert(habits);
}

export async function deleteHabits(
  serverClient: SupabaseClient<any, 'public', any>,
  habits: FormDataHabit[]
) {
  await serverClient
    .from('habits')
    .delete()
    .in('id', [habits.map((habit) => habit.id)]);
}

export async function createHabits(
  serverClient: SupabaseClient<any, 'public', any>,
  newHabits: FormDataHabit[]
) {
  const { error } = await serverClient.from('habits').insert(newHabits);
  return error;
}

export async function getUserData(serverClient: SupabaseClient<any, 'public', any>) {
  const { data, error } = await serverClient
    .from('profiles')
    .select(
      `
        name,
        premium,
        clusters (
            id,
            name,
            start_time,
            end_time,
            habits (
                id,
                name,
                habit_dates_completed (
                    date
                )
            )
        )
        `
    )
    .order('created_at', {
      foreignTable: 'clusters',
    })
    .order('name', { foreignTable: 'clusters' })
    .order('created_at', {
      foreignTable: 'clusters.habits',
    })
    .order('name', {
      foreignTable: 'clusters.habits',
    });

  if (error) throw error;

  return data;
}
