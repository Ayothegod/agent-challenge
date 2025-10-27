import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: async () => {},
});

function RouteComponent() {
  const router = useRouter();
  const {
    data: session,
    isPending,
    error: sessionError, //error object
    refetch, //refetch the session
  } = authClient.useSession();
  console.log(session, sessionError);

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: "/auth/login" });
        },
      },
    });
  }

  if (sessionError) {
    return <div>You dont have a session</div>;
  }

  return (
    <div>
      Hello "/dashboard"!
      <Button variant={"link"} onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
