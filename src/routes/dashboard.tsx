import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/actions";
import { authClient } from "@/lib/authClient";
import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
    beforeLoad: ({ context,  }) => {
    // if (!context.) {
    //   throw new Error('Not authenticated')
    // }
    console.log(context);
    
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return <p>Hello</p>
    }

    throw error
  },
  loader: async () => {
    const user = await requireAuth();
    return user
  },
});

function RouteComponent() {
  const user = Route.useLoaderData()
  const router = useRouter();

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: "/auth/login" });
        },
      },
    });
  }

  if (!user) {
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
