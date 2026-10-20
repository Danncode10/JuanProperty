import { z } from "zod";

const requiredText = (label: string, maximumLength: number) =>
  z
    .string()
    .trim()
    .min(1, `Enter a ${label}.`)
    .max(maximumLength, `Use ${maximumLength} characters or fewer.`);

export const propertySchema = z.object({
  name: requiredText("property name", 160),
  property_type: requiredText("property type", 80),
  address: requiredText("property address", 500),
  primary_owner_id: z.string().uuid("Choose a valid primary owner."),
  description: z
    .string()
    .trim()
    .max(2000, "Use 2000 characters or fewer.")
    .transform((value) => value || null),
});

export type PropertyFormValues = z.input<typeof propertySchema>;
export type PropertyData = z.output<typeof propertySchema>;

export const emptyPropertyForm: PropertyFormValues = {
  name: "",
  property_type: "",
  address: "",
  primary_owner_id: "",
  description: "",
};
