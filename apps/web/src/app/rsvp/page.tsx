import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RSVPForm from "@/components/RSVPForm";

export default async function RSVPPage() {
  const supabase = await createClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    redirect("/login");
  }

  // Fetch Family details from the Cloudflare Worker API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/api/families/my-family`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center container py-12 text-center">
        <h1 className="text-3xl font-serif mb-4">Family Not Found</h1>
        <p className="text-muted-foreground mb-8">
          It looks like you haven't been assigned to a family yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 container max-w-3xl px-4 py-12 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          RSVP
        </h1>
        <p className="text-muted-foreground font-light text-lg">
          Please respond for all members of the {data.family.name}.
        </p>
      </div>

      <RSVPForm guests={data.guests} token={session.access_token} />
    </div>
  );
}
