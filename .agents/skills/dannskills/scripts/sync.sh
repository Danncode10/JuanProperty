#!/bin/bash
# .agents/skills/dannskills/scripts/sync.sh
# Strict Zero-Hallucination Synchronizer script for DannSkills

if [ "$#" -ne 2 ]; then
    echo "❌ CRITICAL FAILURE: You must provide exactly two arguments: <source_dir> <target_dir>"
    exit 1
fi

SOURCE_DIR=$1
TARGET_DIR=$2
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Source directory does not exist: $SOURCE_DIR"
    exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Target directory does not exist: $TARGET_DIR"
    exit 1
fi

echo "🔄 Starting Strict AI Architecture Sync..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"
echo ""

# Strict 1-to-1 Mirrors (Directories)
DIRECTORIES=(".agents" ".claude" ".claude-flow" ".codex" ".github" ".husky" "scripts" "docs/dannflow_docs")

for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "$SOURCE_DIR/$DIR" ]; then
        echo "Mirroring directory: $DIR..."
        mkdir -p "$TARGET_DIR/$(dirname "$DIR")"
        rsync -a --delete "$SOURCE_DIR/$DIR/" "$TARGET_DIR/$DIR/"
    else
        echo "⚠️ Warning: $DIR not found in source, skipping."
    fi
done

# Strict 1-to-1 Mirrors (Files)
FILES=("CLAUDE.md" "SKILLS.md" ".mcp.json" ".claude.json" "mcp.example.json")

for FILE in "${FILES[@]}"; do
    if [ -f "$SOURCE_DIR/$FILE" ]; then
        echo "Mirroring file: $FILE..."
        mkdir -p "$TARGET_DIR/$(dirname "$FILE")"
        cp "$SOURCE_DIR/$FILE" "$TARGET_DIR/$FILE"
    else
        echo "⚠️ Warning: $FILE not found in source, skipping."
    fi
done

# Special AGENTS.md injection
if [ -f "$SKILL_DIR/templates/generic_AGENTS.md" ]; then
    echo "Injecting generic AGENTS.md..."
    cp "$SKILL_DIR/templates/generic_AGENTS.md" "$TARGET_DIR/AGENTS.md"
else
    echo "⚠️ Warning: generic_AGENTS.md template not found!"
fi

echo ""
echo "✅ AI Architecture Sync Complete!"
echo "NOTE: package.json, src/, and supabase/ were ignored."
echo "These must be manually diffed and applied by the Agent."
