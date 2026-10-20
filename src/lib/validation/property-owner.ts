import { z } from "zod";

const nullableText = (maximumLength: number) =>
  z
    .string()
    .trim()
    .max(maximumLength, `Use ${maximumLength} characters or fewer.`)
    .transform((value) => value || null);

export const propertyOwnerSchema = z.object({
  owner_type: z.enum(["individual", "company"]),
  name: z
    .string()
    .trim()
    .min(1, "Enter a name.")
    .max(160, "Use 160 characters or fewer."),
  contact_person: nullableText(160),
  email: z
    .string()
    .trim()
    .max(254, "Use 254 characters or fewer.")
    .refine(
      (value) =>
        value.length === 0 || z.string().email().safeParse(value).success,
      "Enter a valid email address.",
    )
    .transform((value) => value || null),
  phone: nullableText(40),
  address: nullableText(500),
  description: nullableText(1000),
  notes: nullableText(2000),
});

export type PropertyOwnerFormValues = z.input<typeof propertyOwnerSchema>;
export type PropertyOwnerData = z.output<typeof propertyOwnerSchema>;

export const emptyPropertyOwnerForm: PropertyOwnerFormValues = {
  owner_type: "individual",
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  description: "",
  notes: "",
};
