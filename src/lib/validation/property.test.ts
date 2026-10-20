import { describe, expect, it } from "vitest";
import { propertySchema } from "./property";

const validProperty = {
  name: "Cedar Court Residences",
  property_type: "Apartment",
  address: "18 Sampaguita Street, Cebu City",
  primary_owner_id: "e1670a51-8e24-4235-83ce-0b0ee4b2cdf8",
  description: "A mid-rise residential building.",
};

describe("propertySchema", () => {
  it("accepts a complete property and trims text fields", () => {
    const result = propertySchema.parse({
      ...validProperty,
      name: "  Cedar Court Residences  ",
      description: "  A mid-rise residential building.  ",
    });

    expect(result.name).toBe("Cedar Court Residences");
    expect(result.description).toBe("A mid-rise residential building.");
  });

  it("rejects missing required property details and an invalid owner id", () => {
    const result = propertySchema.safeParse({
      ...validProperty,
      name: "  ",
      address: "",
      primary_owner_id: "not-a-uuid",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes an empty optional description to null", () => {
    const result = propertySchema.parse({ ...validProperty, description: " " });

    expect(result.description).toBeNull();
  });
});
