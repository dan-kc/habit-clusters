import { useBrowserClient } from '~/root';

interface Props {}

const Header: React.FC<Props> = () => {
  const browserClient = useBrowserClient();
  const signOut = () => browserClient.auth.signOut();

  return (
    <header className="relative flex flex-row justify-end py-5">
      <h1 className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-xl font-medium">
        Habit <span className="font-bold">Clusters</span>
      </h1>
      <button onClick={() => signOut()} className="text-sm">
        Sign out
      </button>
    </header>
  );
};

export default Header;
