import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Loader2 } from "lucide-react";
import { createAuthClient } from "better-auth/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const authClient = createAuthClient();
  const [loading, setLoading] = useState(false);
  //   // const { toast } = useToast();

  const githubSignin = async () => {
    setLoading(!loading);
    await authClient.signIn.social(
      {
        newUserCallbackURL: "/welcome",
        provider: "github",
        errorCallbackURL: "",
        callbackURL: "/dashboard",
      },
      {
        onError: (error) => {
          console.log("Login error: ", error);
          // display modal
        },
      }
    );
  };

  const googleSignin = async () => {
    setLoading(!loading);
    await authClient.signIn.social(
      {
        newUserCallbackURL: "/welcome",
        provider: "google",
        errorCallbackURL: "",
        callbackURL: "/dashboard",
      },
      {
        onError: (error) => {
          console.log("Login error: ", error);
          // display modal
        },
      }
    );
  };

  return (
    <div className="flex h-screen max-w-screen items-center justify-center overflow-hidden">
      <div className="h-full w-full md:w-1/2 flex flex-col space-y-6 item-center justify-center">
        <div className="flex flex-col justify-center items-center px-2">
          <h1 className="font-mono text-lg -mt-10">Synapse</h1>

          <p className="text-2xl font-medium mt-8">Welcome back!</p>
          <label className="text-neutral-500">
            Log in to reconnect with your friends and communities.
          </label>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            size={"lg"}
            className="w-2/3 cursor-pointer"
            variant={"outline"}
            onClick={googleSignin}
            disabled={loading}
          >
            Google
          </Button>
          <Button
            size={"lg"}
            className="w-2/3 cursor-pointer"
            variant={"outline"}
            onClick={githubSignin}
            disabled={loading}
          >
            GitHub
          </Button>
        </div>

        <div className="text-center text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="underline-offset-4 hover:underline text-neutral-700"
          >
            Sign up
          </Link>
        </div>
      </div>

      <div className="h-full w-full px-2 py-4 md:w-1/2 bg-neutral-100"></div>
    </div>
  );
}
