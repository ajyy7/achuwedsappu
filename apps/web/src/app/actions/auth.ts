"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import * as jose from "jose";
import { redirect } from "next/navigation";

// Initialize Supabase Service Role client to bypass RLS during login/signup
const getSupabaseAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export async function loginWithPhone(phoneNumber: string) {
  // Enforce 10 digits
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    return { error: "Please enter a valid 10-digit phone number." };
  }

  try {
    const supabase = getSupabaseAdmin();

    // 1. Check if profile exists
    let { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("phone", cleanPhone)
      .single();

    // 2. Auto-create if doesn't exist
    if (!profile) {
      const newUserId = crypto.randomUUID();
      
      const { data: newFamily, error: famErr } = await supabase
        .from("families")
        .insert({
          name: "Our Honored Guests", // Generic name, updated when they add their first guest
        })
        .select()
        .single();

      if (famErr) throw famErr;

      const { data: newProfile, error: profErr } = await supabase
        .from("profiles")
        .insert({
          id: newUserId,
          phone: cleanPhone,
          family_id: newFamily.id,
          role: "GUEST",
        })
        .select()
        .single();

      if (profErr) throw profErr;

      profile = newProfile;
    }

    // 3. Forge a valid Supabase JWT
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    
    const token = await new jose.SignJWT({
      role: "authenticated",
      aud: "authenticated",
      sub: profile.id,
      phone: cleanPhone,
      email: profile.email || "",
      app_metadata: { provider: "phone" },
      user_metadata: {},
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    // 4. Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("wedding_phone_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

  } catch (error: any) {
    console.error("Phone login error:", error);
    return { error: error.message || "Failed to log in. Please try again." };
  }

  // 5. Redirect on success
  redirect("/dashboard");
}
