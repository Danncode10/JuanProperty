"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  propertyUnitSchema,
  type PropertyUnitData,
  type PropertyUnitFormValues,
} from "@/lib/validation/property-unit";

async function getOrganizationContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Sign in to manage property units.");
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

async function assertPropertyInOrganization(
  supabase: Awaited<ReturnType<typeof createClient>>,
  propertyId: string,
  organizationId: string,
  allowArchived = false,
) {
  const { data: property, error } = await supabase
    .from("properties")
    .select("id, archived_at")
    .eq("id", propertyId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) throw new Error("Could not verify the selected property.");
  if (!property || (property.archived_at && !allowArchived)) {
    throw new Error("Choose an active property from your organization.");
  }
}

export async function listUnitProperties() {
  const { supabase, organizationId } = await getOrganizationContext();
  const { data, error } = await supabase
    .from("properties")
    .select("id, name, address, archived_at")
    .eq("organization_id", organizationId)
    .is("archived_at", null)
    .order("name", { ascending: true });

  if (error) throw new Error("Could not load properties for unit management.");
  return data;
}

export async function listPropertyUnits(includeArchived = false) {
  const { supabase, organizationId } = await getOrganizationContext();
  let query = supabase
    .from("property_units")
    .select(
      "*, property:properties!property_units_property_org_fkey(id, name, archived_at)",
    )
    .eq("organization_id", organizationId)
    .order("unit_number", { ascending: true });

  if (!includeArchived) query = query.is("archived_at", null);

  const { data, error } = await query;
  if (error) throw new Error("Could not load property units.");
  return data;
}

export async function createPropertyUnit(input: PropertyUnitFormValues) {
  const values: PropertyUnitData = propertyUnitSchema.parse(input);
  const { supabase, organizationId } = await getOrganizationContext();
  await assertPropertyInOrganization(
    supabase,
    values.property_id,
    organizationId,
  );

  const { data, error } = await supabase
    .from("property_units")
    .insert({
      ...values,
      organization_id: organizationId,
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    throw new Error(
      "That unit number or name is already used for this property.",
    );
  }
  if (error) throw new Error("Could not create this unit.");

  revalidatePath("/dashboard");
  return data;
}

export async function updatePropertyUnit(
  id: string,
  input: PropertyUnitFormValues,
) {
  const values: PropertyUnitData = propertyUnitSchema.parse(input);
  const { supabase, organizationId } = await getOrganizationContext();
  const { data: existingUnit, error: lookupError } = await supabase
    .from("property_units")
    .select("property_id")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (lookupError || !existingUnit) {
    throw new Error("Could not find this unit in your organization.");
  }
  if (existingUnit.property_id !== values.property_id) {
    throw new Error("A unit cannot be moved to another property.");
  }

  await assertPropertyInOrganization(
    supabase,
    values.property_id,
    organizationId,
    true,
  );

  const { data, error } = await supabase
    .from("property_units")
    .update({
      unit_number: values.unit_number,
      floor: values.floor,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      default_rent_php: values.default_rent_php,
      description: values.description,
      operational_status: values.operational_status,
    })
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select("id")
    .single();

  if (error?.code === "23505") {
    throw new Error(
      "That unit number or name is already used for this property.",
    );
  }
  if (error) throw new Error("Could not update this unit.");

  revalidatePath("/dashboard");
  return data;
}

export async function setPropertyUnitArchived(id: string, archived: boolean) {
  const { supabase, organizationId } = await getOrganizationContext();
  const { error } = await supabase
    .from("property_units")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select("id")
    .single();

  if (error) {
    throw new Error(
      archived
        ? "Could not archive this unit."
        : "Could not restore this unit.",
    );
  }

  revalidatePath("/dashboard");
}
