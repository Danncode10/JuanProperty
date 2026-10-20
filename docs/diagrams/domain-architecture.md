# 🏗️ Domain & Service Architecture Diagram

This diagram maps the structural relationships between Next.js UI Components, the **Service Layer** (`src/services/`), TypeScript Definitions (`src/types/`), and Supabase Backend Entities.

---

## Mermaid Domain Architecture Diagram

> The legacy class diagram below includes template-era sample entities. For the current JuanProperty Phase 1 implementation, the authoritative domain slice is Organization → Property Owner → Property; later entities remain planned.

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ PROPERTY_OWNERS : scopes
    ORGANIZATIONS ||--o{ PROPERTIES : scopes
    PROPERTY_OWNERS ||--o{ PROPERTIES : primary_owner
    PROPERTIES ||--o{ PROPERTY_UNITS : contains
    ORGANIZATIONS {
        uuid id PK
        uuid owner_id FK
    }
    PROPERTY_OWNERS {
        uuid id PK
        uuid organization_id FK
        text owner_type "individual or company"
        text name
        text contact_person "optional"
        text email "optional"
        text phone "optional"
        text address "optional"
        text description "optional"
        text notes "optional"
        timestamptz archived_at "nullable; archive/restore"
        timestamptz created_at
        timestamptz updated_at
    }
    PROPERTIES {
        uuid id PK
        uuid organization_id FK
        uuid primary_owner_id FK
        text name
        text property_type
        text address
        text description "optional"
        timestamptz archived_at "nullable; archive/restore"
        timestamptz created_at
        timestamptz updated_at
    }
    PROPERTY_UNITS {
        uuid id PK
        uuid organization_id FK
        uuid property_id FK
        text unit_number
        integer floor "optional"
        integer bedrooms "optional"
        numeric bathrooms "optional"
        numeric default_rent_php
        text operational_status "active, maintenance, inactive"
        timestamptz archived_at "nullable; archive/restore"
        timestamptz created_at
        timestamptz updated_at
    }
```

`properties` carries `organization_id` and `primary_owner_id`; a composite foreign key requires the selected Property Owner to belong to the same organization. `property_units` carries its organization and property IDs with a composite foreign key to ensure the same boundary, and a case-insensitive unique index protects unit identity within a property. All three tables use organization-owner RLS and authenticated SELECT/INSERT/UPDATE privileges only; `anon` has no table access, and authenticated users have no DELETE or TRUNCATE privilege. Services derive the organization from the authenticated session rather than accepting an organization identifier from the UI. Units have operational state and default rent only; future Lease records determine occupancy and preserve agreed rental amounts.

```mermaid
classDiagram
    %% UI Components Layer
    class NextJS_AppPage {
        +ServerComponent page.tsx
        +ClientComponent form.tsx
        +renders UI via Shadcn
    }

    %% Service Layer (Business Logic + DB Access)
    class AuthService {
        +getUserSession()
        +signOut()
    }

    class ProfileService {
        +getProfile(userId: string)
        +updateProfile(userId: string, data: ProfileUpdate)
    }

    class AiChatService {
        +createOrGetChat(chatId, title)
        +listUserChats(page, limit)
        +saveChatMessage(chatId, role, parts)
        +deleteUserChat(chatId)
    }

    class PropertyService {
        +listProjects(orgId)
        +getParcelDetails(parcelId)
        +updateParcelCoordinates(parcelId, lat, lng, polygon)
    }

    class TitleVaultService {
        +uploadDocument(parcelId, file, docType)
        +verifyDocument(documentId, status)
    }

    class BirTaxService {
        +calculateCWT(amount, rate)
        +logTaxFiling(transactionId, formType, amount)
    }

    class ServiceLayerBoundary {
        <<Interface>>
        +All DB queries isolated here
        +No direct DB calls from UI
    }

    %% Type Layer
    class SupabaseTypes {
        <<Generated>>
        +Database schema interface
        +Tables, Enums, Functions
    }

    %% Backend Entities (Supabase PostgreSQL)
    class OrganizationsTable {
        +uuid id PK
        +uuid owner_id FK
        +text name
        +timestamptz created_at
    }

    class ProjectsTable {
        +uuid id PK
        +uuid organization_id FK
        +text name
        +text location
        +text status
    }

    class ParcelsTable {
        +uuid id PK
        +uuid project_id FK
        +uuid organization_id FK
        +text lot_number
        +numeric area_sqm
        +numeric latitude
        +numeric longitude
        +jsonb boundary_coordinates
        +text status
    }

    class TitleDocumentsTable {
        +uuid id PK
        +uuid parcel_id FK
        +text document_type
        +text document_number
        +text storage_path
        +text verification_status
    }

    class OwnersTable {
        +uuid id PK
        +uuid organization_id FK
        +text full_name
        +text contact_number
        +text tin
    }

    class AgentsTable {
        +uuid id PK
        +uuid organization_id FK
        +text full_name
        +text prc_license_number
        +text dhsud_number
        +text phone
    }

    class BirTaxRecordsTable {
        +uuid id PK
        +uuid organization_id FK
        +uuid parcel_id FK
        +text form_type
        +numeric tax_due
        +date deadline
    }

    class ProfilesTable {
        +uuid id PK
        +timestamp updated_at
        +text username
        +text full_name
    }

    class AuthUsersTable {
        +uuid id PK
        +string email
        +timestamp created_at
    }

    %% Relationships
    NextJS_AppPage --> AuthService : invokes
    NextJS_AppPage --> PropertyService : invokes
    NextJS_AppPage --> TitleVaultService : invokes
    NextJS_AppPage --> BirTaxService : invokes

    AuthService ..|> ServiceLayerBoundary
    PropertyService ..|> ServiceLayerBoundary
    TitleVaultService ..|> ServiceLayerBoundary
    BirTaxService ..|> ServiceLayerBoundary

    PropertyService --> SupabaseTypes : uses strict types
    TitleVaultService --> SupabaseTypes : uses strict types
    BirTaxService --> SupabaseTypes : uses strict types

    SupabaseTypes --> OrganizationsTable : maps schema
    SupabaseTypes --> ProjectsTable : maps schema
    SupabaseTypes --> ParcelsTable : maps schema
    SupabaseTypes --> TitleDocumentsTable : maps schema
    SupabaseTypes --> OwnersTable : maps schema
    SupabaseTypes --> AgentsTable : maps schema
    SupabaseTypes --> BirTaxRecordsTable : maps schema
    SupabaseTypes --> ProfilesTable : maps schema
    SupabaseTypes --> AuthUsersTable : maps schema

    AuthUsersTable "1" -- "1" ProfilesTable : triggers on insert
    AuthUsersTable "1" -- "1" OrganizationsTable : triggers on insert
    OrganizationsTable "1" -- "*" ProjectsTable : tenant boundary
    OrganizationsTable "1" -- "*" OwnersTable : tenant boundary
    OrganizationsTable "1" -- "*" AgentsTable : tenant boundary
    ProjectsTable "1" -- "*" ParcelsTable : contains
    ParcelsTable "1" -- "*" TitleDocumentsTable : document vault
    ParcelsTable "1" -- "*" BirTaxRecordsTable : tax tracking
```

---

## Architectural Guidelines

1. **UI Layer Isolation**: Next.js pages and Shadcn components inside `src/app/` and `src/components/` must **never** call `supabase.from(...)` directly.
2. **Service Layer Responsibility**: All CRUD operations, tenant isolation checks, and business rules belong exclusively in `src/services/`.
3. **Type Contracts**: Functions in `src/services/` import data types strictly from `src/types/supabase.ts` (auto-generated via `npm run db:types`).
