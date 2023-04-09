import { BoxIcon, CheckIcon } from '@radix-ui/react-icons';
import { useFetcher } from '@remix-run/react';
import clsx from 'clsx';
import { Habit as HabitType } from '~/utils/types';
import useCalendarStore from './hooks/useCalendarStore';

interface Props {
  habit: HabitType;
}

const HabitType: React.FC<Props> = ({ habit }) => {
  const date = useCalendarStore((state) => state.date);
  const fetcher = useFetcher();
  const { state } = fetcher;
  const { name, id, habit_dates_completed } = habit;
  const isComplete = habit_dates_completed.map((dateObj) => dateObj.date).includes(date);
  const formData = fetcher.submission?.formData.get('_action');
  const isOptimisticallyComplete = getIsOptimallyComplete(formData, isComplete, state);
  return (
    <fetcher.Form
      method="post"
      className="space-y-1"
      action="/api/handle-toggle-habit-completion"
      data-cy="habit"
    >
      <input type="hidden" name="habit_id" value={id} />
      <input type="hidden" name="date" value={date} />
      <button
        name="_action"
        value={isComplete ? 'toggle_completion_off' : 'toggle_completion_on'}
        type="submit"
        className={clsx(
          'flex flex-row gap-2',
          isOptimisticallyComplete ? 'text-violetDark-11' : 'text-mauveDark-12'
        )}
      >
        {isOptimisticallyComplete ? (
          <CheckIcon className="h-4 w-4 self-center" />
        ) : (
          <BoxIcon className="h-[0.9rem] w-[0.9rem] self-center" />
        )}
        {name}
      </button>
    </fetcher.Form>
  );
};

export default HabitType;

function getIsOptimallyComplete(
  fetcherData: FormDataEntryValue | null | undefined,
  isCompleteFromLoader: boolean,
  fetcherState: 'idle' | 'submitting' | 'loading'
): boolean {
  let isOptimisticallyComplete: boolean;
  switch (fetcherState) {
    case 'idle': {
      isOptimisticallyComplete = isCompleteFromLoader;
      break;
    }
    case 'submitting': {
      isOptimisticallyComplete = fetcherData === 'toggle_completion_on';
      break;
    }
    case 'loading': {
      isOptimisticallyComplete = fetcherData === 'toggle_completion_on';
      break;
    }
  }
  return isOptimisticallyComplete;
}
