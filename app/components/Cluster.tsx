import { CheckIcon, ChevronLeftIcon, Pencil2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useState } from "react";
import { Habit as HabitType } from "@utils/types";
import * as Dialog from "@radix-ui/react-dialog";
import EditClusterDialog from "./EditClusterDialog";
import Habit from "./Habit";

interface Props {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  habits: HabitType[];
}

const Cluster: React.FC<Props> = ({ id, name, startTime, endTime, habits }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const totalHabits = habits.length;
  const completedHabits = getNumberOfCompletedHabits(habits);
  const isCompleted = totalHabits === completedHabits;

  const startTimeInSeconds = parseTimeStringToSeconds(startTime);
  const endTimeInSeconds = parseTimeStringToSeconds(endTime);

  const timeWindow: TimeWindow = {
    start: startTimeInSeconds,
    end: endTimeInSeconds,
  };
  const currentTime = secondsSinceMidnight();

  const clusterAvailibility = getClusterAvailibility(currentTime, timeWindow);

  const active = clusterAvailibility.period === "Within window";

  return (
    <article
      data-cy="cluster"
      className={clsx(
        "transform rounded-md border duration-300",
        active && isCompleted
          ? "border-violetDark-6 bg-violetDark-3 text-violetDark-11 hover:bg-violetDark-4"
          : "border-transparent bg-mauveDark-3 text-mauveDark-11 hover:bg-mauveDark-4"
      )}
    >
      <div className={clsx(!active && "opacity-50")}>
        <div className={clsx("flex w-full flex-row justify-between")}>
          <div className="flex flex-row gap-2 pl-4">
            <h2 className="self-center text-xl font-semibold">{name}</h2>
            {open ? (
              <Dialog.Root open={openSettings} onOpenChange={setOpenSettings}>
                <Dialog.Trigger asChild>
                  <button
                    data-cy="edit_cluster"
                  >
                    <Pencil2Icon className="h-4 w-4 self-center" />
                  </button>
                </Dialog.Trigger>
                <EditClusterDialog
                  id={id}
                  open={openSettings}
                  name={name}
                  startTime={removeSeconds(startTime)}
                  endTime={removeSeconds(endTime)}
                  habits={habits}
                />
              </Dialog.Root>
            ) : null}
          </div>
          <button
            data-cy="open_cluster"
            className="relative w-full pt-6 pb-5 pr-4"
            onClick={() => setOpen((state) => !state)}
          >
            <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-1 align-middle">
              {active ? (
                isCompleted ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <p className="self-center text-sm">
                    {completedHabits}/{totalHabits}
                  </p>
                )
              ) : (
                <p className="self-center text-sm">Unavailable</p>
              )}
              <ChevronLeftIcon
                className={clsx("h-6 w-6", open && "-rotate-90")}
              />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="px-6">
          {habits.map((habit) => {
            const { name, id, is_complete: isHabitComplete, dates_completed } = habit;
            return (
              <Habit
                name={name}
                isComplete={isHabitComplete ?? false}
                habitId={id}
                datesCompleted={dates_completed}
                key={id}
              />
            );
          })}
          <p className="flex flex-row justify-end py-2 text-sm"
            data-cy="availability_window"
          >
            Available between&nbsp;
            <span className="text-violetDark-11">
              {removeSeconds(startTime)}
            </span>
            &nbsp; and&nbsp;
            <span className="text-violetDark-11">{removeSeconds(endTime)}</span>
          </p>
        </div>
      )}
    </article>
  );
};

export default Cluster;

function getNumberOfCompletedHabits(habits: HabitType[]): number {
  let completedHabits = 0;
  habits.map((habit) => {
    const { is_complete } = habit;
    is_complete && completedHabits++;
  });
  return completedHabits;
}

function secondsSinceMidnight(): number {
  const today = new Date();
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const diff = today.getTime() - yesterday.getTime();
  const diffSeconds = Math.round(diff / 1000);
  return diffSeconds;
}

function parseTimeStringToSeconds(time: string): number {
  const splitTime = time.split(":");
  const hoursInSeconds = Number(splitTime[0]) * 60 * 60;
  const minutesInSeconds = Number(splitTime[1]) * 60;
  const seconds = Number(splitTime[2]);
  return hoursInSeconds + minutesInSeconds + seconds;
}

interface TimeWindow {
  start: number;
  end: number;
}

interface ClusterAvailibility {
  period: Period;
  timeUntilNextPeriod: number;
}

type Period = "Before window" | "After window" | "Within window";

function getClusterAvailibility(
  currentTime: number,
  timeWindow: TimeWindow
): ClusterAvailibility {
  if (currentTime < timeWindow.start) {
    return {
      period: "Before window",
      timeUntilNextPeriod: timeWindow.start - currentTime,
    };
  }
  if (currentTime > timeWindow.end) {
    return {
      period: "After window",
      timeUntilNextPeriod: 86400 - currentTime + timeWindow.start,
    };
  }
  return {
    period: "Within window",
    timeUntilNextPeriod: timeWindow.end - currentTime,
  };
}

export function removeSeconds(time: string) {
  const splitTime = time.split(":");
  const hours = splitTime[0];
  const minutes = splitTime[1];
  return hours.concat(":", minutes);
}
