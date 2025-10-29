import Sidebar from "@/components/Sidebar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/user/settings")({
  component: RouteComponent,
  // beforeLoad: ({ context }) => {
  //   // if (!context.) {
  //   //   throw new Error('Not authenticated')
  //   // }
  // },
  // errorComponent: ({ error }) => {
  //   if (error.message === "Not authenticated") {
  //     return <login/>
  //   }
});

function RouteComponent() {
  const user = {
    name: "Ayomide Adebisi",
    email: "heyayomideadebisi@gmail.com",
    image: "https://avatars.githubusercontent.com/u/106715410?v=4",
    id: "vYvhndnKgeBFYyWgFOR4EZkNf2QVR305",
  };

  return (
    <div className="flex w-full bg-neutral-100 h-screen">
      <Sidebar/>

      <div className="p-3 h-max w-max">
        <Link to="/dashboard" className="">
          <div className="flex font-medium">
            <ChevronLeft />
            Back
          </div>
        </Link>
      </div>

      <div className="w-full flex items-start justify-center mt-24 px-8">
        <div className="w-full sm:w-2/3">
          <div className="space-y-2">
            <h1 className="font-semibold text-xl">Account Settings</h1>
            <p className="text-neutral-600">Manage your account information</p>
          </div>

          <section className="bg-white mt-8 rounded-md shadow-sm px-6 py-10">
            <div className="flex items-center justify-center">
              <img
                src={user.image}
                alt={`${user.image} image`}
                className="h-48 w-48 rounded-full"
              />
            </div>

            <div className="flex flex-col gap-8 mt-8">
              <div>
                <Label className="text-neutral-600">
                  Username
                </Label>
                <p className="font-medium text-lg">{user.name.split(" ")[0]}</p>
              </div>
              <Separator className="" />
              <div>
                <Label className="text-neutral-600">
                  Full Name
                </Label>
                <p className="font-medium text-lg">{user.name}</p>
              </div>
              <Separator className="" />
              <div>
                <Label className="text-neutral-600">
                  Email
                </Label>
                <p className="font-medium text-lg">{user.email}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
