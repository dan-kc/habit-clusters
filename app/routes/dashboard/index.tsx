import Header from '@components/Header';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Profile } from '@utils/types';
import Calendar from '~/components/Calendar';
import ClusterList from '~/components/ClusterList';
import ComingSoonPanel from '~/components/ComingSoonPanel';
import Container from '~/components/Container';
import { createServerClient, getUser, getUserData } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderArgs) => {
  const { serverClient } = createServerClient(request);

  const [, data] = await Promise.all([
    getUser(serverClient), // Redirects if not logged in
    getUserData(serverClient), // Throws if can't get data
  ]);
  const profile = data[0] as Profile;

  return json(profile);
};

const Dashboard: React.FC = () => {
  const profile = useLoaderData<typeof loader>();
  const { clusters } = profile;

  return (
    <Container>
      <Header />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-10">
        <Calendar />
        <ClusterList clusters={clusters} />
        <div className="space-y-2">
          {['Tracker', 'To-do list', 'Ban list'].map((panel) => (
            <ComingSoonPanel heading={panel} key={panel} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
