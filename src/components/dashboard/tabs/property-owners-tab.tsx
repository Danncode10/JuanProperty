"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createPropertyOwner,
  listPropertyOwners,
  setPropertyOwnerArchived,
  updatePropertyOwner,
} from "@/services/property-owners";
import {
  emptyPropertyOwnerForm,
  propertyOwnerSchema,
  type PropertyOwnerFormValues,
} from "@/lib/validation/property-owner";
import type { Tables } from "@/types/supabase";

type PropertyOwner = Tables<"property_owners">;

function toFormValues(owner: PropertyOwner): PropertyOwnerFormValues {
  return {
    owner_type: owner.owner_type === "company" ? "company" : "individual",
    name: owner.name,
    contact_person: owner.contact_person ?? "",
    email: owner.email ?? "",
    phone: owner.phone ?? "",
    address: owner.address ?? "",
    description: owner.description ?? "",
    notes: owner.notes ?? "",
  };
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  name: Exclude<keyof PropertyOwnerFormValues, "owner_type">;
  value: string;
  onChange: (
    name: Exclude<keyof PropertyOwnerFormValues, "owner_type">,
    value: string,
  ) => void;
  type?: string;
  error?: string;
}) {
  const id = `property-owner-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-12 focus-visible:ring-ring"
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PropertyOwnersTab() {
  const queryClient = useQueryClient();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editingOwner, setEditingOwner] = useState<PropertyOwner | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<PropertyOwnerFormValues>(
    emptyPropertyOwnerForm,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PropertyOwnerFormValues, string>>
  >({});

  const ownersQuery = useQuery({
    queryKey: ["property-owners", includeArchived],
    queryFn: () => listPropertyOwners(includeArchived),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      editingOwner
        ? updatePropertyOwner(editingOwner.id, formValues)
        : createPropertyOwner(formValues),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["property-owners"] });
      setFormOpen(false);
      setEditingOwner(null);
      setFormValues(emptyPropertyOwnerForm);
      setFormError(null);
      setFieldErrors({});
      toast.success(
        editingOwner ? "Property owner updated." : "Property owner created.",
      );
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Could not save this record.";
      setFormError(message);
      toast.error(message);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      setPropertyOwnerArchived(id, archived),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["property-owners"] });
      toast.success(
        variables.archived
          ? "Property owner archived."
          : "Property owner restored.",
      );
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update this record.",
      ),
  });

  function startCreate() {
    setEditingOwner(null);
    setFormValues(emptyPropertyOwnerForm);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  }

  function startEdit(owner: PropertyOwner) {
    setEditingOwner(owner);
    setFormValues(toFormValues(owner));
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  }

  function updateField(
    name: Exclude<keyof PropertyOwnerFormValues, "owner_type">,
    value: string,
  ) {
    setFormValues((current) => ({ ...current, [name]: value }));
    setFormError(null);
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const result = propertyOwnerSchema.safeParse(formValues);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof PropertyOwnerFormValues, string>> =
        {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in emptyPropertyOwnerForm) {
          nextErrors[field as keyof PropertyOwnerFormValues] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});
    saveMutation.mutate();
  }

  const owners = ownersQuery.data ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Real Estate</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Property Owners
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Keep ownership contacts and notes together. Archived records remain
            available for reference.
          </p>
        </div>
        <Button
          onClick={startCreate}
          className="min-h-12 w-full gap-2 sm:w-auto"
        >
          <Plus className="size-4" /> Add owner
        </Button>
      </div>

      {formOpen ? (
        <Card>
          <form onSubmit={submitForm}>
            <CardHeader>
              <CardTitle>
                {editingOwner ? "Edit property owner" : "Add property owner"}
              </CardTitle>
              <CardDescription>
                {formValues.owner_type === "company"
                  ? "Enter the company name and an optional contact person."
                  : "Enter the individual’s full name and contact information."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="property-owner-owner_type"
                  className="text-sm font-medium text-foreground"
                >
                  Owner type
                </label>
                <select
                  id="property-owner-owner_type"
                  name="owner_type"
                  value={formValues.owner_type}
                  onChange={(event) => {
                    const ownerType = event.target.value;
                    if (ownerType === "individual" || ownerType === "company") {
                      setFormValues((current) => ({
                        ...current,
                        owner_type: ownerType,
                        contact_person:
                          ownerType === "individual"
                            ? ""
                            : current.contact_person,
                      }));
                    }
                  }}
                  className="min-h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </div>
              <Field
                label={
                  formValues.owner_type === "company"
                    ? "Company name"
                    : "Full name"
                }
                name="name"
                value={formValues.name}
                onChange={updateField}
                error={fieldErrors.name}
              />
              {formValues.owner_type === "company" ? (
                <Field
                  label="Contact person"
                  name="contact_person"
                  value={formValues.contact_person}
                  onChange={updateField}
                  error={fieldErrors.contact_person}
                />
              ) : null}
              <Field
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={updateField}
                error={fieldErrors.email}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                value={formValues.phone}
                onChange={updateField}
                error={fieldErrors.phone}
              />
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="property-owner-address"
                  className="text-sm font-medium text-foreground"
                >
                  Address
                </label>
                <Textarea
                  id="property-owner-address"
                  name="address"
                  value={formValues.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.address)}
                  aria-describedby={
                    fieldErrors.address
                      ? "property-owner-address-error"
                      : undefined
                  }
                  className="min-h-24 focus-visible:ring-ring"
                />
                {fieldErrors.address ? (
                  <p
                    id="property-owner-address-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.address}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="property-owner-description"
                  className="text-sm font-medium text-foreground"
                >
                  Description
                </label>
                <Textarea
                  id="property-owner-description"
                  name="description"
                  value={formValues.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.description)}
                  aria-describedby={
                    fieldErrors.description
                      ? "property-owner-description-error"
                      : undefined
                  }
                  className="min-h-24 focus-visible:ring-ring"
                />
                {fieldErrors.description ? (
                  <p
                    id="property-owner-description-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.description}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="property-owner-notes"
                  className="text-sm font-medium text-foreground"
                >
                  Notes
                </label>
                <Textarea
                  id="property-owner-notes"
                  name="notes"
                  value={formValues.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.notes)}
                  aria-describedby={
                    fieldErrors.notes ? "property-owner-notes-error" : undefined
                  }
                  className="min-h-24 focus-visible:ring-ring"
                />
                {fieldErrors.notes ? (
                  <p
                    id="property-owner-notes-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.notes}
                  </p>
                ) : null}
              </div>
              {formError ? (
                <p
                  role="alert"
                  className="text-sm text-destructive sm:col-span-2"
                >
                  {formError}
                </p>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="min-h-12 w-full sm:w-auto"
                disabled={saveMutation.isPending}
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-h-12 w-full gap-2 sm:w-auto"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {saveMutation.isPending
                  ? "Saving…"
                  : editingOwner
                    ? "Save changes"
                    : "Create owner"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Owner directory</CardTitle>
            <CardDescription className="mt-1">
              {owners.length} {owners.length === 1 ? "record" : "records"}
              {includeArchived ? ", including archived" : ""}
            </CardDescription>
          </div>
          <label className="flex min-h-12 items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(event) => setIncludeArchived(event.target.checked)}
              className="size-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            Include archived
          </label>
        </CardHeader>
        <CardContent>
          {ownersQuery.isPending ? (
            <div
              className="flex min-h-48 flex-col items-center justify-center gap-3 text-muted-foreground"
              role="status"
            >
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm">Loading property owners…</p>
            </div>
          ) : ownersQuery.isError ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-destructive">
                {ownersQuery.error.message}
              </p>
              <Button
                variant="outline"
                className="min-h-12"
                onClick={() => void ownersQuery.refetch()}
              >
                Try again
              </Button>
            </div>
          ) : owners.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 text-center">
              <UsersRound
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-base font-semibold text-foreground">
                {includeArchived
                  ? "No owner records to show"
                  : "No property owners yet"}
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {includeArchived
                  ? "Try hiding archived records or add a new owner to start your directory."
                  : "Add an individual or company to keep ownership contacts organized."}
              </p>
              {!includeArchived ? (
                <Button onClick={startCreate} className="mt-5 min-h-12 gap-2">
                  <Plus className="size-4" /> Add first owner
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {owners.map((owner) => (
                <article
                  key={owner.id}
                  className="rounded-lg border border-border bg-background p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {owner.owner_type === "company" ? (
                          <Building2 className="size-5" aria-hidden="true" />
                        ) : (
                          <UserRound className="size-5" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="break-words font-semibold text-foreground">
                          {owner.name}
                        </h2>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {owner.owner_type}
                          {owner.archived_at ? " · Archived" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  {owner.contact_person ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Contact: {owner.contact_person}
                    </p>
                  ) : null}
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {owner.email ? (
                      <a
                        className="flex min-h-10 items-center gap-2 break-all hover:text-primary"
                        href={`mailto:${owner.email}`}
                      >
                        <Mail className="size-4 shrink-0" aria-hidden="true" />{" "}
                        {owner.email}
                      </a>
                    ) : null}
                    {owner.phone ? (
                      <a
                        className="flex min-h-10 items-center gap-2 hover:text-primary"
                        href={`tel:${owner.phone}`}
                      >
                        <Phone className="size-4 shrink-0" aria-hidden="true" />{" "}
                        {owner.phone}
                      </a>
                    ) : null}
                    {owner.address ? (
                      <p className="flex items-start gap-2">
                        <MapPin
                          className="mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        {owner.address}
                      </p>
                    ) : null}
                  </div>
                  {owner.description ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">
                      {owner.description}
                    </p>
                  ) : null}
                  {owner.notes ? (
                    <p className="mt-3 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm text-muted-foreground">
                      {owner.notes}
                    </p>
                  ) : null}
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-12"
                      disabled={archiveMutation.isPending}
                      onClick={() => startEdit(owner)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-12 gap-2"
                      disabled={archiveMutation.isPending}
                      onClick={() =>
                        archiveMutation.mutate({
                          id: owner.id,
                          archived: !owner.archived_at,
                        })
                      }
                    >
                      {owner.archived_at ? (
                        <RotateCcw className="size-4" />
                      ) : null}
                      {owner.archived_at ? "Restore" : "Archive"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
