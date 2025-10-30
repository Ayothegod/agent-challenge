import { NotFound } from "@/components/NotFound";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
  redirect,
} from "@tanstack/react-router";
import { Send } from "lucide-react";

export const Route = createFileRoute("/c/$chatId")({
  component: RouteComponent,
  loader: async ({ context, params: { chatId } }) => {
    try {
      // await context.queryClient.ensureQueryData(userQueryOptions(userId));
      const user = await requireAuth();
      if (!user) redirect({ to: "/auth/login" });

      return user;
    } catch (error: any) {
      // console.log({ "Catch error": error });
      throw new Error(error);
    }
  },
  errorComponent: UserErrorComponent,
  notFoundComponent: () => {
    return <NotFound>Chat not found</NotFound>;
  },
});

function UserErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

function RouteComponent() {
  const user = Route.useLoaderData();
  const params = Route.useParams();

  // const userQuery = useSuspenseQuery(userQueryOptions(params.userId))
  // const user = userQuery.data

  const sendQuery = async () => {};

  return (
    <div className="flex w-full bg-neutral-100 h-screen">
      <Sidebar user={user} />
      <div>
        Hello "/c/$id"!
        <p>Chat with ID: {params.chatId}</p>
      </div>

      <div className=" flex items-center justify-center px-8 sm:px-2">
        <div className="shadow-sm rounded-md p-3 w-full md:w-2/3 bg-white flex flex-col gap-2">
          <textarea
            name="enter-query"
            rows={3}
            className=" resize-none w-full border-none outline-none"
            placeholder="Enter your question..."
          ></textarea>

          <div className="ml-auto">
            <Button className="cursor-pointer" onClick={sendQuery}>
              <Send />{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
