import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/authClient";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  const [loadGithub, setLoadGithub] = useState(false);
  const [loadGoogle, setLoadGoogle] = useState(false);

  const socialSignin = async (type: "github" | "google") => {
    if (isPending) return;
    if (error)
      return toast.error(
        "Error: unable to get session data, please refresh your browser."
      );
    if (session) {
      toast("You are already logged-in.");
      return router.navigate({ to: "/dashboard" });
    }

    if (type == "github") {
      setLoadGithub(true);

      await authClient.signIn.social(
        {
          newUserCallbackURL: "/welcome",
          provider: "github",
          callbackURL: "/dashboard",
        },
        {
          onError: () => {
            toast.error("Error: please try again.");
          },
          onSuccess: () => {
            toast.success("Login successful, redirecting to /dashboard.");
          },
        }
      );
    } else if (type == "google") {
      setLoadGoogle(true);

      await authClient.signIn.social(
        {
          newUserCallbackURL: "/welcome",
          provider: "google",
          callbackURL: "/dashboard",
        },
        {
          onError: (error) => {
            toast.error("Error: please try again.");
          },
          onSuccess: (data) => {
            toast.success("Login successful, redirecting to /dashboard.");
          },
        }
      );
    } else {
      toast.warning("Sign-in type not supported.");
    }
  };

  return (
    <div className="flex h-screen max-w-screen items-center justify-center overflow-hidden">
      <div className="h-full w-full md:w-1/2 flex flex-col space-y-6 item-center justify-center">
        <div className="flex flex-col justify-center items-center px-2">
          <h1 className="font-mono text-lg -mt-10">Synapse</h1>

          <p className="text-2xl font-medium mt-8">Welcome back!</p>
          <label className="text-neutral-500 text-center">
            Log in to reconnect with your friends and communities.
          </label>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            size={"lg"}
            className="w-2/3 cursor-pointer"
            variant={"outline"}
            onClick={() => socialSignin("google")}
            disabled={loadGoogle}
          >
            {loadGoogle ? (
              <div className="flex items-center gap-4 animate-pulse">
                <Loader2 className="animate-spin" /> Google
              </div>
            ) : (
              "Google"
            )}
          </Button>
          <Button
            size={"lg"}
            className="w-2/3 cursor-pointer"
            variant={"outline"}
            onClick={() => socialSignin("github")}
            disabled={loadGithub}
          >
            {loadGithub ? (
              <div className="flex items-center gap-4 animate-pulse">
                <Loader2 className="animate-spin" /> Github
              </div>
            ) : (
              "Github"
            )}
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
