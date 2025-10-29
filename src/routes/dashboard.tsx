import Sidebar from "@/components/Sidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: () => {},
});

function RouteComponent() {
  // const router = useRouter();

  return (
    <div className="flex w-full bg-neutral-100 h-screen">
      <Sidebar />
    </div>
  );
}
