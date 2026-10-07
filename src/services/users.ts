"use server";

import { createClient } from "@/utils/supabase/server";
import { verifyRateLimit } from "@/lib/ratelimit";

export async function getAllProfiles() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Check if current user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || !profile.is_active) {
    // Non-admin users may only read their own profile. Keep the ownership
    // predicate explicit even though RLS enforces the same boundary.
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", user.id);
    return profiles || [];
  }

  // Admin can see everything
  const { data: profiles } = await supabase.from("profiles").select("*");
  return profiles || [];
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return profile;
}

export async function updateProfile(updates: {
  full_name?: string;
  age?: number;
  birthday?: string;
  gender?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { success } = await verifyRateLimit(user.id, "profile-update");
  if (!success)
    throw new Error("Rate limit exceeded. Try again in 10 seconds.");

  const safeUpdates = {
    ...(typeof updates.full_name === "string"
      ? { full_name: updates.full_name }
      : {}),
    ...(typeof updates.age === "number" ? { age: updates.age } : {}),
    ...(typeof updates.birthday === "string"
      ? { birthday: updates.birthday }
      : {}),
    ...(typeof updates.gender === "string" ? { gender: updates.gender } : {}),
  };

  if (Object.keys(safeUpdates).length === 0) {
    throw new Error("No valid profile fields were provided");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(safeUpdates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
