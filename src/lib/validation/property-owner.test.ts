import { describe, expect, it } from "vitest";
import { emptyPropertyOwnerForm, propertyOwnerSchema } from "./property-owner";

describe("propertyOwnerSchema", () => {
  it("accepts an individual and normalizes optional blank fields", () => {
    const result = propertyOwnerSchema.parse({
      ...emptyPropertyOwnerForm,
      owner_type: "individual",
      name: "  Maria Santos  ",
      email: "",
    });

    expect(result.name).toBe("Maria Santos");
    expect(result.email).toBeNull();
    expect(result.contact_person).toBeNull();
  });

  it("accepts a company and contact details", () => {
    const result = propertyOwnerSchema.parse({
      ...emptyPropertyOwnerForm,
      owner_type: "company",
      name: "Santos Holdings, Inc.",
      contact_person: "Ana Santos",
      email: "ana@example.com",
    });

    expect(result.owner_type).toBe("company");
    expect(result.contact_person).toBe("Ana Santos");
  });

  it("rejects an empty name, unsupported owner type, and malformed email", () => {
    expect(
      propertyOwnerSchema.safeParse({
        ...emptyPropertyOwnerForm,
        name: "  ",
      }).success,
    ).toBe(false);
    expect(
      propertyOwnerSchema.safeParse({
        ...emptyPropertyOwnerForm,
        owner_type: "partnership",
        name: "Example",
      }).success,
    ).toBe(false);
    expect(
      propertyOwnerSchema.safeParse({
        ...emptyPropertyOwnerForm,
        name: "Example",
        email: "not-an-email",
      }).success,
    ).toBe(false);
  });
});
