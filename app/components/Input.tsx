import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';

interface Props extends ComponentPropsWithoutRef<'input'> {}

const Input: React.FC<Props> = ({
  className,
  minLength = 1,
  maxLength = 26,
  ...rest
}) => {
  return (
    <input
      className={clsx(
        'rounded-md border border-mauveDark-6 bg-mauveDark-3 p-2 px-5',
        'placeholder:text-mauveDark-11',
        'focus:outline-none focus-visible:border-transparent focus-visible:ring focus-visible:ring-violetDark-6 focus-visible:ring-opacity-75',
        className
      )}
      minLength={minLength}
      maxLength={maxLength}
      {...rest}
    />
  );
};

export default Input;
