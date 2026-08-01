import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import { Lock } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    redirect("/login");
  }

  // Fetch all RSVPs from the Cloudflare Worker API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/api/families/all`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center container py-12 text-center">
        <Lock className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h1 className="text-3xl font-serif mb-4">Unauthorized</h1>
        <p className="text-muted-foreground mb-8">
          You must be an administrator to view this page. Please update your role in Supabase.
        </p>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-primary hover:underline">
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 container max-w-6xl px-4 py-12 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground font-light text-lg">
          Manage and export RSVPs for your wedding.
        </p>
      </div>

      <AdminPanel guests={data.guests} families={data.families} />
    </div>
  );
}
