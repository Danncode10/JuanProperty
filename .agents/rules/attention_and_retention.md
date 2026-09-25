# Attention & Retention Rule

> **Trigger**: This rule applies to ALL agents when a user provides a multi-part prompt, a list of corrections, or explicit requirements.

## The Problem
Agents tend to focus on the "big picture" of a refactoring or architectural task and drop smaller, explicit user requirements (e.g., specific CLI commands, formatting rules, or small logic changes). This causes severe user frustration.

## The Mandate
1. **The Requirement Extraction Check**: When you receive a prompt with multiple instructions or corrections, you MUST explicitly extract all of them into a mental checklist during your thought process.
2. **The Verification Halt**: Before calling any `multi_replace_file_content` or `write_to_file` tool, you MUST verify your planned code changes against every single item on that extracted checklist.
3. **No Skimming**: Do not assume that fixing the "core architecture" excuses you from implementing the smaller formatting, output, or CLI requirements the user explicitly requested.
4. **Explicit Acknowledgment**: In your response to the user, briefly confirm that you have addressed *each* of their specific points, so they know you didn't drop anything.
