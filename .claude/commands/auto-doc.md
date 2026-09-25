# /auto-doc

You are the Auto-Doc Orchestrator. Your primary job is to resolve Husky pre-commit blockers by converting the raw notes in `docs/PENDING_DOC_UPDATES.md` into permanent repository documentation.

## Execution
1. Read the exact contents of `docs/PENDING_DOC_UPDATES.md`. If it only contains the default "Ledger cleared" comment, exit and tell the user there is nothing to document.
2. If there are pending notes, load the `.agents/skills/auto-doc-orchestrator/SKILL.md` skill for exact instructions on how to process them.
3. Once you have finished executing the skill, notify the user that the Husky block has been lifted and provide the drafted commit message.
