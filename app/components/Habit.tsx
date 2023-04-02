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
  const { state } = fetcher;
  const formData = fetcher.submission?.formData.get("is_complete");
  const isOptimisticallyComplete = getIsOptimallyComplete(formData, isComplete, state);
  //TODO: Remove cursor when cursor hovers over text

  return (
    <fetcher.Form
      method="post"
      className="space-y-1"
      data-cy="habit"
    >
      <input type="hidden" name="habit_id" value={habitId} />
      <input type="hidden" name="is_complete" value={isComplete.toString()} />
      <button
        type="submit"
        name="_action"
        value="toggle_is_complete"
        className={clsx(
          "flex flex-row gap-2",
          isOptimisticallyComplete ? "text-violetDark-11" : "text-mauveDark-12"
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

function getIsOptimallyComplete(
  actionData: FormDataEntryValue | null | undefined,
  isCompleteFromLoader: boolean,
  fetcherState: "idle" | "submitting" | "loading"
): boolean {
  let isOptimisticallyComplete: boolean;
  switch (fetcherState) {
    case "idle": {
      isOptimisticallyComplete = isCompleteFromLoader;
      break;
    }
    case "submitting": {
      isOptimisticallyComplete = actionData === "false";
      break;
    }
    case "loading": {
      isOptimisticallyComplete = actionData === "false";
      break;
    }
  }
  return isOptimisticallyComplete;
}
