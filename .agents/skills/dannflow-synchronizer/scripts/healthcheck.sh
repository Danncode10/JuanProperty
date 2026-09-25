#!/bin/bash
# .agents/skills/dannflow-synchronizer/scripts/healthcheck.sh
# Healthcheck / Audit script to compare DannFlow Template and Child App

if [ "$#" -ne 2 ]; then
    echo "❌ CRITICAL FAILURE: You must provide exactly two arguments: <template_dir> <child_dir>"
    exit 1
fi

TEMPLATE_DIR=$1
CHILD_DIR=$2

if [ ! -d "$TEMPLATE_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Template directory does not exist: $TEMPLATE_DIR"
    exit 1
fi

if [ ! -d "$CHILD_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Child directory does not exist: $CHILD_DIR"
    exit 1
fi

echo "🔍 Starting DannFlow Healthcheck Audit..."
echo "Template: $TEMPLATE_DIR"
echo "Child App: $CHILD_DIR"
echo ""

echo "=========================================================="
echo "🔴 CORE ARCHITECTURE AUDIT (Strict 1-to-1 Mirrors)"
echo "=========================================================="
# Directories
DIRECTORIES=(".agents" ".claude" ".claude-flow" ".codex" ".github" ".husky" "scripts" "docs/dannflow_docs" "docs/ecc-guides" "docs/ecc")
for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "$TEMPLATE_DIR/$DIR" ]; then
        if [ -d "$CHILD_DIR/$DIR" ]; then
            DIFF_OUT=$(diff -r -q "$TEMPLATE_DIR/$DIR" "$CHILD_DIR/$DIR" 2>/dev/null | grep -v "Only in")
            if [ -n "$DIFF_OUT" ]; then
                echo "⚠️  $DIR has differences:"
                echo "$DIFF_OUT"
            fi
        else
            echo "❌ $DIR is missing in Child App"
        fi
    fi
done

# Files
FILES=("AGENTS.md" "CLAUDE.md" "SKILLS.md" ".mcp.json" ".claude.json" "mcp.example.json")
for FILE in "${FILES[@]}"; do
    if [ -f "$TEMPLATE_DIR/$FILE" ]; then
        if [ -f "$CHILD_DIR/$FILE" ]; then
            if ! cmp -s "$TEMPLATE_DIR/$FILE" "$CHILD_DIR/$FILE"; then
                echo "⚠️  $FILE is different"
            fi
        else
            echo "❌ $FILE is missing in Child App"
        fi
    fi
done

echo ""
echo "=========================================================="
echo "🟡 BUSINESS LOGIC AUDIT (Manual Merges Expected)"
echo "=========================================================="
BUSINESS_DIRS=("src" "supabase")
for BDIR in "${BUSINESS_DIRS[@]}"; do
    if [ -d "$TEMPLATE_DIR/$BDIR" ] && [ -d "$CHILD_DIR/$BDIR" ]; then
        echo "Checking $BDIR/ drift:"
        git diff --no-index --stat "$TEMPLATE_DIR/$BDIR" "$CHILD_DIR/$BDIR" 2>/dev/null
    else
        echo "ℹ️  $BDIR not present in both, skipping stat diff."
    fi
done

BUSINESS_FILES=("package.json" "next.config.ts" "tsconfig.json" "tailwind.config.ts")
for BFILE in "${BUSINESS_FILES[@]}"; do
    if [ -f "$TEMPLATE_DIR/$BFILE" ] && [ -f "$CHILD_DIR/$BFILE" ]; then
        if ! cmp -s "$TEMPLATE_DIR/$BFILE" "$CHILD_DIR/$BFILE"; then
            echo "⚠️  $BFILE has drifted."
        fi
    fi
done

echo ""
echo "✅ Healthcheck complete."
