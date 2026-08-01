import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  // Clear phone token cookie if it exists
  const cookieStore = await cookies();
  cookieStore.delete("wedding_phone_token");

  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  });
}
