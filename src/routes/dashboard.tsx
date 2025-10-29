import Sidebar from "@/components/Sidebar";
import {
  createFileRoute,
  ErrorComponentProps,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LucideFolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/actions";
import { authClient } from "@/lib/authClient";
import { ErrorProps } from "@/util/services";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: async () => {
    try {
      const user = await requireAuth();
      if (!user) redirect({ to: "/auth/login" });

      return user;
    } catch (error: any) {
      // console.log({ "Catch error": error });
      throw new Error(error);
    }
  },
  errorComponent: ({ error, reset }) => {
    if (error.message === "Not authenticated") {
      redirect({ to: "/auth/login" });
    }

    return <DasboardError error={error} reset={reset} />;
  },
});

function RouteComponent() {
  const user = Route.useLoaderData();

  return (
    <div className="flex w-full bg-neutral-100 h-screen">
      <Sidebar user={user} />

      <section className="border w-full">
        <Empty className="w-full">
          <LucideFolderOpen />
          <EmptyTitle>No Documents Yet</EmptyTitle>

          <h2 className="text-2xl font-mono font-semibold">
            Hi Ayomide. Ready to Dive Into Knowledge?
          </h2>

          <EmptyDescription>
            You haven&apos;t uploaded any projects yet. Get started by adding
            your first document.
          </EmptyDescription>
        </Empty>

        <div className="flex items-center justify-center cursor-pointer">
          <div className="shadow bg-white rounded my-3 p-6 w-96 text-center">
            <h2 className="font-mono font-semibold">Start with files</h2>
            <p>Upload, analyse and uncover key insights in your data</p>
          </div>
        </div>
      </section>
      {/* 
      NOTE: upload document
      - check size of document
      - free plan have a max no of documents
      - give an estimate on upload state
      */}
    </div>
  );
}

function DasboardError({ error, reset }: ErrorComponentProps) {
  return <ErrorComponent error={error} reset={reset} />;
}

function ErrorComponent({ error, reset }: ErrorProps) {
  const { data } = authClient.useSession();
  const router = useRouter();

  const message = error instanceof Error ? error.message : String(error);
  const ts = new Date().toISOString();
  const supportBody = encodeURIComponent(
    `Error: ${message}\nTime: ${ts}\nUser: ${data?.user.email ?? "unknown"}`
  );

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Log-out successful.");
          router.navigate({ to: "/auth/login" });
        },
        onError: () => {
          toast.error("Error while trying to log-out.");
        },
      },
    });
  }

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="max-w-xl w-full bg-white shadow rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>

        <p className="text-sm text-slate-600 mb-4">
          We couldn't load this part of the app. Try the options below.
        </p>

        <div className="bg-slate-50 p-3 rounded mb-4">
          <div className="text-sm font-mono wrap-break-words">
            <strong>Message:</strong> {message}
          </div>
          <div className="text-xs text-slate-500 mt-2">Time: {ts}</div>
        </div>

        <div className="flex gap-2">
          {reset && (
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => reset()}
              size={"lg"}
            >
              Log out
            </Button>
          )}

          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={logout}
            size={"lg"}
          >
            Retry
          </Button>

          <a
            href={`mailto:heyayomideadebisi@gmail.com?subject=App%20error%20report&body=${supportBody}`}
          >
            <Button variant={"link"} size={"lg"}>
              Contact support
            </Button>
          </a>
        </div>

        <ul className="mt-4 text-sm text-slate-600 space-y-1">
          <li>
            <strong>Quick checks:</strong> reload the page, check network, try
            another account.
          </li>
          <li>If the problem persists, contact support with the report.</li>
        </ul>
      </div>
    </div>
  );
}
