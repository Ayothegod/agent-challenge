import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/authClient";
import { Link, useRouter } from "@tanstack/react-router";
import { Brain, Settings } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";

type User = {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
  id: string;
};

export default function Sidebar({ user }: { user: User | undefined }) {
  const router = useRouter();

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
    <div className="hidden h-full bg-white sm:min-w-64 md:min-w-80 shadow-sm sm:flex flex-col">
      <div className="flex items-center p-3 text-lg font-bold font-mono gap-2">
        <Brain /> <p>Synapse</p>
      </div>
      <Separator className="" />

      <div className="flex-1">Middle</div>

      <div className="h-24 border mx-2 bg-neutral-100 rounded my-3">Bottom</div>

      <div className="mt-auto py-2 px-3 flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src={user?.image as string}
                alt={`${user?.name} profile image`}
                className="h-8 w-8 rounded-full"
              />
              <p className="font-semibold font-mono">
                {user?.name.split(" ")[0]}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80 p-3" align="start">
            <DropdownMenuGroup>
              <div className="flex items-center gap-3 cursor-pointer py-4">
                <img
                  src={user?.image as string}
                  alt={`${user?.name} profile image`}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex flex-col items-start">
                  <DropdownMenuLabel className="p-0 text-base">
                    {user?.name.split(" ")[0]}
                  </DropdownMenuLabel>
                  <p className="text-sm">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuGroup>

            <div className="border bg-neutral-100 rounded my-3 py-16">
              Bottom
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="text-base font-medium">
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base font-medium">
                Subscription
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <button
              className="text-red-600 text-sm px-2 py-1.5 rounded-md font-medium hover:bg-red-100 w-full text-left cursor-pointer"
              onClick={logout}
            >
              Log out
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <div>
          <Link to="/user/settings">
            <Settings className="duration-500 hover:rotate-45 text-neutral-600 hover:text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
