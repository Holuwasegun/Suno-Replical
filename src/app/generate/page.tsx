import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GenerateForm } from "@/components/GenerateForm";

export default async function GeneratePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-8 text-2xl font-bold text-white">Generate a song</h1>
      <GenerateForm />
    </div>
  );
}
