import { Transition } from "@headlessui/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useFetcher } from "@remix-run/react";
import { clsx } from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { Habit as HabitType } from "~/dataTypes";
import EditHabitInput from "./EditHabitInput";
import { v4 as uuidv4 } from "uuid";
import Input from "./Input";
import {
  Cross1Icon,
  DividerHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Button from "./Button";

interface Props {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  habits: HabitType[];
  open: boolean;
  isNew?: boolean;
}

const EditClusterDialog: React.FC<Props> = ({
  open,
  id,
  name,
  startTime,
  endTime,
  habits,
  isNew = false,
}) => {
  const [nameValue, setNameValue] = useState<string>(name);
  const [startTimeValue, setStartTimeValue] = useState<string>(startTime);
  const [endTimeValue, setEndTimeValue] = useState<string>(endTime);
  const [newHabits, setNewHabits] = useState<HabitType[]>([]);

  const handleAddHabit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setNewHabits([
      ...newHabits,
      {
        id: uuidv4(),
        name: "",
        is_complete: false,
        cluster_id: id,
      },
    ]);
  };

  useEffect(() => {
    if (open) {
      setNameValue(name);
      setStartTimeValue(startTime);
      setEndTimeValue(endTime);
      setNewHabits([]);
    }
  }, [open, name, startTime, endTime, habits]);

  const fetcher = useFetcher();

  return (
    <DialogPrimitive.Portal forceMount>
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
          <DialogPrimitive.Overlay
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
          <DialogPrimitive.Content
            forceMount
            className={clsx(
              "fixed z-50",
              "max-h-[70%] w-[95vw] max-w-md overflow-y-auto rounded-lg px-4 py-6 md:w-full",
              "top-[20%] left-[50%] -translate-x-[50%]",
              "bg-mauveDark-3",
              "focus:outline-none focus-visible:ring focus-visible:ring-mauveDark-6 focus-visible:ring-opacity-75"
            )}
          >
            <DialogPrimitive.Title className="text-xl font-semibold">
              {isNew ? (
                <>
                  Create <span className="text-violetDark-11">New Cluster</span>
                </>
              ) : (
                <>
                  Edit <span className="text-violetDark-11">Cluster</span>
                </>
              )}
            </DialogPrimitive.Title>
            <fetcher.Form method="post" className="space-y-6">
              <fieldset>
                <input type="hidden" name="cluster_id" value={id} />
                <input
                  type="hidden"
                  name="is_new"
                  value={isNew ? "true" : "false"}
                />
              </fieldset>

              <fieldset className="flex flex-col gap-2">
                <label htmlFor="cluster_name" className="text-mauveDark-11">
                  Name
                </label>
                <Input
                  name="cluster_name"
                  type="text"
                  value={nameValue}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setNameValue(e.currentTarget.value)
                  }
                />
              </fieldset>

              <fieldset className="flex flex-col gap-2">
                <label className="text-mauveDark-11"> Habits </label>
                {habits.map((habit) => {
                  const { id, name } = habit;
                  return (
                    <EditHabitInput key={id} initialValue={name} id={id} />
                  );
                })}
                {newHabits.map((habit) => {
                  const { id, name } = habit;
                  return (
                    <EditHabitInput
                      isNew
                      key={id}
                      initialValue={name}
                      id={id}
                    />
                  );
                })}

                <button
                  className="flex h-10 w-10 justify-center rounded-full bg-violetDark-3"
                  onClick={handleAddHabit}
                >
                  <PlusIcon className="h-5 w-5 self-center text-violetDark-11" />
                </button>
              </fieldset>
              <fieldset className="flex flex-col gap-2">
                <label className="text-mauveDark-11">
                  {" "}
                  Availibility window{" "}
                </label>
                <div className="flex gap-2">
                  <Input
                    name="start_time"
                    type="time"
                    max={endTimeValue}
                    value={startTimeValue}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      setStartTimeValue(e.currentTarget.value)
                    }
                  />
                  <DividerHorizontalIcon className="self-center text-mauveDark-6" />
                  <Input
                    name="end_time"
                    type="time"
                    min={startTimeValue}
                    value={endTimeValue}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      setEndTimeValue(e.currentTarget.value)
                    }
                  />
                </div>
              </fieldset>

              <div className="flex justify-between gap-2">
                <DialogPrimitive.Close asChild>
                  <Button
                    type="submit"
                    name="_action"
                    value="update_cluster"
                    className="w-full"
                  >
                    Save
                  </Button>
                </DialogPrimitive.Close>
                {isNew ? (
                  <DialogPrimitive.Close asChild>
                    <Button color="mauve" className="w-full">
                      Cancel
                    </Button>
                  </DialogPrimitive.Close>
                ) : (
                  <DialogPrimitive.Close asChild>
                    <Button
                      type="submit"
                      color="red"
                      name="_action"
                      value="delete_cluster"
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </DialogPrimitive.Close>
                )}
              </div>
            </fetcher.Form>
            <DialogPrimitive.Close
              className={clsx(
                "absolute top-6 right-3.5 inline-flex items-center justify-center rounded-full p-1",
                "focus:outline-none focus-visible:ring focus-visible:ring-violetDark-6 focus-visible:ring-opacity-75"
              )}
            >
              <Cross1Icon className="h-5 w-5 text-mauveDark-12" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </Transition.Child>
      </Transition.Root>
    </DialogPrimitive.Portal>
  );
};

export default EditClusterDialog;
