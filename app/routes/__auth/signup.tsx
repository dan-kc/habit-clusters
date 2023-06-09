import InputGroup from '@components/InputGroup';
import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useActionData, useNavigation } from '@remix-run/react';
import { useEffect } from 'react';
import { z } from 'zod';
import AuthForm from '@components/AuthForm';
import useToastStore from '@stores/useToastStore';
import { getFormData, getServerSession } from '@utils/supabase.server';
import { createServerClient } from '@utils/supabase.server';

export const loader = async ({ request }: LoaderArgs) => {

  const { serverClient, response } = createServerClient(request);

  // Redirect to dashboard if user is logged in
  const session = await getServerSession(serverClient);

  if (session) throw redirect('/dashboard');

  return json(
    {
      headers: response.headers,
    }
  );
};

export async function action({ request }: ActionArgs) {
  // Get and parse form data
  const formData = await getFormData(request);
  const formPayload = Object.fromEntries(formData);

  // Validate data
  const parsedValidationResults = schema.safeParse(formPayload);

  // Handle failed validation
  if (!parsedValidationResults.success) {
    console.log('validationError');
    return validationError(parsedValidationResults);
  } else {
    // Sign up
    const { serverClient } = createServerClient(request);
    const { error } = await serverClient.auth.signUp({
      email: parsedValidationResults.data.email,
      password: parsedValidationResults.data.password,
    });

    // Handle failed sign up
    // NOTE: If a user already exists with the same email, this will not return an error.
    if (error) {
      return json({ error: error?.message }, { status: 400 });
    }
  }
  // Successful sign up
  return null;
}

const Signup: React.FC = () => {
  const setOpen = useToastStore((state) => state.setOpen);
  const { state } = useNavigation();
  const isSubmitting = state === ('submitting' || 'loading');
  const errors = useActionData();

  useEffect(() => {
    if (errors === null && state === 'idle') {
      setOpen(true);
    }
  }, [errors, state, setOpen]);

  return (
    <>
      <AuthForm heading="Welcome" subheading="Enter your details to sign up - it's free!">
        <fieldset className="flex flex-col" disabled={isSubmitting}>
          <InputGroup
            title="Email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            errorMessage={errors ? errors.errors.email : null}
          />
          <InputGroup
            title="Password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="•••••••"
            errorMessage={errors ? errors.errors.password : null}
          />
          <InputGroup
            title="Confirm password"
            name="confirm_password"
            type="password"
            required
            minLength={6}
            placeholder="•••••••"
            errorMessage={errors ? errors.errors.confirm_password : null}
          />
          <div className="flex gap-2">
            <input type="checkbox" required />
            <p className="text-sm text-mauveDark-11">
              I have read and agree to the{' '}
              <Link to="/cookies" className="underline">
                Cookie policy
              </Link>
            </p>
          </div>
        </fieldset>
        <button
          type="submit"
          className="rounded-lg bg-mauveDark-3 py-2 text-lg text-mauveDark-12 hover:bg-mauveDark-4"
        >
          Sign up
        </button>
        <p className="text-center text-sm text-mauveDark-11">
          <span>Have an account alerady?</span>
          <Link
            to="/"
            className="p-2 text-center text-sm font-bold text-mauveDark-12 underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </AuthForm>
      <div>{errors?.message ? <p>Oops! {errors.message}</p> : null}</div>
    </>
  );
};

export default Signup;

interface ValidationError {
  email?: string[] | undefined;
  password?: string[] | undefined;
  confirm_password?: string[] | undefined;
}

const schema = z
  .object({
    email: z.string().email({
      message: 'Invalid email address',
    }),
    password: z
      .string()
      .min(6, {
        message: 'Password must be 6 or more characters',
      })
      .max(30, {
        message: 'Password must be less than 30 characters',
      }),
    confirm_password: z.string(),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords must match',
  });

function formatZodErrors(validationErrors: ValidationError) {
  return Object.keys(validationErrors).reduce(
    (acc, key) => {
      const val = validationErrors[key as keyof typeof acc];
      if (val !== undefined && val.length > 0) {
        acc[key as keyof typeof acc] = val[0];
      } else {
        acc[key as keyof typeof acc] = undefined;
      }
      return acc;
    },
    {} as {
      email?: string | undefined;
      password?: string | undefined;
      confirm_password?: string | undefined;
    }
  );
}

function validationError(
  parsedValidationResults: z.SafeParseError<{
    email: string;
    password: string;
    confirm_password: string;
  }>
) {
  const formErrors = parsedValidationResults.error.flatten().fieldErrors;
  const formattedErrors = formatZodErrors(formErrors);
  return json({ errors: formattedErrors }, { status: 400 });
}
