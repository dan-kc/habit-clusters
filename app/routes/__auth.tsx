import { ToastProvider } from "@radix-ui/react-toast";
import { Outlet } from "@remix-run/react";
import Toast from "~/components/Toast";
import { useBrowserClient } from "~/root";

interface Props {}

const Auth: React.FC<Props> = () => {
  const browserClient = useBrowserClient();
  return (
    <ToastProvider swipeDirection="right">
      <section className="relative pt-20">
        <Outlet context={browserClient} />
      </section>
      <Toast />
    </ToastProvider>
  );
};

export default Auth;
