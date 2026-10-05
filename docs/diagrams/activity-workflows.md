# 🔄 Activity & Workflow Diagrams

This document contains key workflow and activity diagrams illustrating core operations in **DannFlow**.

---

## 1. Google OAuth & Profile Bootstrapping Workflow

```mermaid
flowchart TD
    A["👤 User initiates Google OAuth"] --> B["Next.js server stores PKCE verifier"]
    B --> C["⚡ Google and Supabase authenticate user"]
    C -->|Failure| D["❌ Return safe auth error to login"]
    C -->|Success| E["App callback exchanges code and flow ID"]
    E --> F["Postgres trigger creates `public.profiles` row"]
    F --> G["Generate authenticated session cookies"]
    G --> H["Dashboard guard reads owner profile under RLS"]
    H --> I["Render protected dashboard"]
```

---

## 2. Masterplan Task & Documentation Lifecycle Workflow

```mermaid
flowchart TD
    Start["📋 User requests Feature / Task"] --> SearchPlan["🔍 Agent checks MASTERPLAN.md & GitHub Project"]

    SearchPlan --> TaskExists{"Task exists in Masterplan?"}
    TaskExists -- No --> WarnUser["⚠️ Warn user & add task to MASTERPLAN.md"]
    WarnUser --> MoveInProgress
    TaskExists -- Yes --> MoveInProgress["📌 Move task to 'In progress' on GitHub Board"]

    MoveInProgress --> EditCode["💻 Implement changes in Service Layer & UI"]
    EditCode --> LogPending["📝 Log change in `docs/PENDING_DOC_UPDATES.md`"]

    LogPending --> CommitCode["💾 Commit Code (`git commit`)"]
    CommitCode --> CommitHook{"🛡️ `commit-msg` Hook Check"}
    CommitHook -- "No docs staged & no bypass" --> BlockCommit["❌ Commit BLOCKED!"]
    CommitHook -- "Ledger staged OR 'No docs needed'" --> PassCommit["✅ Implementation Committed"]

    PassCommit --> VerifyTask["🧪 Run `/verify-task` (Human verification)"]
    VerifyTask --> CloseTask["🚀 Run `/close-task`"]

    CloseTask --> UpdateRealDocs["📚 Update `docs/` & `docs/diagrams/`"]
    UpdateRealDocs --> ClearLedger["🧹 Clear `docs/PENDING_DOC_UPDATES.md`"]
    ClearLedger --> DocsCommit["🎉 Auto-commit `docs(pX.y): ...`"]
    DocsCommit --> TrackingCommit["📌 Mark `[x]` & GitHub card to `Done`"]

    TrackingCommit --> PushMain["🚀 Push to `main`"]
    PushMain --> PrePushHook{"🛡️ `pre-push` Hook Check"}
    PrePushHook -- "Ledger not empty" --> BlockPush["❌ Push to `main` BLOCKED!"]
    PrePushHook -- "Ledger clean" --> PushSuccess["✅ Shipped cleanly to `main`!"]
```

---

## 3. Database Migration & Type Sync Workflow

```mermaid
flowchart TD
    A["✏️ Developer edits schema / SQL in `supabase/migrations/`"] --> B["🚀 Run `npm run db:migrate`"]
    B --> C["Supabase CLI pushes SQL to remote PostgreSQL DB"]
    C --> D["⚡ Run `npm run db:types`"]
    D --> E["Supabase CLI generates TypeScript definitions"]
    E --> F["🔄 Refresh `src/types/supabase.ts`"]
    F --> G["🔒 Service Layer (`src/services/`) consumes strict types"]
```

---

## 4. AI Secretary Conversation Lifecycle & Real-Time Sync Workflow

```mermaid
flowchart TD
    UserPrompt["💬 User types prompt & hits Send"] --> ClientSubmit["Client calls `sendMessage({ body: { id: chatId } })`"]
    ClientSubmit --> OptMutate["⚡ Trigger SWR revalidation (`status === 'submitted'`)"]
    OptMutate --> SidebarNew["📑 New Chat session title pops up in Sidebar"]

    ClientSubmit --> PostRoute["📡 POST /api/chat"]
    PostRoute --> EnsureChat["🛠️ `createOrGetChat(chatId, title)`"]
    EnsureChat --> SaveUserMsg["💾 `saveChatMessage(chatId, 'user', parts)`"]
    SaveUserMsg --> StreamEngine["🤖 AI SDK `streamText` + Dynamic Tools"]

    StreamEngine --> StreamTokens["🌊 Real-time token streaming to viewport"]
    StreamEngine --> OnFinish["🏁 `onFinish` event triggers"]
    OnFinish --> SaveAssistantMsg["💾 `saveChatMessage(chatId, 'assistant', parts)`"]
    SaveAssistantMsg --> FinalMutate["🔄 `mutateHistory()` refreshes chat title & timestamp"]
    FinalMutate --> ActiveHighlight["✨ Session highlighted in Chat History"]
```
