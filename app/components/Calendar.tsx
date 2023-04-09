import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import useCalendarStore from './hooks/useCalendarStore';

const Calendar: React.FC = () => {
  return (
    <>
      <MonthPicker />
      <DayPicker />
    </>
  );
};

export default Calendar;

const MonthPicker: React.FC = () => {
  const date = useCalendarStore((state) => state.date);
  const setDate = useCalendarStore((state) => state.setDate);
  const monthName = getMonthName(date);
  const year = date.slice(0, 4);
  const firstDateOfPrevMonth = getFirstDayOfRelativeMonth(date, -1);
  const firstDateOfNextMonth = getFirstDayOfRelativeMonth(date, 1);
  return (
    <div className="mx-4 flex items-center justify-between mb-4">
      <button
        className="rounded-full p-2 hover:bg-mauveDark-3"
        aria-label='go-to-prev-month'
        onClick={() => setDate(firstDateOfPrevMonth)}
      >
        <ChevronLeftIcon className="h-4 w-4 text-mauveDark-11" />
      </button>
      <h2 className="text-lg">
        {monthName}
        &nbsp;
        {year}
      </h2>
      <button
        className="rounded-full p-2 hover:bg-mauveDark-3"
        aria-label='go-to-next-month'
        onClick={() => setDate(firstDateOfNextMonth)}
      >
        <ChevronRightIcon className="h-4 w-4 text-mauveDark-11" />
      </button>
    </div>
  );
};

const DayPicker: React.FC = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const selectedDate = useCalendarStore((state) => state.date);
  const setSelectedDate = useCalendarStore((state) => state.setDate);

  const firstDateOfPrevMonth = getFirstDayOfRelativeMonth(selectedDate, -1);
  const firstDateOfNextMonth = getFirstDayOfRelativeMonth(selectedDate, 1);

  const prevMonthArray = generateDateArray(firstDateOfPrevMonth);
  const selectedMonthArray = generateDateArray(selectedDate);
  const nextMonthArray = generateDateArray(firstDateOfNextMonth);

  const shortenedPrevMonthArray = prevMonthArray.slice(
    prevMonthArray.length - getDayOfWeek(getFirstDayOfRelativeMonth(selectedDate, 0)),
    prevMonthArray.length
  );
  const nextMonthArrayLength =
    42 - selectedMonthArray.length - shortenedPrevMonthArray.length;
  const shortenedNextMonthArray = nextMonthArray.slice(0, nextMonthArrayLength);

  const combinedMonthsArray = [
    shortenedPrevMonthArray,
    selectedMonthArray,
    shortenedNextMonthArray,
  ];

  return (
    <div className="grid grid-cols-7 justify-items-center gap-2">
      <DayLegend />
      {combinedMonthsArray.map((month, index) => {
        const isSelectedMonth = index === 1;
        return month.map((day) => {
          const isMatchingDay = selectedDate === day;
          const isCurrentDay = currentDate === day;
          return (
            <button
              onClick={() => setSelectedDate(day)}
              data-cy={isMatchingDay && isSelectedMonth ? "selected" : "notSelected"}
              key={day}
              className={clsx(
                'flex aspect-square w-10 items-center justify-center rounded-full border text-sm sm:w-14 sm:text-lg md:w-12 lg:w-14',
                isSelectedMonth &&
                isMatchingDay &&
                'border-mauveDark-6 bg-mauveDark-4 text-mauveDark-12',
                isSelectedMonth &&
                !isMatchingDay &&
                'border-transparent bg-mauveDark-3 text-mauveDark-11 hover:bg-mauveDark-4 hover:text-mauveDark-12',
                !isSelectedMonth &&
                'border-transparent bg-mauveDark-1 text-mauveDark-11 opacity-30 hover:bg-mauveDark-2 hover:text-mauveDark-12 hover:opacity-40',
                isCurrentDay &&
                'border-orangeDark-6 bg-orangeDark-3 text-orangeDark-11 hover:border-orangeDark-7 hover:bg-orangeDark-4'
              )}
            >
              {parseInt(day.slice(8, 10))}
            </button>
          );
        });
      })}
    </div>
  );
};

const DayLegend: React.FC = () => {
  return (
    <>
      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => {
        return (
          <p
            className={clsx(
              'text-sm',
              index === 0 || index === 6 ? 'text-orange-11' : 'text-mauveDark-11'
            )}
            key={day}
          >
            {day}
          </p>
        );
      })}
    </>
  );
};

export function getMonthName(date: string): string {
  const month = parseInt(date.slice(5, 7));
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month - 1];
}

function generateDateArray(date: string): Array<string> {
  const [year, month] = date.split('-').map(Number);
  const numberOfDaysInMonth = new Date(year, month, 0).getDate(); // Month index starts at 0
  const monthArray = [];
  for (let i = 1; i <= numberOfDaysInMonth; i++) {
    monthArray.push(`${padNumber(year)}-${padNumber(month)}-${padNumber(i)}`);
  }
  return monthArray;
}

function getFirstDayOfRelativeMonth(date: string, relativeMonth: number): string {
  const [year, month] = date.split('-').map(Number);
  const firstDateOfRelativeMonth = new Date(year, month + relativeMonth - 1, 1);
  const newYear = padNumber(firstDateOfRelativeMonth.getFullYear());
  const newMonth = padNumber(firstDateOfRelativeMonth.getMonth() + 1);
  const newDay = padNumber(firstDateOfRelativeMonth.getDate());
  return `${newYear}-${newMonth}-${newDay}`;
}

function getDayOfWeek(date: string): number {
  const newDate = new Date(date);
  return newDate.getDay();
}

export function padNumber(num: number): string {
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
}
