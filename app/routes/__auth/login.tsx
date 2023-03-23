import { LoaderArgs, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import clsx from "clsx";
import { useRef, useState } from "react";
import InputGroup from "@components/InputGroup";
import { useBrowserClient } from "~/root";
import { createServerClient } from "~/utils/server";

export const loader = async ({ request }: LoaderArgs) => {
  const { serverClient } = createServerClient(request);
  const {
    data: { session },
  } = await serverClient.auth.getSession();

  if (session) throw redirect("/dashboard");
  return null;
};

const LogInForm: React.FC = () => {
  const browserClient = useBrowserClient();

  const [emailValue, setEmailValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const [isLoggingIn, setIsLogginIn] = useState<boolean>(false);

  const logIn = async (email: string, password: string) => {
    const response = await browserClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setIsLogginIn(false);
    if (response.error !== null) {
      setErrorMessage(response.error.message);
      return;
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    setIsLogginIn(true);
    e.preventDefault();
    logIn(emailValue, passwordValue);
  };

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <Form
        ref={formRef}
        method="post"
        className="mx-auto flex w-80 flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Login</h1>
          <p className="text-sm text-grayDark-11">
            Enter your login details
          </p>
        </div>

        <fieldset className="flex flex-col">
          <InputGroup
            title="Email"
            name="email"
            type="email"
            disabled={isLoggingIn}
            placeholder="Enter your email"
            value={emailValue}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setEmailValue(e.currentTarget.value)
            }
          />
          <InputGroup
            title="Password"
            name="password"
            type="password"
            minLength={6}
            disabled={isLoggingIn}
            placeholder="•••••••"
            value={passwordValue}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setPasswordValue(e.currentTarget.value)
            }
          />
        </fieldset>

        <button
          className={clsx(
            "bg-grayDark-3",
            "rounded-lg py-2 text-lg text-grayDark-12 hover:bg-grayDark-4"
          )}
          onClick={handleSubmit}
          data-cy="login"
        >
          {isLoggingIn ? "Loggin in" : "Log in"}
        </button>

        <p className="text-center text-sm text-grayDark-11">
          <span>Don't have an account yet?</span>
          <Link
            to={"/"}
            className="p-2 text-center text-sm font-bold text-grayDark-12 underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
        {errorMessage ? (
          <p className="" data-cy="errorMessage">
            Oops! {errorMessage}. Have you confirmed your email yet?
          </p>
        ) : null}
      </Form>
    </>
  );
};

export default LogInForm;
