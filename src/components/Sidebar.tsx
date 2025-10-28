import { Brain, Settings } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "@tanstack/react-router";

export default function Sidebar() {
  const user = {
    name: "Ayomide Adebisi",
    email: "heyayomideadebisi@gmail.com",
    image: "https://avatars.githubusercontent.com/u/106715410?v=4",
    id: "vYvhndnKgeBFYyWgFOR4EZkNf2QVR305",
  };

  return (
    <div className="h-full bg-white w-[30%] shadow-sm flex flex-col">
      <div className="flex items-center p-3 text-lg font-bold font-mono gap-2">
        <Brain /> <p>Synapse</p>
      </div>
      <Separator className="" />

      <div className="flex-1">Middle</div>

      <div className="h-24 border">Middle</div>

      <div className="mt-auto py-2 px-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={user.image}
            alt={`${user.name} profile image`}
            className="h-10 w-10 rounded-full"
          />
          <p className="font-semibold font-mono">{user.name.split(" ")[0]}</p>
        </div>

        <div>
          <Link to="/">
            <Settings className="duration-500 hover:rotate-45 text-neutral-600 hover:text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
