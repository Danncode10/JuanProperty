import { Building2, FileText, Wrench } from "lucide-react";

const ROADMAP_AREAS = [
  {
    icon: Building2,
    title: "Owners, properties, and units",
    description:
      "Keep property ownership and unit details organized within an organization's portfolio.",
  },
  {
    icon: FileText,
    title: "Tenants, leases, and rent",
    description:
      "The Phase 1 plan covers tenant records, lease terms, rent obligations, and payment history.",
  },
  {
    icon: Wrench,
    title: "Maintenance and portfolio view",
    description:
      "Track maintenance requests and review core operating activity in one place.",
  },
];

export function FeaturesTabs() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ROADMAP_AREAS.map(({ icon: Icon, title, description }) => (
        <article
          key={title}
          className="rounded-2xl border border-border bg-card p-6 md:p-7"
        >
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted text-primary">
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <p className="mb-3 text-xs font-medium text-primary">
            Phase 1 roadmap
          </p>
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </article>
      ))}
    </div>
  );
}
