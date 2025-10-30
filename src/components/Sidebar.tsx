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
import {
  Brain,
  Home,
  Layout,
  MessagesSquareIcon,
  Settings,
} from "lucide-react";
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

const route = [
  { title: "Dashboard", Icon: Home, url: "/dashboard" },
  { title: "New Chat", Icon: MessagesSquareIcon, url: "/" },
  { title: "Spaces", Icon: Layout, url: "/" },
];

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

  const chats = [
    { id: "jhhjsd-sf74kjj-sdsd", title: "History of jute" },
    { id: "alsao9-7843jjs-sdsd", title: "The uses of AI in this age" },
  ];

  return (
    <div className="hidden h-full bg-white sm:min-w-64 md:min-w-80 shadow-sm sm:flex flex-col">
      <div className="flex items-center p-3 text-lg font-bold font-mono gap-2">
        <Brain /> <p>Synapse</p>
      </div>
      <Separator className="" />

      <div className="flex-1 p-3">
        <div className="flex flex-col">
          {route.map((r) => (
            <Link
              key={r.title}
              activeProps={{
                className: "font-semibold text-neutral-900",
              }}
              to={`${r.url}`}
              className="hover:bg-neutral-100 py-2 cursor-pointer rounded-md flex text-neutral-600 items-center gap-3"
            >
              <r.Icon className="h-5 w-5" />
              <p>{r.title}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-sm font-mono text-neutral-600">Recent chats</p>
          {chats.length < 1 ? (
            <p className="font-medium my-2">No chats yet!</p>
          ) : (
            <div className="my-2 flex flex-col">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-2 mb-1 rounded-md hover:bg-neutral-100 text-neutral-600"
                >
                  {chat.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
