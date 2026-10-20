"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2, Plus, RotateCcw } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listPropertyOwners } from "@/services/property-owners";
import {
  createProperty,
  listProperties,
  setPropertyArchived,
  updateProperty,
} from "@/services/properties";
import {
  emptyPropertyForm,
  propertySchema,
  type PropertyFormValues,
} from "@/lib/validation/property";

type PropertyRecord = Awaited<ReturnType<typeof listProperties>>[number];
type OwnerRecord = Awaited<ReturnType<typeof listPropertyOwners>>[number];
type PropertyField = Exclude<keyof PropertyFormValues, "primary_owner_id">;
type PropertyFieldErrors = Partial<Record<keyof PropertyFormValues, string>>;

function toFormValues(property: PropertyRecord): PropertyFormValues {
  return {
    name: property.name,
    property_type: property.property_type,
    address: property.address,
    primary_owner_id: property.primary_owner_id,
    description: property.description ?? "",
  };
}

function PropertyTextField({
  label,
  name,
  value,
  onChange,
  error,
}: {
  label: string;
  name: PropertyField;
  value: string;
  onChange: (name: PropertyField, value: string) => void;
  error?: string;
}) {
  const id = `property-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Input
        id={id}
        name={name}
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

function PropertyCard({
  property,
  onEdit,
  onArchive,
  busy,
}: {
  property: PropertyRecord;
  onEdit: () => void;
  onArchive: () => void;
  busy: boolean;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="gap-3 border-b border-border bg-muted/40">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{property.name}</CardTitle>
            <CardDescription className="mt-1 truncate">
              {property.address}
            </CardDescription>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
            {property.archived_at ? "Archived" : "Active"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{property.property_type}</span>
          <span aria-hidden="true">·</span>
          <span>
            Primary owner: {property.owner?.name ?? "Owner unavailable"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        {property.description ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {property.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No description provided.
          </p>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          className="min-h-12"
          disabled={busy}
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-12 gap-2"
          disabled={busy}
          onClick={onArchive}
        >
          {property.archived_at ? <RotateCcw className="size-4" /> : null}
          {property.archived_at ? "Restore" : "Archive"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PropertiesTab({
  onNavigateOwners,
}: {
  onNavigateOwners: () => void;
}) {
  const queryClient = useQueryClient();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProperty, setEditingProperty] = useState<PropertyRecord | null>(
    null,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] =
    useState<PropertyFormValues>(emptyPropertyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<PropertyFieldErrors>({});

  const propertiesQuery = useQuery({
    queryKey: ["properties", includeArchived],
    queryFn: () => listProperties(includeArchived),
  });
  const ownersQuery = useQuery({
    queryKey: ["property-owners", true],
    queryFn: () => listPropertyOwners(true),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      editingProperty
        ? updateProperty(editingProperty.id, formValues)
        : createProperty(formValues),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      setFormOpen(false);
      setEditingProperty(null);
      setFormValues(emptyPropertyForm);
      setFormError(null);
      setFieldErrors({});
      toast.success(
        editingProperty ? "Property updated." : "Property created.",
      );
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Could not save this property.";
      setFormError(message);
      toast.error(message);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      setPropertyArchived(id, archived),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(
        variables.archived ? "Property archived." : "Property restored.",
      );
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update this property.",
      ),
  });

  const owners = ownersQuery.data ?? [];
  const ownerOptions = owners.filter(
    (owner) =>
      !owner.archived_at || owner.id === editingProperty?.primary_owner_id,
  );
  const filteredProperties = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase();
    const records = propertiesQuery.data ?? [];
    if (!search) return records;
    return records.filter((property) =>
      [
        property.name,
        property.address,
        property.property_type,
        property.owner?.name ?? "",
      ].some((value) => value.toLocaleLowerCase().includes(search)),
    );
  }, [propertiesQuery.data, searchTerm]);

  function startCreate() {
    setEditingProperty(null);
    setFormValues({
      ...emptyPropertyForm,
      primary_owner_id:
        ownerOptions.find((owner) => !owner.archived_at)?.id ?? "",
    });
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  }

  function startEdit(property: PropertyRecord) {
    setEditingProperty(property);
    setFormValues(toFormValues(property));
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  }

  function updateField(name: PropertyField, value: string) {
    setFormValues((current) => ({ ...current, [name]: value }));
    setFormError(null);
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const result = propertySchema.safeParse(formValues);
    if (!result.success) {
      const nextErrors: PropertyFieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in emptyPropertyForm) {
          nextErrors[field as keyof PropertyFormValues] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});
    saveMutation.mutate();
  }

  function closeForm() {
    setFormOpen(false);
    setEditingProperty(null);
    setFormValues(emptyPropertyForm);
    setFormError(null);
    setFieldErrors({});
  }

  const hasOwners = owners.some((owner) => !owner.archived_at);
  const busy = archiveMutation.isPending || saveMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Real Estate</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Properties
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage property details and their primary owner. Archived records
            remain available for reference.
          </p>
        </div>
        <Button
          onClick={startCreate}
          disabled={!hasOwners || ownersQuery.isLoading}
          className="min-h-12 w-full gap-2 sm:w-auto"
        >
          <Plus className="size-4" /> Add property
        </Button>
      </div>

      {!hasOwners && !ownersQuery.isLoading && !ownersQuery.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Building2
              className="size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-foreground">
                Add a property owner first
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each property needs one primary owner from your organization.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="min-h-12"
              onClick={onNavigateOwners}
            >
              Open Property Owners
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {formOpen ? (
        <Card>
          <form onSubmit={submitForm}>
            <CardHeader>
              <CardTitle>
                {editingProperty ? "Edit property" : "Add property"}
              </CardTitle>
              <CardDescription>
                Keep the property record and primary owner within your
                organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <PropertyTextField
                label="Property name"
                name="name"
                value={formValues.name}
                onChange={updateField}
                error={fieldErrors.name}
              />
              <PropertyTextField
                label="Property type"
                name="property_type"
                value={formValues.property_type}
                onChange={updateField}
                error={fieldErrors.property_type}
              />
              <PropertyTextField
                label="Address"
                name="address"
                value={formValues.address}
                onChange={updateField}
                error={fieldErrors.address}
              />
              <div className="space-y-2">
                <label
                  htmlFor="property-primary-owner"
                  className="text-sm font-medium text-foreground"
                >
                  Primary owner
                </label>
                <Select
                  value={formValues.primary_owner_id}
                  onValueChange={(value) => {
                    setFormValues((current) => ({
                      ...current,
                      primary_owner_id: value,
                    }));
                    setFieldErrors((current) => ({
                      ...current,
                      primary_owner_id: undefined,
                    }));
                  }}
                  disabled={ownersQuery.isLoading || ownersQuery.isError}
                >
                  <SelectTrigger
                    id="property-primary-owner"
                    aria-invalid={Boolean(fieldErrors.primary_owner_id)}
                    aria-describedby={
                      fieldErrors.primary_owner_id
                        ? "property-primary-owner-error"
                        : undefined
                    }
                    className="min-h-12 focus-visible:ring-ring"
                  >
                    <SelectValue placeholder="Select a property owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownerOptions.map((owner: OwnerRecord) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.name}
                        {owner.archived_at ? " (archived)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.primary_owner_id ? (
                  <p
                    id="property-primary-owner-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.primary_owner_id}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="property-description"
                  className="text-sm font-medium text-foreground"
                >
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <Textarea
                  id="property-description"
                  name="description"
                  value={formValues.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.description)}
                  aria-describedby={
                    fieldErrors.description
                      ? "property-description-error"
                      : undefined
                  }
                  className="min-h-24 focus-visible:ring-ring"
                />
                {fieldErrors.description ? (
                  <p
                    id="property-description-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.description}
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
                onClick={closeForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-h-12 w-full gap-2 sm:w-auto"
                disabled={saveMutation.isPending || ownersQuery.isLoading}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {saveMutation.isPending
                  ? "Saving..."
                  : editingProperty
                    ? "Save changes"
                    : "Create property"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : null}

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="space-y-2">
              <label
                htmlFor="property-search"
                className="text-sm font-medium text-foreground"
              >
                Search properties
              </label>
              <Input
                id="property-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Name, type, address, or primary owner"
                className="min-h-12 focus-visible:ring-ring"
              />
            </div>
            <label className="flex min-h-12 items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(event) => setIncludeArchived(event.target.checked)}
                className="size-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              Include archived
            </label>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-3 text-sm text-muted-foreground">
            <span>
              {propertiesQuery.isLoading
                ? "Loading properties..."
                : `${filteredProperties.length} ${filteredProperties.length === 1 ? "property" : "properties"}`}
            </span>
            {ownersQuery.isError ? (
              <div className="flex items-center gap-2 text-destructive">
                <span>Owner list unavailable.</span>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-12"
                  onClick={() => void ownersQuery.refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : null}
          </div>

          {propertiesQuery.isLoading ? (
            <div
              className="grid gap-4 md:grid-cols-2"
              aria-label="Loading properties"
            >
              {[0, 1].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-xl border border-border bg-muted"
                />
              ))}
            </div>
          ) : propertiesQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-destructive">
                Could not load properties. Try again.
              </p>
              <Button
                type="button"
                variant="outline"
                className="min-h-12"
                onClick={() => void propertiesQuery.refetch()}
              >
                Retry
              </Button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Building2
                className="size-10 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-semibold text-foreground">
                  {searchTerm ? "No matching properties" : "No properties yet"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm
                    ? "Try a different name, address, type, or owner."
                    : "Add a property to start organizing your portfolio."}
                </p>
              </div>
              {searchTerm ? (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-12"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              ) : hasOwners ? (
                <Button
                  type="button"
                  className="min-h-12"
                  onClick={startCreate}
                >
                  Add property
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={() => startEdit(property)}
                  onArchive={() =>
                    archiveMutation.mutate({
                      id: property.id,
                      archived: !property.archived_at,
                    })
                  }
                  busy={busy}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
