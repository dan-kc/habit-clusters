import { BoxIcon, CheckIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";

interface Props {
  name: string;
  habitId: string;
  isComplete: boolean;
}

const Habit: React.FC<Props> = ({ name, isComplete, habitId }) => {
  const fetcher = useFetcher();
  const data = fetcher.submission?.formData.get("is_complete");
  console.log(data)
  const isOptimisticallyComplete =
    (isComplete && data === undefined) ||
    (!isComplete && data === "false");

  return (
    <fetcher.Form method="post" className="space-y-1">
      <input type="hidden" name="habit_id" value={habitId} />
      <input
        type="hidden"
        name="is_complete"
        value={isComplete.toString()}
      />
      <button
        type="submit"
        name="_action"
        value="toggle_is_complete"
        className={clsx(
          "flex flex-row gap-2",
          isOptimisticallyComplete
            ? "text-violetDark-11"
            : "text-mauveDark-12"
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

export default Habit;
