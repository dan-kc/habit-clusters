import { TrashIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useState } from "react";
import Input from "./Input";

interface Props {
  id: string;
  initialValue: string;
  isNew?: boolean;
}

const EditHabitInput: React.FC<Props> = ({
  id,
  initialValue,
  isNew = false,
}) => {
  const [nameValue, setNameValue] = useState<string>(initialValue);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  function handleDeleteButtonClick(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsDeleted((state) => !state);
  }

  return (
    <div className={clsx("relative", isDeleted && "hidden")}>
      <input
        type="hidden"
        name={isNew ? "new_habit_id" : "old_habit_id"}
        value={id}
      />
      <input
        type="hidden"
        name="is_habit_deleted"
        value={isDeleted.toString()}
      />
      <Input
        name={isNew ? "new_habit_name" : "old_habit_name"}
        className="w-full"
        type={isDeleted ? "hidden" : "text"}
        value={nameValue}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setNameValue(e.currentTarget.value)
        }
      />
      {!isDeleted && (
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2"
          data-cy="delete_habit"
          onClick={handleDeleteButtonClick}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default EditHabitInput;
