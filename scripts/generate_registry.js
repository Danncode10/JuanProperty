const fs = require('fs');
const path = require('path');

const skillsDir = path.join(process.cwd(), '.agents/skills');
const registryPath = path.join(process.cwd(), 'docs/dannflow_docs/SKILL_REGISTRY.md');

let registryContent = '# AI Skill Registry\n\n> **AI INSTRUCTION:** ALWAYS read this registry before deciding which skill or agent to use. Do not hallucinate skill names. If a skill does not exist here, it does not exist.\n\n## Available Skills\n\n';

let count = 0;
const traverse = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (file === 'SKILL.md') {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*(.+)$/m);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const desc = descMatch ? descMatch[1].trim() : 'No description provided.';
        registryContent += `- **${name}**: ${desc}\n`;
        count++;
      }
    }
  }
};

traverse(skillsDir);
fs.writeFileSync(registryPath, registryContent);
console.log(`Successfully generated SKILL_REGISTRY.md with ${count} skills.`);
