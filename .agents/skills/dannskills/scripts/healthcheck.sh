#!/bin/bash
# .agents/skills/dannskills/scripts/healthcheck.sh

if [ "$#" -ne 2 ]; then
    echo "❌ CRITICAL FAILURE: You must provide exactly two arguments: <dannflow_dir> <integrated_dir>"
    exit 1
fi

TEMPLATE_DIR=$1
CHILD_DIR=$2

if [ ! -d "$TEMPLATE_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Template directory does not exist: $TEMPLATE_DIR"
    exit 1
fi

if [ ! -d "$CHILD_DIR" ]; then
    echo "❌ CRITICAL FAILURE: Integrated directory does not exist: $CHILD_DIR"
    exit 1
fi

echo "🔍 Starting DannSkills Healthcheck Audit..."
echo "DannFlow Source: $TEMPLATE_DIR"
echo "Integrated App: $CHILD_DIR"
echo ""

echo "=========================================================="
echo "🔴 CORE ARCHITECTURE AUDIT (Strict 1-to-1 Mirrors)"
echo "=========================================================="
DIRECTORIES=(".agents" ".claude" ".claude-flow" ".codex" ".github" ".husky" "scripts" "docs/dannflow_docs")
for DIR in "${DIRECTORIES[@]}"; do
    if [ -d "$TEMPLATE_DIR/$DIR" ]; then
        if [ -d "$CHILD_DIR/$DIR" ]; then
            DIFF_OUT=$(diff -r -q "$TEMPLATE_DIR/$DIR" "$CHILD_DIR/$DIR" 2>/dev/null | grep -v "Only in")
            if [ -n "$DIFF_OUT" ]; then
                echo "⚠️  $DIR has differences:"
                echo "$DIFF_OUT"
            fi
        else
            echo "❌ $DIR is missing in Integrated App"
        fi
    fi
done

FILES=("CLAUDE.md" "SKILLS.md" ".mcp.json" ".claude.json" "mcp.example.json")
for FILE in "${FILES[@]}"; do
    if [ -f "$TEMPLATE_DIR/$FILE" ]; then
        if [ -f "$CHILD_DIR/$FILE" ]; then
            if ! cmp -s "$TEMPLATE_DIR/$FILE" "$CHILD_DIR/$FILE"; then
                echo "⚠️  $FILE is different"
            fi
        else
            echo "❌ $FILE is missing in Integrated App"
        fi
    fi
done

echo ""
echo "=========================================================="
echo "🧠 AGENT BRAIN AUDIT (AGENTS.md)"
echo "=========================================================="
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -f "$SKILL_DIR/templates/generic_AGENTS.md" ]; then
    if [ -f "$CHILD_DIR/AGENTS.md" ]; then
        if ! cmp -s "$SKILL_DIR/templates/generic_AGENTS.md" "$CHILD_DIR/AGENTS.md"; then
            echo "⚠️  AGENTS.md has drifted from the generic template."
        else
            echo "🟢 AGENTS.md matches the generic template perfectly."
        fi
    else
        echo "❌ AGENTS.md is missing in Integrated App"
    fi
fi

echo ""
echo "✅ Healthcheck complete."
