import { describe, expect, it } from "vitest";
import { emptyPropertyUnitForm, propertyUnitSchema } from "./property-unit";

const propertyId = "550e8400-e29b-41d4-a716-446655440000";

describe("propertyUnitSchema", () => {
  it("normalizes a complete unit and parses numeric form values", () => {
    const result = propertyUnitSchema.parse({
      ...emptyPropertyUnitForm,
      property_id: propertyId,
      unit_number: "  A-101  ",
      floor: "1",
      bedrooms: "2",
      bathrooms: "1.5",
      default_rent_php: "12500.50",
      description: "  Corner unit  ",
      operational_status: "active",
    });

    expect(result).toEqual({
      property_id: propertyId,
      unit_number: "A-101",
      floor: 1,
      bedrooms: 2,
      bathrooms: 1.5,
      default_rent_php: 12500.5,
      description: "Corner unit",
      operational_status: "active",
    });
  });

  it("converts blank optional numeric fields and descriptions to null", () => {
    const result = propertyUnitSchema.parse({
      ...emptyPropertyUnitForm,
      property_id: propertyId,
      unit_number: "Studio",
    });

    expect(result.floor).toBeNull();
    expect(result.bedrooms).toBeNull();
    expect(result.bathrooms).toBeNull();
    expect(result.description).toBeNull();
  });

  it("rejects blank unit names and invalid properties", () => {
    const result = propertyUnitSchema.safeParse({
      ...emptyPropertyUnitForm,
      property_id: "not-a-uuid",
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative, over-precision, or out-of-range default rent values", () => {
    for (const default_rent_php of [
      "-1",
      "12.345",
      "10000000000",
      "",
    ] as const) {
      expect(
        propertyUnitSchema.safeParse({
          ...emptyPropertyUnitForm,
          property_id: propertyId,
          unit_number: "A-101",
          default_rent_php,
        }).success,
      ).toBe(false);
    }
  });

  it("rejects fractional bedrooms and unsupported operational states", () => {
    for (const values of [
      { bedrooms: "1.5" },
      { operational_status: "occupied" },
    ]) {
      expect(
        propertyUnitSchema.safeParse({
          ...emptyPropertyUnitForm,
          property_id: propertyId,
          unit_number: "A-101",
          ...values,
        }).success,
      ).toBe(false);
    }
  });
});
