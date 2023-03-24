import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { AuthError } from "@supabase/supabase-js";
import { z } from "zod";
import { createServerClient, getServerSession } from "~/utils/server";
import { useEffect, useRef } from "react";
import InputGroup from "@components/InputGroup";
import clsx from "clsx";
import useToastStore from "~/components/hooks/useToastStore";
import { getFormData } from "~/utils/database";

export const loader = async ({ request }: LoaderArgs) => {
  const { serverClient } = createServerClient(request);
  const session = await getServerSession(serverClient);

  if (session) throw redirect("/dashboard");
  return null;
};

export async function action({
  request,
}: ActionArgs): Promise<ValidationError | AuthError | null> {
  const formData = await getFormData(request);
  const formPayload = Object.fromEntries(formData);

  const parsedResult = schema.safeParse(formPayload);

  // VALIDATION ERROR
  if (!parsedResult.success) {
    return parsedResult.error.flatten().fieldErrors;
  }

  const { serverClient } = createServerClient(request);
  const { error } = await serverClient.auth.signUp({
    email: parsedResult.data.email,
    password: parsedResult.data.password,
  });
  // SUPABASE ERROR
  // NOTE: If a user already exists with the same email, this will not return an error.
  if (error) return error;

  return null;
}

const Index: React.FC = () => {
  // If null, then the user should have successfully recieved their confirmation email.
  const error = useActionData();
  const setOpen = useToastStore((state) => state.setOpen);
  const { state } = useNavigation();

  useEffect(() => {
    if (error === null && state === "idle") {
      setOpen(true);
    }
  }, [error, state]);

  const isSubmitting = state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <Form
        replace
        ref={formRef}
        method="post"
        className="mx-auto flex w-80 flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold"> Welcome </h1>
          <p className="text-sm text-grayDark-11">
            {" "}
            Enter your details to sign up - it's free!{" "}
          </p>
        </div>

        <fieldset className="flex flex-col" disabled={isSubmitting}>
          <InputGroup
            title="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            errorMessage={error?.email != null ? error.email[0] : null}
          />
          <InputGroup
            title="Password"
            name="password"
            type="password"
            minLength={6}
            placeholder="•••••••"
            errorMessage={error?.password != null ? error.password[0] : null}
          />
          <InputGroup
            title="Confirm password"
            name="confirm_password"
            type="password"
            minLength={6}
            placeholder="•••••••"
            errorMessage={
              error?.confirm_password != null ? error.confirm_password[0] : null
            }
          />
          <div className="flex gap-2">
            <input type="checkbox" required />
            <p className="text-sm text-grayDark-11">
              I have read and agree to the{" "}
              <Link to="/cookies" className="underline">
                Cookie policy
              </Link>
            </p>
          </div>
        </fieldset>

        <button
          type="submit"
          className={clsx(
            isSubmitting ? "bg-grayDark-4" : "bg-grayDark-3",
            "rounded-lg py-2 text-lg text-grayDark-12 hover:bg-grayDark-4"
          )}
        >
          {" "}
          {isSubmitting ? "Signing you up..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-grayDark-11">
          <span>Have an account alerady?</span>
          <Link
            to="/login"
            className="p-2 text-center text-sm font-bold text-grayDark-12 underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </Form>
      {error?.message ? <p>Oops! {error.message}</p> : null}
    </>
  );
};

export default Index;

interface ValidationError {
  email?: string[] | undefined;
  password?: string[] | undefined;
  confirm_password?: string[] | undefined;
}

const schema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be 6 or more characters" })
      .max(30, {
        message: "Password must be less than 30 characters",
      }),
    confirm_password: z.string(),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    path: ["confirm_password"],
    message: "Passwords must match",
  });
