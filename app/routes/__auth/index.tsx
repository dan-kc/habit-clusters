import { LoaderArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import InputGroup from "@components/InputGroup";
import { useBrowserClient } from "~/root";
import { createServerClient, getServerSession } from "~/utils/server";
import AuthForm from "~/components/AuthForm";
import OAuthPanel from "~/components/OAuthPanel";

export const loader = async ({ request }: LoaderArgs) => {
  // Redirect if already logged in
  const { serverClient } = createServerClient(request);
  const session = await getServerSession(serverClient);
  if (session) throw redirect("/dashboard");
  return null;
};

const Index: React.FC = () => {
  const browserClient = useBrowserClient();

  const [emailValue, setEmailValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLogginIn] = useState<boolean>(false);

  const logIn = async (email: string, password: string) => {
    const response = await browserClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (response.error !== null) {
      setErrorMessage(response.error.message);
      setIsLogginIn(false);
      return;
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    setIsLogginIn(true);
    e.preventDefault();
    logIn(emailValue, passwordValue);
  };

  return (
    <>
      <AuthForm
        heading="Login"
        subheading="Enter your login details"
      >
        <fieldset className="flex flex-col">
          <InputGroup
            title="Email"
            name="email"
            type="email"
            required
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
            required
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
            "bg-mauveDark-3",
            "rounded-lg py-2 text-lg text-mauveDark-12 hover:bg-mauveDark-4"
          )}
          onClick={handleSubmit}
          data-cy="login"
        >
          {isLoggingIn ? "Loggin in" : "Log in"}
        </button>
        <p className="text-center text-sm text-mauveDark-11">
          <span>Don't have an account yet?</span>
          <Link
            to={"/signup"}
            className="p-2 text-center text-sm font-bold text-mauveDark-12 underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
        {errorMessage ? (
          <p data-cy="errorMessage">
            Oops! {errorMessage}. Have you confirmed your email yet?
          </p>
        ) : null}
      </AuthForm>
    </>
  );
};

export default Index;
