import { CheckIcon, ChevronLeftIcon, Pencil2Icon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { useState } from 'react';
import { Cluster as ClusterType, Habit as HabitType } from '@utils/types';
import * as Dialog from '@radix-ui/react-dialog';
import ClusterDialog from '@components/ClusterDialog';
import Habit from './Habit';
import useCalendarStore from '@stores/useCalendarStore';

interface Props {
  cluster: ClusterType;
}

const Cluster: React.FC<Props> = ({ cluster }) => {
  const { id, name, start_time, end_time, habits } = cluster;
  const date = useCalendarStore((state) => state.date);
  const [open, setOpen] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const totalHabits = habits.length;
  const completedHabits = getNumberOfCompletedHabits(habits, date);
  const isCompleted = totalHabits === completedHabits;

  const startTimeInSeconds = parseTimeStringToSeconds(start_time);
  const endTimeInSeconds = parseTimeStringToSeconds(end_time);

  const timeWindow: TimeWindow = {
    start: startTimeInSeconds,
    end: endTimeInSeconds,
  };
  const currentTime = secondsSinceMidnight();

  const clusterAvailibility = getClusterAvailibility(currentTime, timeWindow);

  const active = clusterAvailibility.period === 'Within window';
  const inPast = isInPast(date);

  return (
    <article
      data-cy="cluster"
      className={clsx(
        'transform rounded-md border duration-300',
        active && isCompleted
          ? 'border-violetDark-6 bg-violetDark-3 text-violetDark-11 hover:bg-violetDark-4'
          : 'border-transparent bg-mauveDark-3 text-mauveDark-11 hover:bg-mauveDark-4'
      )}
    >
      <div className={clsx(!active && 'opacity-50')}>
        <div className={clsx('flex w-full flex-row justify-between')}>
          <div className="flex flex-row gap-2 pl-4">
            <h2 className="self-center text-xl font-semibold whitespace-nowrap">{name}</h2>
            {open ? (
              <Dialog.Root open={openSettings} onOpenChange={setOpenSettings}>
                <Dialog.Trigger asChild>
                  <button data-cy="edit_cluster">
                    <Pencil2Icon className="h-4 w-4 self-center" />
                  </button>
                </Dialog.Trigger>
                <ClusterDialog
                  id={id}
                  open={openSettings}
                  name={name}
                  startTime={removeSeconds(start_time)}
                  endTime={removeSeconds(end_time)}
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
              <ChevronLeftIcon className={clsx('h-6 w-6', open && '-rotate-90')} />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="px-6">
          {habits.map((habit) => {
            return <Habit habit={habit} key={habit.id} />;
          })}
          <p
            className="flex flex-row justify-end py-2 text-sm"
            data-cy="availability_window"
          >
            {
              inPast ?
                <>
                  &nbsp;
                </> :
                <>
                  Available between&nbsp;
                  <span className="text-violetDark-11">{removeSeconds(start_time)}</span>
                  &nbsp; and&nbsp;
                  <span className="text-violetDark-11">{removeSeconds(end_time)}</span>
                </>
            }
          </p>
        </div>
      )}
    </article>
  );
};

export default Cluster;

function getNumberOfCompletedHabits(habits: HabitType[], date: string): number {
  let completedHabits = 0;
  habits.map((habit) => {
    const { habit_dates_completed } = habit;
    habit_dates_completed.forEach(({ date: date_completed }) => {
      date_completed === date && completedHabits++;
    });
  });
  return completedHabits;
}

function isInPast(selectedDate: string): boolean {
  const currentDate = new Date()

  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const selectedDay = parseInt(selectedDate.slice(8, 10))
  const selectedMonth = parseInt(selectedDate.slice(5, 7))
  const selectedYear = parseInt(selectedDate.slice(0, 4))

  if (selectedYear < currentYear) return true
  if ((selectedYear === currentYear) && (selectedMonth < currentMonth)) return true
  if (((selectedYear === currentYear) && (selectedMonth === currentMonth) && (selectedDay < currentDay))) return true

  return false
}

function secondsSinceMidnight(): number {
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = today.getTime() - yesterday.getTime();
  const diffSeconds = Math.round(diff / 1000);
  return diffSeconds;
}

function parseTimeStringToSeconds(time: string): number {
  const splitTime = time.split(':');
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

type Period = 'Before window' | 'After window' | 'Within window';

function getClusterAvailibility(
  currentTime: number,
  timeWindow: TimeWindow
): ClusterAvailibility {
  if (currentTime < timeWindow.start) {
    return {
      period: 'Before window',
      timeUntilNextPeriod: timeWindow.start - currentTime,
    };
  }
  if (currentTime > timeWindow.end) {
    return {
      period: 'After window',
      timeUntilNextPeriod: 86400 - currentTime + timeWindow.start,
    };
  }
  return {
    period: 'Within window',
    timeUntilNextPeriod: timeWindow.end - currentTime,
  };
}

export function removeSeconds(time: string) {
  const splitTime = time.split(':');
  const hours = splitTime[0];
  const minutes = splitTime[1];
  return hours.concat(':', minutes);
}
