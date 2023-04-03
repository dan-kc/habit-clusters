import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';

interface Props extends ComponentPropsWithoutRef<'input'> {
  title?: string | undefined;
  errorMessage?: string | null;
}

const InputGroup: React.FC<Props> = ({
  name,
  title = undefined,
  errorMessage = null,
  minLength = 6,
  maxLength = 30,
  ...rest
}) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        {title ? (
          <label htmlFor={name} className="font-semibold">
            {title}
          </label>
        ) : null}
        <input
          className={clsx(
            errorMessage ? 'border-redDark-6' : 'border-mauveDark-6',
            'rounded-lg border bg-mauveDark-1 p-2 px-5 text-sm placeholder:text-mauveDark-11 focus:outline-none focus-visible:border-transparent focus-visible:ring focus-visible:ring-violetDark-6 focus-visible:ring-opacity-75'
          )}
          name={name}
          minLength={minLength}
          maxLength={maxLength}
          {...rest}
        />
        <p className={clsx(errorMessage ? 'text-redDark-11' : '', 'text-xs')}>
          {errorMessage ? errorMessage : <br />}
        </p>
      </div>
    </>
  );
};

export default InputGroup;
