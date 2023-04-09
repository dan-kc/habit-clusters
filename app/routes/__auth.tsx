import * as T from '@radix-ui/react-toast';
import { Outlet } from '@remix-run/react';
import Toast from '~/components/Toast';
import { useBrowserClient } from '~/root';

interface Props {}

const Auth: React.FC<Props> = () => {
  const browserClient = useBrowserClient();

  return (
    <section className="relative pt-20">
      <Outlet context={browserClient} />
      <T.Provider swipeDirection="right">
        <Toast />
      </T.Provider>
    </section>
  );
};

export default Auth;
