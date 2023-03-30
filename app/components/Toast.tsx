import * as T from "@radix-ui/react-toast";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import useToastStore from "@components/hooks/useToastStore";
import { Link } from "@remix-run/react";

export const Toast = () => {
  const open = useToastStore((state) => state.open);
  const setOpen = useToastStore((state) => state.setOpen);

  return (
    <>
      <AnimatePresence>
        {open ? (
          <T.Root
            asChild
            duration={2000000}
            open={open}
            onOpenChange={setOpen}
            key={1}
            forceMount
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="absolute bottom-0 right-0 rounded-lg border border-mauveDark-6 bg-mauveDark-3 p-4 shadow outline-none"
            >
              <div className="relative flex flex-col items-start gap-3">
                <T.Title>You have been sent a confirmation email!</T.Title>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-lg border border-mauveDark-6 bg-mauveDark-3 py-2 text-center text-lg text-mauveDark-12 hover:border-mauveDark-7 hover:bg-mauveDark-4"
                >
                  Log in
                </Link>
                <T.Close className="absolute top-0 right-0">
                  <Cross2Icon className="h-7 w-7" />
                </T.Close>
              </div>
            </motion.div>
          </T.Root>
        ) : null}
      </AnimatePresence>

      <T.Viewport className="fixed bottom-0 right-0 z-50 mr-10 mb-10 w-[260px] outline-none min-[356px]:w-[314px]" />
    </>
  );
};
export default Toast;
