import Sidebar from "@/components/Sidebar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { requireAuth } from "@/lib/actions";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/user/settings")({
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
  // errorComponent: ({ error, reset }) => {
  //   if (error.message === "Not authenticated") {
  //     redirect({ to: "/auth/login" });
  //   }

  //   return <DasboardError error={error} reset={reset} />;
  // },
});

function RouteComponent() {
  const user = Route.useLoaderData();

  return (
    <div className="flex w-full bg-neutral-100 h-screen">
      <Sidebar user={user} />

      <div className="p-3 h-max w-max">
        <Link to="/dashboard" className="">
          <div className="flex font-medium">
            <ChevronLeft />
            Back
          </div>
        </Link>
      </div>

      <div className="w-full flex items-start justify-center mt-24 px-8">
        <div className="w-full sm:w-2/3 md:w-[640px]">
          <div className="space-y-2">
            <h1 className="font-semibold text-xl">Account Settings</h1>
            <p className="text-neutral-600">Manage your account information</p>
          </div>

          <section className="bg-white mt-8 rounded-md shadow-sm px-6 py-10">
            <div className="flex items-center justify-center">
              <img
                src={user?.image as string}
                alt={`${user?.image} image`}
                className="h-48 w-48 rounded-full"
              />
            </div>

            <div className="flex flex-col gap-8 mt-8">
              <div>
                <Label className="text-neutral-600">Username</Label>
                <p className="font-medium text-lg">
                  {user?.name.split(" ")[0]}
                </p>
              </div>
              <Separator className="" />
              <div>
                <Label className="text-neutral-600">Full Name</Label>
                <p className="font-medium text-lg">{user?.name}</p>
              </div>
              <Separator className="" />
              <div>
                <Label className="text-neutral-600">Email</Label>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
