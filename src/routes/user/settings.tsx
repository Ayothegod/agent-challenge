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
      <Sidebar />

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
                src={user.image}
                alt={`${user.image} image`}
                className="h-48 w-48 rounded-full"
              />
            </div>

            <div className="flex flex-col gap-8 mt-8">
              <div>
                <Label className="text-neutral-600">Username</Label>
                <p className="font-medium text-lg">{user.name.split(" ")[0]}</p>
              </div>
              <Separator className="" />
              <div>
                <Label className="text-neutral-600">Full Name</Label>
                <p className="font-medium text-lg">{user.name}</p>
              </div>
              <Separator className="" />
              <div>
                <Label className="text-neutral-600">Email</Label>
                <p className="font-medium text-lg">{user.email}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* Query ->
      -> answer
      -> provenance > list of chunk titles, source links, confidence score
      -> agent trace 
      
      [Ingestor] Extracted 12 pages
[Summarizer] Generating summary
[Indexer] Creating embeddings

Title: Your Knowledge, Amplified
Subtitle: Upload documents, connect data, and let Synapse agents turn them into living intelligence.
CTA button: ➕ Upload a document or 🔗 Connect a data source
Tooltip: Synapse agents automatically summarize, embed, and organize your knowledge — ready for instant search and reasoning.

Upload modal
Header: Drop files or paste links
Subtext: PDF, DOCX, TXT, MD — Synapse reads it all.
Processing message: Uploading… Agents are reading your file 👀
Success: Document uploaded! The Ingestion Agent will start analyzing shortly.

Agent Log Feed
Header: Agent Activity
Example feed copy:
🧩 IngestionAgent extracted 14 sections from “Company Strategy.pdf”
✍️ SummarizerAgent generated 4 structured summaries
🧠 IndexerAgent embedded 3,214 tokens into memory
💬 QueryAgent answered: “How does our Q3 plan align with growth targets?”
Empty state: No active agents. Upload or query to wake them up. ⚡

Query Interface
Placeholder: “Ask anything about your documents…”
Loading animation text:
Thinking across your entire knowledge base…
Found 3 relevant sources 🧩
Synthesizing final answer 🧠

Example answer structure:
Answer:
Your Q3 plan focuses on scaling the product to mid-market while maintaining user retention through feature parity and outreach.

Sources:
Company_Strategy.pdf (page 3)
GrowthOKRs.txt (section 2)

Empty state: No knowledge yet. Upload documents or add data sources to begin querying.

Analytics / Dashboard
Header: Intelligence Overview

Cards:
🔍 Queries processed: 128
📚 Documents indexed: 37
🤖 Agents active: 4
🕒 Last update: 2 mins ago

Subtext: Synapse continuously refines its understanding. The more you use it, the smarter it gets.


Agent Status Panel
Title: Agent System Health

States:
🟢 Active — Agent running smoothly
🟡 Warming up — Preparing task
🔴 Idle — Awaiting new jobs
⚫ Disabled — Not currently in use

Agent descriptions:
IngestionAgent: Extracts text and metadata from files.
SummarizerAgent: Compresses content into key points.
IndexerAgent: Embeds knowledge into searchable vectors.
QueryAgent: Retrieves and reasons across your data.


Toast Notifications
✅ Document uploaded successfully — Agents are analyzing now.
⚙️ Processing complete — Your document is now searchable.
⚠️ Agent offline — Retry or check the logs.
💬 Query failed — Try simplifying your question.
🧠 New insights available — Knowledge base updated!


Navbar / Branding
Dashboard
Documents
Agents
Analytics
Settings


Synapse — Distributed Knowledge for Teams that Think.

Add default/demo accounts or quick “Generate Demo Data” button.
Record a 1-min demo walkthrough to confirm flow feels tight.
*/}
    </div>
  );
}
