#!/bin/bash
# .agents/skills/dannflow-synchronizer/scripts/sync.sh
# Strict Zero-Hallucination Synchronizer script

if [ "$#" -ne 2 ]; then
    echo "❌ CRITICAL FAILURE: You must provide exactly two arguments: <source_dir> <target_dir>"
    exit 1
fi

SOURCE_DIR=$1
TARGET_DIR=$2

if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Source directory does not exist: $SOURCE_DIR"
    exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Target directory does not exist: $TARGET_DIR"
    exit 1
fi

echo "🔄 Starting Strict Zero-Hallucination Sync..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"
echo ""

# Strict 1-to-1 Mirrors (Directories)
DIRECTORIES=(".agents" ".claude" ".claude-flow" ".codex" ".github" ".husky" "scripts" "docs/dannflow_docs" "docs/ecc-guides" "docs/ecc")

for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "$SOURCE_DIR/$DIR" ]; then
        echo "Mirroring directory: $DIR..."
        mkdir -p "$TARGET_DIR/$(dirname "$DIR")"
        # Use rsync to delete old files in target and enforce 1-to-1 mirror
        rsync -a --delete "$SOURCE_DIR/$DIR/" "$TARGET_DIR/$DIR/"
    else
        echo "⚠️ Warning: $DIR not found in source, skipping."
    fi
done

# Strict 1-to-1 Mirrors (Files)
FILES=("AGENTS.md" "CLAUDE.md" "SKILLS.md" ".mcp.json" ".claude.json" "mcp.example.json")

for FILE in "${FILES[@]}"; do
    if [ -f "$SOURCE_DIR/$FILE" ]; then
        echo "Mirroring file: $FILE..."
        mkdir -p "$TARGET_DIR/$(dirname "$FILE")"
        cp "$SOURCE_DIR/$FILE" "$TARGET_DIR/$FILE"
    else
        echo "⚠️ Warning: $FILE not found in source, skipping."
    fi
done

echo ""
echo "✅ Strict Core Sync Complete!"
echo "NOTE: package.json, .github/workflows/ci.yml, src/, and supabase/ were ignored."
echo "These must be manually diffed and applied by the Agent."
