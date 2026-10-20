"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DoorOpen, Loader2, Plus, RotateCcw } from "lucide-react";
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
import {
  createPropertyUnit,
  listPropertyUnits,
  listUnitProperties,
  setPropertyUnitArchived,
  updatePropertyUnit,
} from "@/services/property-units";
import {
  emptyPropertyUnitForm,
  propertyUnitSchema,
  type PropertyUnitFormValues,
} from "@/lib/validation/property-unit";

type UnitRecord = Awaited<ReturnType<typeof listPropertyUnits>>[number];
type PropertyOption = Awaited<ReturnType<typeof listUnitProperties>>[number];
type UnitField = keyof PropertyUnitFormValues;
type TextUnitField = Exclude<UnitField, "property_id" | "operational_status">;
type UnitFieldErrors = Partial<Record<keyof PropertyUnitFormValues, string>>;

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

const statusLabels: Record<string, string> = {
  active: "Active",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

function toFormValues(unit: UnitRecord): PropertyUnitFormValues {
  return {
    property_id: unit.property_id,
    unit_number: unit.unit_number,
    floor: unit.floor?.toString() ?? "",
    bedrooms: unit.bedrooms?.toString() ?? "",
    bathrooms: unit.bathrooms?.toString() ?? "",
    default_rent_php: unit.default_rent_php.toFixed(2),
    description: unit.description ?? "",
    operational_status:
      unit.operational_status as PropertyUnitFormValues["operational_status"],
  };
}

function UnitFieldInput({
  label,
  name,
  value,
  type = "text",
  step,
  min,
  onChange,
  error,
}: {
  label: string;
  name: TextUnitField;
  value: string;
  type?: "text" | "number";
  step?: string;
  min?: string;
  onChange: (name: TextUnitField, value: string) => void;
  error?: string;
}) {
  const id = `property-unit-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        step={step}
        min={min}
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

function PropertyUnitCard({
  unit,
  onEdit,
  onArchive,
  busy,
}: {
  unit: UnitRecord;
  onEdit: () => void;
  onArchive: () => void;
  busy: boolean;
}) {
  const details = [
    unit.floor === null ? null : `Floor ${unit.floor}`,
    unit.bedrooms === null ? null : `${unit.bedrooms} bedrooms`,
    unit.bathrooms === null ? null : `${unit.bathrooms} bathrooms`,
  ].filter((item): item is string => item !== null);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="gap-3 border-b border-border bg-muted/40">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">
              {unit.unit_number}
            </CardTitle>
            <CardDescription className="mt-1 truncate">
              {unit.property?.name ?? "Property unavailable"}
            </CardDescription>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
            {unit.archived_at
              ? "Archived"
              : (statusLabels[unit.operational_status] ?? "Unknown state")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pt-4">
        <p className="font-medium text-foreground">
          {currencyFormatter.format(unit.default_rent_php)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            default monthly rent
          </span>
        </p>
        {details.length ? (
          <p className="text-sm text-muted-foreground">{details.join(" · ")}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No floor or room details provided.
          </p>
        )}
        {unit.description ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {unit.description}
          </p>
        ) : null}
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
          {unit.archived_at ? <RotateCcw className="size-4" /> : null}
          {unit.archived_at ? "Restore" : "Archive"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PropertyUnitsTab({
  onNavigateProperties,
}: {
  onNavigateProperties: () => void;
}) {
  const queryClient = useQueryClient();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUnit, setEditingUnit] = useState<UnitRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<PropertyUnitFormValues>(
    emptyPropertyUnitForm,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UnitFieldErrors>({});

  const unitsQuery = useQuery({
    queryKey: ["property-units", includeArchived],
    queryFn: () => listPropertyUnits(includeArchived),
  });
  const propertiesQuery = useQuery({
    queryKey: ["unit-properties"],
    queryFn: listUnitProperties,
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      editingUnit
        ? updatePropertyUnit(editingUnit.id, formValues)
        : createPropertyUnit(formValues),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["property-units"] });
      setFormOpen(false);
      setEditingUnit(null);
      setFormValues(emptyPropertyUnitForm);
      setFormError(null);
      setFieldErrors({});
      toast.success(editingUnit ? "Unit updated." : "Unit created.");
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Could not save this unit.";
      setFormError(message);
      toast.error(message);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      setPropertyUnitArchived(id, archived),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["property-units"] });
      toast.success(variables.archived ? "Unit archived." : "Unit restored.");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Could not update this unit.",
      ),
  });

  const properties = propertiesQuery.data ?? [];
  const propertyOptions = useMemo(() => {
    if (!editingUnit?.property) return properties;
    return properties.some(
      (property) => property.id === editingUnit.property_id,
    )
      ? properties
      : [
          ...properties,
          {
            id: editingUnit.property_id,
            name: `${editingUnit.property.name} (archived)`,
            address: "",
            archived_at: editingUnit.property.archived_at,
          },
        ];
  }, [editingUnit, properties]);

  const filteredUnits = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase();
    const records = unitsQuery.data ?? [];
    if (!search) return records;
    return records.filter((unit) =>
      [
        unit.unit_number,
        unit.property?.name ?? "",
        unit.operational_status,
        unit.description ?? "",
      ].some((value) => value.toLocaleLowerCase().includes(search)),
    );
  }, [unitsQuery.data, searchTerm]);

  function startCreate() {
    setEditingUnit(null);
    setFormValues({
      ...emptyPropertyUnitForm,
      property_id: properties[0]?.id ?? "",
    });
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  }

  function startEdit(unit: UnitRecord) {
    setEditingUnit(unit);
    setFormValues(toFormValues(unit));
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  }

  function updateField(name: UnitField, value: string) {
    setFormValues((current) => ({ ...current, [name]: value }));
    setFormError(null);
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const result = propertyUnitSchema.safeParse(formValues);
    if (!result.success) {
      const nextErrors: UnitFieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in emptyPropertyUnitForm) {
          nextErrors[field as keyof PropertyUnitFormValues] = issue.message;
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
    setEditingUnit(null);
    setFormValues(emptyPropertyUnitForm);
    setFormError(null);
    setFieldErrors({});
  }

  const busy = archiveMutation.isPending || saveMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Real Estate</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Property Units
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage unit details, operating state, and default monthly rent. Unit
            occupancy will come from lease records.
          </p>
        </div>
        <Button
          onClick={startCreate}
          disabled={properties.length === 0 || propertiesQuery.isLoading}
          className="min-h-12 w-full gap-2 sm:w-auto"
        >
          <Plus className="size-4" /> Add unit
        </Button>
      </div>

      {!properties.length &&
      !propertiesQuery.isLoading &&
      !propertiesQuery.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <DoorOpen
              className="size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-foreground">
                Add a property first
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each unit must belong to a property in your organization.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="min-h-12"
              onClick={onNavigateProperties}
            >
              Open Properties
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {formOpen ? (
        <Card>
          <form onSubmit={submitForm}>
            <CardHeader>
              <CardTitle>{editingUnit ? "Edit unit" : "Add unit"}</CardTitle>
              <CardDescription>
                Unit details stay linked to their property. Occupancy is tracked
                through leases, not as a unit field.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="property-unit-property"
                  className="text-sm font-medium text-foreground"
                >
                  Property
                </label>
                <Select
                  value={formValues.property_id}
                  onValueChange={(value) => updateField("property_id", value)}
                  disabled={Boolean(editingUnit) || propertiesQuery.isError}
                >
                  <SelectTrigger
                    id="property-unit-property"
                    aria-invalid={Boolean(fieldErrors.property_id)}
                    aria-describedby={
                      fieldErrors.property_id
                        ? "property-unit-property-error"
                        : undefined
                    }
                    className="min-h-12 focus:ring-ring"
                  >
                    <SelectValue placeholder="Choose a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyOptions.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.property_id ? (
                  <p
                    id="property-unit-property-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.property_id}
                  </p>
                ) : null}
                {editingUnit ? (
                  <p className="text-xs text-muted-foreground">
                    A unit cannot be moved after it is created.
                  </p>
                ) : null}
              </div>
              <UnitFieldInput
                label="Unit number or name"
                name="unit_number"
                value={formValues.unit_number}
                onChange={updateField}
                error={fieldErrors.unit_number}
              />
              <UnitFieldInput
                label="Floor (optional)"
                name="floor"
                type="number"
                step="1"
                value={formValues.floor}
                onChange={updateField}
                error={fieldErrors.floor}
              />
              <UnitFieldInput
                label="Bedrooms (optional)"
                name="bedrooms"
                type="number"
                min="0"
                step="1"
                value={formValues.bedrooms}
                onChange={updateField}
                error={fieldErrors.bedrooms}
              />
              <UnitFieldInput
                label="Bathrooms (optional)"
                name="bathrooms"
                type="number"
                min="0"
                step="0.1"
                value={formValues.bathrooms}
                onChange={updateField}
                error={fieldErrors.bathrooms}
              />
              <UnitFieldInput
                label="Default monthly rent (PHP)"
                name="default_rent_php"
                type="number"
                min="0"
                step="0.01"
                value={formValues.default_rent_php}
                onChange={updateField}
                error={fieldErrors.default_rent_php}
              />
              <div className="space-y-2">
                <label
                  htmlFor="property-unit-status"
                  className="text-sm font-medium text-foreground"
                >
                  Operational state
                </label>
                <Select
                  value={formValues.operational_status}
                  onValueChange={(value) =>
                    updateField("operational_status", value)
                  }
                >
                  <SelectTrigger
                    id="property-unit-status"
                    aria-invalid={Boolean(fieldErrors.operational_status)}
                    aria-describedby={
                      fieldErrors.operational_status
                        ? "property-unit-status-error"
                        : undefined
                    }
                    className="min-h-12 focus:ring-ring"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.operational_status ? (
                  <p
                    id="property-unit-status-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.operational_status}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="property-unit-description"
                  className="text-sm font-medium text-foreground"
                >
                  Description (optional)
                </label>
                <Textarea
                  id="property-unit-description"
                  name="description"
                  value={formValues.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.description)}
                  aria-describedby={
                    fieldErrors.description
                      ? "property-unit-description-error"
                      : undefined
                  }
                  className="min-h-28 focus-visible:ring-ring"
                />
                {fieldErrors.description ? (
                  <p
                    id="property-unit-description-error"
                    className="text-sm text-destructive"
                  >
                    {fieldErrors.description}
                  </p>
                ) : null}
              </div>
              {formError ? (
                <p
                  className="text-sm text-destructive sm:col-span-2"
                  role="alert"
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
                disabled={busy}
                onClick={closeForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-h-12 w-full gap-2 sm:w-auto"
                disabled={busy || propertiesQuery.isLoading}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {editingUnit ? "Save changes" : "Add unit"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : null}

      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row">
          <div className="flex-1 space-y-2">
            <label
              htmlFor="property-unit-search"
              className="text-sm font-medium text-foreground"
            >
              Search units
            </label>
            <Input
              id="property-unit-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Unit number, property, state, or description"
              className="min-h-12 focus-visible:ring-ring"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="min-h-12 self-end"
            aria-pressed={includeArchived}
            onClick={() => setIncludeArchived((current) => !current)}
          >
            {includeArchived ? "Hide archived" : "Include archived"}
          </Button>
        </CardContent>
      </Card>

      {unitsQuery.isLoading || propertiesQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Loading property units…
          </CardContent>
        </Card>
      ) : unitsQuery.isError || propertiesQuery.isError ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium text-destructive" role="alert">
              Could not load property units. Refresh the page and try again.
            </p>
          </CardContent>
        </Card>
      ) : filteredUnits.length ? (
        <>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {filteredUnits.length}{" "}
            {filteredUnits.length === 1 ? "unit" : "units"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredUnits.map((unit) => (
              <PropertyUnitCard
                key={unit.id}
                unit={unit}
                onEdit={() => startEdit(unit)}
                onArchive={() =>
                  archiveMutation.mutate({
                    id: unit.id,
                    archived: !unit.archived_at,
                  })
                }
                busy={busy}
              />
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <DoorOpen
              className="size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-foreground">
                {searchTerm.trim()
                  ? "No units match your search"
                  : includeArchived
                    ? "No archived units to show"
                    : "No units yet"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm.trim()
                  ? "Try another unit number, property name, state, or description."
                  : "Add a unit to record its operating details and default rent."}
              </p>
            </div>
            {!searchTerm.trim() && properties.length ? (
              <Button className="min-h-12" onClick={startCreate}>
                <Plus className="mr-2 size-4" /> Add unit
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
