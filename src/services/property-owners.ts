"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  propertyOwnerSchema,
  type PropertyOwnerFormValues,
} from "@/lib/validation/property-owner";

async function getOrganizationContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Sign in to manage property owners.");
  }

  const { data: organization, error } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error("Could not find your organization.");
  if (!organization) {
    throw new Error("Your account does not have an organization yet.");
  }

  return { supabase, organizationId: organization.id };
}

export async function listPropertyOwners(includeArchived = false) {
  const { supabase, organizationId } = await getOrganizationContext();
  let query = supabase
    .from("property_owners")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name", { ascending: true });

  if (!includeArchived) query = query.is("archived_at", null);

  const { data, error } = await query;
  if (error) throw new Error("Could not load property owners.");
  return data;
}

export async function createPropertyOwner(input: PropertyOwnerFormValues) {
  const values = propertyOwnerSchema.parse(input);
  const { supabase, organizationId } = await getOrganizationContext();
  const { data, error } = await supabase
    .from("property_owners")
    .insert({ ...values, organization_id: organizationId })
    .select("*")
    .single();

  if (error) throw new Error("Could not create this property owner.");
  revalidatePath("/dashboard");
  return data;
}

export async function updatePropertyOwner(
  id: string,
  input: PropertyOwnerFormValues,
) {
  const values = propertyOwnerSchema.parse(input);
  const { supabase, organizationId } = await getOrganizationContext();
  const { data, error } = await supabase
    .from("property_owners")
    .update(values)
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select("*")
    .single();

  if (error) throw new Error("Could not update this property owner.");
  revalidatePath("/dashboard");
  return data;
}

export async function setPropertyOwnerArchived(id: string, archived: boolean) {
  const { supabase, organizationId } = await getOrganizationContext();
  const { error } = await supabase
    .from("property_owners")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) {
    throw new Error(
      archived
        ? "Could not archive this property owner."
        : "Could not restore this property owner.",
    );
  }

  revalidatePath("/dashboard");
}
