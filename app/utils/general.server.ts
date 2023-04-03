export interface FormDataHabit {
  id: FormDataEntryValue;
  name: FormDataEntryValue;
  cluster_id: FormDataEntryValue;
  user_id: FormDataEntryValue;
}

export function formatHabitArray(
  arr1: FormDataEntryValue[],
  arr2: FormDataEntryValue[],
  cluster_id: FormDataEntryValue,
  user_id: FormDataEntryValue
): FormDataHabit[] {
  return arr1.map((entry, index) => {
    return {
      id: entry,
      name: arr2[index],
      cluster_id,
      user_id,
    };
  });
}

export function splitArrayByIsDeleted(
  habitArr: FormDataHabit[],
  isDeletedArr: FormDataEntryValue[]
): FormDataHabit[][] {
  let nonDeletedArr: FormDataHabit[] = [];
  let deletedArr: FormDataHabit[] = [];
  isDeletedArr.map((isDeleted, index) => {
    isDeleted === 'true'
      ? deletedArr.push(habitArr[index])
      : nonDeletedArr.push(habitArr[index]);
  });
  return [nonDeletedArr, deletedArr];
}

export function getHabits(
  formData: FormData,
  clusterId: FormDataEntryValue,
  userId: FormDataEntryValue
) {
  const oldHabitIds = formData.getAll('old_habit_id');
  const newHabitIds = formData.getAll('new_habit_id');
  const oldHabitNames = formData.getAll('old_habit_name');
  const newHabitNames = formData.getAll('new_habit_name');
  const oldHabits = formatHabitArray(oldHabitIds, oldHabitNames, clusterId, userId);
  const newHabits = formatHabitArray(newHabitIds, newHabitNames, clusterId, userId);
  return { oldHabits, newHabits };
}

export function splitHabits(
  formData: FormData,
  oldHabits: FormDataHabit[],
  newHabits: FormDataHabit[]
) {
  const isOldHabitDeleted = formData
    .getAll('is_habit_deleted')
    .slice(0, oldHabits.length);
  const isNewHabitDeleted = formData
    .getAll('is_habit_deleted')
    .slice(oldHabits.length, oldHabits.length + newHabits.length);
  const [keptOldHabits, deletedOldHabits] = splitArrayByIsDeleted(
    oldHabits,
    isOldHabitDeleted
  );
  const [keptNewHabits] = splitArrayByIsDeleted(newHabits, isNewHabitDeleted);
  return { keptOldHabits, deletedOldHabits, keptNewHabits };
}
