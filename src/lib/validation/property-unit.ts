import { z } from "zod";

const requiredText = (label: string, maximumLength: number) =>
  z
    .string()
    .trim()
    .min(1, `Enter a ${label}.`)
    .max(maximumLength, `Use ${maximumLength} characters or fewer.`);

const optionalNumber = (label: string, validation: z.ZodType<number>) =>
  z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .superRefine((value, context) => {
      if (value === null) return;
      const result = validation.safeParse(value);
      if (!result.success) {
        for (const issue of result.error.issues) {
          context.addIssue({ code: "custom", message: issue.message });
        }
      }
      if (!Number.isFinite(value)) {
        context.addIssue({
          code: "custom",
          message: `Enter a valid ${label}.`,
        });
      }
    });

const optionalInteger = (label: string, minimum: number, maximum: number) =>
  optionalNumber(
    label,
    z
      .number()
      .int(`Enter a whole number for ${label}.`)
      .min(minimum, `Use ${minimum} or greater.`)
      .max(maximum, `Use ${maximum} or less.`),
  );

const optionalBathroomCount = optionalNumber(
  "bathrooms",
  z
    .number()
    .min(0, "Use 0 or greater.")
    .max(100, "Use 100 or less.")
    .refine(
      (value) => Math.abs(value * 10 - Math.round(value * 10)) < 1e-8,
      "Use at most one decimal place.",
    ),
);

export const propertyUnitSchema = z.object({
  property_id: z.string().uuid("Choose a valid property."),
  unit_number: requiredText("unit number or name", 80),
  floor: optionalInteger("floor", -20, 500),
  bedrooms: optionalInteger("bedrooms", 0, 100),
  bathrooms: optionalBathroomCount,
  default_rent_php: z
    .string()
    .trim()
    .regex(
      /^\d+(?:\.\d{1,2})?$/,
      "Enter a non-negative PHP amount with up to 2 decimals.",
    )
    .transform(Number)
    .refine(
      (value) => value <= 9_999_999_999.99,
      "Use a PHP amount within the supported range.",
    ),
  description: z
    .string()
    .trim()
    .max(2000, "Use 2000 characters or fewer.")
    .transform((value) => value || null),
  operational_status: z.enum(["active", "maintenance", "inactive"]),
});

export type PropertyUnitFormValues = z.input<typeof propertyUnitSchema>;
export type PropertyUnitData = z.output<typeof propertyUnitSchema>;

export const emptyPropertyUnitForm: PropertyUnitFormValues = {
  property_id: "",
  unit_number: "",
  floor: "",
  bedrooms: "",
  bathrooms: "",
  default_rent_php: "0.00",
  description: "",
  operational_status: "active",
};
