"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  propertySchema,
  type PropertyFormValues,
} from "@/lib/validation/property";

async function getOrganizationContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Sign in to manage properties.");
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

async function assertPrimaryOwnerInOrganization(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ownerId: string,
  organizationId: string,
  allowArchived = false,
) {
  const { data: owner, error } = await supabase
    .from("property_owners")
    .select("id, archived_at")
    .eq("id", ownerId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) throw new Error("Could not verify the selected property owner.");
  if (!owner || (owner.archived_at && !allowArchived))
    throw new Error("Choose a property owner from your organization.");
}

export async function listProperties(includeArchived = false) {
  const { supabase, organizationId } = await getOrganizationContext();
  let query = supabase
    .from("properties")
    .select(
      "*, owner:property_owners!properties_primary_owner_org_fkey(id, name, owner_type, archived_at)",
    )
    .eq("organization_id", organizationId)
    .order("name", { ascending: true });

  if (!includeArchived) query = query.is("archived_at", null);

  const { data, error } = await query;
  if (error) throw new Error("Could not load properties.");
  return data;
}

export async function createProperty(input: PropertyFormValues) {
  const values = propertySchema.parse(input);
  const { supabase, organizationId } = await getOrganizationContext();
  await assertPrimaryOwnerInOrganization(
    supabase,
    values.primary_owner_id,
    organizationId,
  );

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...values, organization_id: organizationId })
    .select("id")
    .single();

  if (error) throw new Error("Could not create this property.");
  revalidatePath("/dashboard");
  return data;
}

export async function updateProperty(id: string, input: PropertyFormValues) {
  const values = propertySchema.parse(input);
  const { supabase, organizationId } = await getOrganizationContext();
  const { data: existingProperty, error: lookupError } = await supabase
    .from("properties")
    .select("primary_owner_id")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (lookupError || !existingProperty) {
    throw new Error("Could not find this property in your organization.");
  }

  await assertPrimaryOwnerInOrganization(
    supabase,
    values.primary_owner_id,
    organizationId,
    existingProperty.primary_owner_id === values.primary_owner_id,
  );

  const { data, error } = await supabase
    .from("properties")
    .update(values)
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select("id")
    .single();

  if (error) throw new Error("Could not update this property.");
  revalidatePath("/dashboard");
  return data;
}

export async function setPropertyArchived(id: string, archived: boolean) {
  const { supabase, organizationId } = await getOrganizationContext();
  const { error } = await supabase
    .from("properties")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select("id")
    .single();

  if (error) {
    throw new Error(
      archived
        ? "Could not archive this property."
        : "Could not restore this property.",
    );
  }

  revalidatePath("/dashboard");
}
