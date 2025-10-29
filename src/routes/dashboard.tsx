import Sidebar from "@/components/Sidebar";
import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: () => {},
});

function RouteComponent() {
  // const router = useRouter();

  return (
    <div className="flex w-full bg-neutral-100 h-screen">
      <Sidebar />

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
