import { Transition } from "@headlessui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import React, { Fragment, useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";

interface Props {}

const TermsOfServiceDialog: React.FC<Props> = ({}) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>terms of service</Dialog.Trigger>
      <Dialog.Portal forceMount>
        <Transition.Root show={open}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              forceMount
              className="fixed inset-0 z-20 bg-black/50"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Content
              forceMount
              className={clsx(
                "fixed z-50",
                "max-h-[70%] w-[95vw] max-w-md space-y-6 overflow-y-auto rounded-lg px-4 py-6 md:w-full",
                "top-[20%] left-[50%] -translate-x-[50%]",
                "bg-mauveDark-3",
                "focus:outline-none focus-visible:ring focus-visible:ring-mauveDark-6 focus-visible:ring-opacity-75"
              )}
            >
              <Dialog.Title className="text-xl font-semibold">
                We value your privacy
              </Dialog.Title>
              <div className="space-y-6">
                <p className="">
                  Habit Clusters only uses cookies for authentication.
                  <br />
                  Nothing else.
                </p>
              </div>
              <Dialog.Close
                className={clsx(
                  "absolute top-6 right-3.5 inline-flex items-center justify-center rounded-full p-1",
                  "focus:outline-none focus-visible:ring focus-visible:ring-violetDark-6 focus-visible:ring-opacity-75"
                )}
              >
                <Cross1Icon className="h-5 w-5 text-mauveDark-12" />
              </Dialog.Close>
            </Dialog.Content>
          </Transition.Child>
        </Transition.Root>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TermsOfServiceDialog;
