import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CalendarHeart, MapPin, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import AddGuestForm from "@/components/AddGuestForm";
import { cookies } from "next/headers";

import GuestList from "@/components/GuestList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  const cookieStore = await cookies();
  const phoneToken = cookieStore.get("wedding_phone_token")?.value;

  if (sessionError || (!session && !phoneToken)) {
    redirect("/login");
  }

  const token = session?.access_token || phoneToken;

  let res;
  let data;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/api/families/my-family`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    data = await res.json();
  } catch (e) {
    data = { error: "Failed to connect to the API. Check if NEXT_PUBLIC_API_URL is set in Vercel Environment Variables." };
    res = { ok: false };
  }

  if (!res.ok) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center container py-12 text-center">
        <h1 className="text-3xl font-serif mb-4">Error loading Dashboard</h1>
        <p className="text-muted-foreground mb-8">{data.error}</p>
      </div>
    );
  }

  const { family, guests } = data;

  return (
    <div className="flex-1 container max-w-4xl px-4 py-12 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          Welcome, {family.name}
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          We are overjoyed to invite you to our wedding celebration.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-2 space-y-8">
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-serif mb-6 flex items-center">
              <Users className="w-5 h-5 mr-3 text-primary" />
              Your Family Members
            </h2>
            
            <div className="mb-6">
              <GuestList initialGuests={guests} token={token as string} />
            </div>

            <AddGuestForm token={token as string} />

            {guests.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border/50">
                <Link href="/rsvp">
                  <div className="w-full sm:w-auto inline-flex items-center justify-center h-12 rounded-xl bg-primary px-8 text-primary-foreground font-medium transition-all hover:bg-primary/90 hover:scale-[1.02]">
                    Submit RSVPs
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-bl-full blur-xl -z-10" />
            <h3 className="font-serif text-xl mb-4 flex items-center text-secondary-foreground">
              <CalendarHeart className="w-5 h-5 mr-2 text-secondary" />
              When
            </h3>
            <p className="text-sm font-medium">Saturday, October 24, 2026</p>
            <p className="text-sm text-muted-foreground mb-4">4:00 PM - 11:00 PM</p>
            
            <h3 className="font-serif text-xl mb-4 mt-6 flex items-center text-secondary-foreground">
              <MapPin className="w-5 h-5 mr-2 text-secondary" />
              Where
            </h3>
            <p className="text-sm font-medium">The Grand Estate</p>
            <p className="text-sm text-muted-foreground">123 Wedding Lane<br/>Beautiful City, ST 12345</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
