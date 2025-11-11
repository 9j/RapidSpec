#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { select } from "@inquirer/prompts";
import {
  readFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readdirSync,
  renameSync,
} from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Markers for managed blocks
const RAPIDSPEC_MARKERS = {
  start: "<!-- RAPIDSPEC:START -->",
  end: "<!-- RAPIDSPEC:END -->",
};

// Technology stack configurations
const TECH_STACKS = {
  "nextjs-supabase": {
    name: "Next.js + Supabase",
    description: "Full-stack React with Supabase backend",
    agents: ["nextjs-expert.md", "supabase-expert.md", "database-expert.md"],
    includeDatabase: true
  },
  "nextjs-only": {
    name: "Next.js Only",
    description: "Next.js without database",
    agents: ["nextjs-expert.md"],
    includeDatabase: false
  }
};

// Update file with markers (OpenSpec pattern)
function updateFileWithMarkers(filePath: string, content: string): void {
  let existingContent = "";

  if (existsSync(filePath)) {
    existingContent = readFileSync(filePath, "utf-8");

    const startIndex = existingContent.indexOf(RAPIDSPEC_MARKERS.start);
    const endIndex = existingContent.indexOf(
      RAPIDSPEC_MARKERS.end,
      startIndex + RAPIDSPEC_MARKERS.start.length,
    );

    if (startIndex !== -1 && endIndex !== -1) {
      // Replace content between markers
      const before = existingContent.substring(0, startIndex);
      const after = existingContent.substring(
        endIndex + RAPIDSPEC_MARKERS.end.length,
      );
      existingContent =
        before +
        RAPIDSPEC_MARKERS.start +
        "\n" +
        content +
        "\n" +
        RAPIDSPEC_MARKERS.end +
        after;
    } else if (startIndex === -1 && endIndex === -1) {
      // Prepend to existing content
      existingContent =
        RAPIDSPEC_MARKERS.start +
        "\n" +
        content +
        "\n" +
        RAPIDSPEC_MARKERS.end +
        "\n\n" +
        existingContent;
    } else {
      throw new Error(`Invalid marker state in ${filePath}`);
    }
  } else {
    // New file
    existingContent =
      RAPIDSPEC_MARKERS.start + "\n" + content + "\n" + RAPIDSPEC_MARKERS.end;
  }

  writeFileSync(filePath, existingContent, "utf-8");
}

// Filter content based on technology stack
function filterContentByStack(content: string, stackConfig: any): string {
  if (stackConfig.includeDatabase) {
    // Include database-related blocks
    return content;
  } else {
    // Remove database-related blocks and agent references
    let filtered = content;

    // Remove database-specific sections
    filtered = filtered.replace(/### Database.*?### \w+/gs, (match) => {
      if (match.includes('Database Migration') || match.includes('Database Schema')) {
        return '';
      }
      return match;
    });

    // Remove supabase-specific agent calls
    filtered = filtered.replace(/\b(supabase|database)-expert\b/g, '');

    // Remove database-related task references
    filtered = filtered.replace(/.*database.*migration.*\n/gi, '');
    filtered = filtered.replace(/.*supabase.*\n/gi, '');

    return filtered;
  }
}

// Root AGENTS.md stub template
const AGENTS_ROOT_STUB = `# RapidSpec Instructions

These instructions are for AI assistants working in this project.

Always open \`@/rapidspec/AGENTS.md\` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use \`@/rapidspec/AGENTS.md\` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines
- Project constitution and development principles
- Code quality standards and best practices

Keep this managed block so 'rapid init' can refresh the instructions.`;

const program = new Command();

// Get the directory where this CLI is installed
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, "..");

program
  .name("rapid")
  .description("RapidSpec - Spec-driven development for Claude Code")
  .version("0.3.1");

program
  .command("init [path]")
  .description("Initialize RapidSpec in your project")
  .option("--force", "Overwrite existing files")
  .option("--stack <stack>", "Technology stack (nextjs-supabase, nextjs-only)")
  .action(async (targetPath, options) => {
    const cwd = targetPath ? resolve(process.cwd(), targetPath) : process.cwd();

    console.log(chalk.blue("Initializing RapidSpec...\n"));

    // Check if already initialized
    const claudeMdPath = join(cwd, "CLAUDE.md");
    const rapidspecDir = join(cwd, "rapidspec");
    const agentsMdPath = join(rapidspecDir, "AGENTS.md");

    if (existsSync(claudeMdPath) && !options.force) {
      console.log(chalk.yellow("⚠️  CLAUDE.md already exists"));
      console.log(chalk.gray("Use --force to overwrite\n"));
      process.exit(1);
    }

    if (existsSync(agentsMdPath) && !options.force) {
      console.log(chalk.yellow("⚠️  rapidspec/AGENTS.md already exists"));
      console.log(chalk.gray("Use --force to overwrite\n"));
      process.exit(1);
    }

    // Technology stack selection
    let selectedStack = options.stack;
    if (!selectedStack) {
      console.log(chalk.bold("Select your technology stack:"));
      const stackChoices = Object.entries(TECH_STACKS).map(([key, stack]) => ({
        name: `${stack.name} - ${stack.description}`,
        value: key
      }));

      selectedStack = await select({
        message: "Choose your technology stack:",
        choices: stackChoices
      });
    }

    const stackConfig = TECH_STACKS[selectedStack as keyof typeof TECH_STACKS];
    if (!stackConfig) {
      console.log(chalk.red(`✗ Invalid stack: ${selectedStack}`));
      console.log(chalk.gray("Available stacks:", Object.keys(TECH_STACKS).join(", ")));
      process.exit(1);
    }

    console.log(chalk.green(`✓ Selected stack: ${stackConfig.name}\n`));

    // Create directory structure
    console.log(chalk.bold("Creating directories:"));
    const dirs = [
      "rapidspec",
      "rapidspec/specs",
      "rapidspec/changes",
      "rapidspec/changes/archive",
      ".rapidspec",
      ".rapidspec/templates",
      ".claude",
      ".claude/agents",
      ".claude/commands",
      ".claude/commands/rapidspec",
    ];

    for (const dir of dirs) {
      const dirPath = join(cwd, dir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
        console.log(chalk.green(`  ✓ ${dir}/`));
      } else {
        console.log(chalk.gray(`  ✓ ${dir}/ (exists)`));
      }
    }

    // Copy instruction files
    console.log(chalk.bold("\nCreating instruction files:"));

    // Root AGENTS.md (stub with markers)
    const rootAgentsPath = join(cwd, "AGENTS.md");
    updateFileWithMarkers(rootAgentsPath, AGENTS_ROOT_STUB);
    console.log(chalk.green(`  ✓ AGENTS.md (root stub)`));

    // CLAUDE.md (if exists)
    const claudeMdSrc = join(packageRoot, "templates", "CLAUDE.md");
    if (existsSync(claudeMdSrc)) {
      const claudeMdDest = join(cwd, "CLAUDE.md");
      copyFileSync(claudeMdSrc, claudeMdDest);
      console.log(chalk.green(`  ✓ CLAUDE.md`));
    }

    // rapidspec/AGENTS.md (detailed instructions)
    const agentsMdSrc = join(packageRoot, "templates", "AGENTS.md");
    if (existsSync(agentsMdSrc)) {
      const agentsMdDest = join(cwd, "rapidspec", "AGENTS.md");
      copyFileSync(agentsMdSrc, agentsMdDest);
      console.log(chalk.green(`  ✓ rapidspec/AGENTS.md (detailed)`));
    }

    // Copy agents (filtered by stack)
    console.log(chalk.bold("\nCopying agents:"));
    const agentsSrcDir = join(packageRoot, "agents");
    const agentsDestDir = join(cwd, ".claude", "agents");

    if (existsSync(agentsSrcDir)) {
      const allAgentFiles = readdirSync(agentsSrcDir).filter((f: string) =>
        f.endsWith(".md"),
      );

      // Filter agents based on selected stack
      const agentFiles = allAgentFiles.filter(file => {
        // Always include general agents
        if (file.includes("general") || file.includes("code-reviewer") || file.includes("architecture")) {
          return true;
        }
        // Include stack-specific agents
        return stackConfig.agents.includes(file);
      });

      for (const file of agentFiles) {
        const srcPath = join(agentsSrcDir, file);
        const destPath = join(agentsDestDir, file);
        copyFileSync(srcPath, destPath);
        console.log(chalk.green(`  ✓ .claude/agents/${file}`));
      }
      console.log(chalk.gray(`  Copied ${agentFiles.length} agent(s)`));
    } else {
      console.log(chalk.yellow("  ⚠️  No agents directory found"));
    }

    // Copy commands (filtered by stack)
    console.log(chalk.bold("\nCopying commands:"));
    const commandsSrcDir = join(packageRoot, "commands");
    const commandsDestDir = join(cwd, ".claude", "commands", "rapidspec");

    if (existsSync(commandsSrcDir)) {
      const commandFiles = readdirSync(commandsSrcDir).filter((f: string) =>
        f.endsWith(".md"),
      );
      for (const file of commandFiles) {
        const srcPath = join(commandsSrcDir, file);
        const destPath = join(commandsDestDir, file);

        // Read command content and filter based on stack
        let commandContent = readFileSync(srcPath, "utf-8");
        commandContent = filterContentByStack(commandContent, stackConfig);

        writeFileSync(destPath, commandContent, "utf-8");
        console.log(chalk.green(`  ✓ .claude/commands/rapidspec/${file}`));
      }
      console.log(chalk.gray(`  Copied ${commandFiles.length} command(s)`));
    } else {
      console.log(chalk.yellow("  ⚠️  No commands directory found"));
    }

    // Copy templates to .rapidspec
    console.log(chalk.bold("\nCopying templates:"));
    const templatesSrcDir = join(packageRoot, "templates");
    const templatesDestDir = join(cwd, ".rapidspec", "templates");

    if (existsSync(templatesSrcDir)) {
      const templateFiles = readdirSync(templatesSrcDir).filter((f: string) =>
        f.endsWith(".md") && f !== "AGENTS.md" && f !== "CLAUDE.md",
      );
      for (const file of templateFiles) {
        const srcPath = join(templatesSrcDir, file);
        const destPath = join(templatesDestDir, file);
        copyFileSync(srcPath, destPath);
        console.log(chalk.green(`  ✓ .rapidspec/templates/${file}`));
      }
      console.log(chalk.gray(`  Copied ${templateFiles.length} template(s)`));
    } else {
      console.log(chalk.yellow("  ⚠️  No templates directory found"));
    }

    // Configure Cursor MCP for sub-agents
    console.log(chalk.bold("\nConfiguring Cursor IDE integration:"));
    const cursorDir = join(cwd, ".cursor");
    const mcpJsonPath = join(cursorDir, "mcp.json");

    // Create .cursor directory if it doesn't exist
    if (!existsSync(cursorDir)) {
      mkdirSync(cursorDir, { recursive: true });
    }

    // Prepare sub-agents MCP configuration
    const agentsAbsolutePath = resolve(cwd, ".claude", "agents");
    const subAgentsConfig = {
      command: "npx",
      args: ["-y", "sub-agents-mcp"],
      env: {
        AGENTS_DIR: agentsAbsolutePath,
        AGENT_TYPE: "cursor"
      }
    };

    // Read or create mcp.json
    let mcpConfig: any = { mcpServers: {} };
    if (existsSync(mcpJsonPath)) {
      try {
        const mcpContent = readFileSync(mcpJsonPath, "utf-8");
        mcpConfig = JSON.parse(mcpContent);
        if (!mcpConfig.mcpServers) {
          mcpConfig.mcpServers = {};
        }
      } catch (error) {
        console.log(chalk.yellow("  ⚠️  Invalid mcp.json, creating new one"));
        mcpConfig = { mcpServers: {} };
      }
    }

    // Add sub-agents configuration
    mcpConfig.mcpServers["sub-agents"] = subAgentsConfig;

    // Write mcp.json
    writeFileSync(mcpJsonPath, JSON.stringify(mcpConfig, null, 2) + "\n", "utf-8");
    console.log(chalk.green("  ✓ .cursor/mcp.json configured"));
    console.log(chalk.gray(`    AGENTS_DIR: ${agentsAbsolutePath}`));
    console.log(chalk.gray("    AGENT_TYPE: cursor"));

    // Success message
    console.log(chalk.green.bold(`\n✓ RapidSpec initialized successfully with ${stackConfig.name}!\n`));

    console.log(chalk.bold("Next steps:\n"));
    console.log("1. Start using RapidSpec:");
    console.log(chalk.bold("   Claude Code:"));
    console.log(chalk.gray("     /rapid:proposal <name>  # Create a new spec"));
    console.log(chalk.gray("     /rapid:apply <name>     # Implement a spec"));
    console.log(chalk.gray("     /rapid:validate <name>  # Review a spec"));
    console.log(chalk.gray("     /rapid:archive <name>   # Archive a spec"));
    console.log(chalk.bold("   Cursor IDE:"));
    console.log(chalk.gray("     Reload Cursor to load RapidSpec agents via MCP"));
    console.log(chalk.gray("     Ask naturally: 'Use the code-verifier agent to...'"));
    console.log(chalk.gray("     Commands: /rapid:* slash commands work in Cursor 2.0\n"));

    console.log("2. Or use CLI commands directly:");
    console.log(
      chalk.gray("   rapid proposal <name>   # Scaffold proposal templates"),
    );
    console.log(
      chalk.gray("   rapid archive <name>    # Archive with timestamp\n"),
    );

    console.log(chalk.bold("Documentation:"));
    console.log(chalk.cyan("   https://github.com/9j/RapidSpec\n"));
  });

program
  .command("show [name]")
  .description("Display change or spec details")
  .option("--type <type>", "Type of item: change or spec")
  .option("--json", "Output as JSON")
  .option("--deltas-only", "Show only spec deltas (JSON only)")
  .action(async (name, options) => {
    const cwd = process.cwd();
    const changesDir = join(cwd, "rapidspec", "changes");
    const specsDir = join(cwd, "rapidspec", "specs");

    if (!existsSync(changesDir) && !existsSync(specsDir)) {
      console.log(chalk.red("✗ No rapidspec directory found"));
      console.log(chalk.yellow("Run: rapid init"));
      process.exit(1);
    }

    if (!name) {
      console.log(chalk.red("✗ No item specified"));
      console.log(
        chalk.gray(
          "Usage: rapid show <change-id> [--type change|spec] [--json]",
        ),
      );
      process.exit(1);
    }

    const type = options.type || "change";

    if (type === "change") {
      const changeDir = join(changesDir, name);
      const proposalPath = join(changeDir, "proposal.md");

      if (!existsSync(proposalPath)) {
        console.log(chalk.red(`✗ Change not found: ${name}`));
        process.exit(1);
      }

      const content = readFileSync(proposalPath, "utf-8");

      if (options.json) {
        // Extract spec deltas from specs/ subdirectories
        const specsSubDir = join(changeDir, "specs");
        const deltas: any[] = [];

        if (existsSync(specsSubDir)) {
          const { readdirSync } = await import("fs");
          const capabilities = readdirSync(specsSubDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name);

          for (const cap of capabilities) {
            const specPath = join(specsSubDir, cap, "spec.md");
            if (existsSync(specPath)) {
              const specContent = readFileSync(specPath, "utf-8");
              deltas.push({
                capability: cap,
                content: specContent,
              });
            }
          }
        }

        if (options.deltasOnly) {
          console.log(
            JSON.stringify(
              { id: name, deltaCount: deltas.length, deltas },
              null,
              2,
            ),
          );
        } else {
          console.log(JSON.stringify({ id: name, content, deltas }, null, 2));
        }
      } else {
        console.log(content);
      }
    } else if (type === "spec") {
      const specPath = join(specsDir, name, "spec.md");

      if (!existsSync(specPath)) {
        console.log(chalk.red(`✗ Spec not found: ${name}`));
        process.exit(1);
      }

      const content = readFileSync(specPath, "utf-8");

      if (options.json) {
        console.log(JSON.stringify({ id: name, content }, null, 2));
      } else {
        console.log(content);
      }
    } else {
      console.log(chalk.red(`✗ Invalid type: ${type}`));
      console.log(chalk.gray("Use --type change or --type spec"));
      process.exit(1);
    }
  });

program
  .command("validate [name]")
  .description("Validate proposal structure and content")
  .option("--strict", "Fail on warnings")
  .action(async (name, options) => {
    const cwd = process.cwd();
    const changesDir = join(cwd, "rapidspec", "changes");

    if (!existsSync(changesDir)) {
      console.log(chalk.red("✗ No rapidspec/changes directory found"));
      console.log(
        chalk.yellow("Run: /rapid:proposal <name> to create your first spec"),
      );
      process.exit(1);
    }

    // If no name provided, validate all
    if (!name) {
      console.log(chalk.blue("Validating all active proposals..."));
      console.log(chalk.yellow("⚠️  Full validation coming soon"));
      console.log(chalk.green("Use in Claude Code: /rapid:validate"));
      return;
    }

    const changeDir = join(changesDir, name);

    if (!existsSync(changeDir)) {
      console.log(chalk.red(`✗ Change not found: ${name}`));
      process.exit(1);
    }

    console.log(chalk.blue(`Validating: ${name}\n`));

    let hasErrors = false;
    let hasWarnings = false;

    // Check required files
    const requiredFiles = ["proposal.md", "tasks.md"];
    const optionalFiles = ["investigation.md", "research.md"];

    console.log(chalk.bold("Structure:"));
    for (const file of requiredFiles) {
      const filePath = join(changeDir, file);
      if (existsSync(filePath)) {
        console.log(chalk.green(`  ✓ ${file}`));
      } else {
        console.log(chalk.red(`  ✗ ${file} (required)`));
        hasErrors = true;
      }
    }

    for (const file of optionalFiles) {
      const filePath = join(changeDir, file);
      if (existsSync(filePath)) {
        console.log(chalk.gray(`  ✓ ${file} (optional)`));
      }
    }

    // Check proposal.md format
    const proposalPath = join(changeDir, "proposal.md");
    if (existsSync(proposalPath)) {
      console.log(chalk.bold("\nProposal Format:"));
      const content = readFileSync(proposalPath, "utf-8");

      const requiredSections = [
        "## Summary",
        "## Motivation",
        "## Solution",
        "## Implementation",
        "## Testing",
      ];

      for (const section of requiredSections) {
        if (content.includes(section)) {
          console.log(chalk.green(`  ✓ ${section}`));
        } else {
          console.log(chalk.yellow(`  ⚠ ${section} (recommended)`));
          hasWarnings = true;
        }
      }
    }

    // Check tasks.md format
    const tasksPath = join(changeDir, "tasks.md");
    if (existsSync(tasksPath)) {
      console.log(chalk.bold("\nTasks Format:"));
      const content = readFileSync(tasksPath, "utf-8");

      const hasTasks = /- \[[ x]\]/.test(content);
      if (hasTasks) {
        console.log(chalk.green("  ✓ Task checkboxes found"));
      } else {
        console.log(chalk.yellow("  ⚠ No task checkboxes found"));
        hasWarnings = true;
      }
    }

    // Summary
    console.log("");
    if (hasErrors) {
      console.log(chalk.red("✗ Validation failed - fix errors above"));
      process.exit(1);
    } else if (hasWarnings) {
      console.log(chalk.yellow("⚠ Validation passed with warnings"));
      if (options.strict) {
        console.log(chalk.red("✗ Strict mode enabled - failing on warnings"));
        process.exit(1);
      }
    } else {
      console.log(chalk.green("✓ Validation passed"));
    }

    console.log("");
    console.log(chalk.gray("For comprehensive review, use in Claude Code:"));
    console.log(chalk.gray(`  /rapid:validate ${name}`));
    console.log(
      chalk.gray("  (runs all agent reviews: security, architecture, etc.)"),
    );
  });

program
  .command("archive <change-id>")
  .description("Archive a completed change")
  .option("--skip-validation", "Skip validation before archiving")
  .action(async (changeId, options) => {
    const cwd = process.cwd();
    const changesDir = join(cwd, "rapidspec", "changes");
    const archiveDir = join(changesDir, "archive");
    const changeDir = join(changesDir, changeId);

    // Check if rapidspec is initialized
    if (!existsSync(changesDir)) {
      console.log(chalk.red("✗ RapidSpec not initialized"));
      console.log(chalk.yellow("Run: rapid init"));
      process.exit(1);
    }

    // Check if change exists
    if (!existsSync(changeDir)) {
      console.log(chalk.red(`✗ Change not found: ${changeId}`));
      console.log(
        chalk.gray("Use: rapid list (coming soon) to see available changes"),
      );
      process.exit(1);
    }

    console.log(chalk.blue(`Archiving: ${changeId}\n`));

    // Simple validation unless skipped
    if (!options.skipValidation) {
      console.log(chalk.bold("Validation:"));
      const proposalPath = join(changeDir, "proposal.md");
      const tasksPath = join(changeDir, "tasks.md");

      if (!existsSync(proposalPath)) {
        console.log(chalk.red("  ✗ proposal.md missing"));
        process.exit(1);
      }
      console.log(chalk.green("  ✓ proposal.md exists"));

      if (!existsSync(tasksPath)) {
        console.log(chalk.red("  ✗ tasks.md missing"));
        process.exit(1);
      }

      // Check if tasks are complete
      const tasksContent = readFileSync(tasksPath, "utf-8");
      const incompleteTasks = (tasksContent.match(/- \[ \]/g) || []).length;
      const completedTasks = (tasksContent.match(/- \[x\]/g) || []).length;

      if (incompleteTasks > 0) {
        console.log(
          chalk.yellow(`  ⚠ ${incompleteTasks} incomplete tasks found`),
        );
        console.log(
          chalk.gray(
            `    ${completedTasks} completed, ${incompleteTasks} remaining`,
          ),
        );
      } else {
        console.log(
          chalk.green(
            `  ✓ All tasks complete (${completedTasks}/${completedTasks})`,
          ),
        );
      }
    }

    // Create archive directory if it doesn't exist
    if (!existsSync(archiveDir)) {
      mkdirSync(archiveDir, { recursive: true });
    }

    // Generate timestamp (Supabase format: YYYYMMDDhhmmss)
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");

    const archivedName = `${timestamp}-${changeId}`;
    const archivePath = join(archiveDir, archivedName);

    // Move to archive
    console.log(chalk.bold("\nArchiving:"));
    try {
      const { renameSync } = await import("fs");
      renameSync(changeDir, archivePath);
      console.log(chalk.green(`  ✓ Moved to archive/${archivedName}/`));
    } catch (error: any) {
      console.log(chalk.red(`  ✗ Failed to archive: ${error.message}`));
      process.exit(1);
    }

    // Success message
    console.log(chalk.green.bold("\n✓ Change archived successfully!\n"));

    console.log(chalk.bold("Archive location:"));
    console.log(chalk.cyan(`  rapidspec/changes/archive/${archivedName}/`));
    console.log("");
    console.log(
      chalk.gray("Note: This is a basic archive. For full spec delta merging,"),
    );
    console.log(chalk.gray("use: /rapid:archive in Claude Code"));
    console.log("");
  });

program
  .command("proposal <change-id>")
  .description("Create a new proposal with templates")
  .option("--no-research", "Skip research.md and investigation.md")
  .action(async (changeId, options) => {
    const cwd = process.cwd();
    const changesDir = join(cwd, "rapidspec", "changes");
    const changeDir = join(changesDir, changeId);

    // Check if rapidspec is initialized
    if (!existsSync(changesDir)) {
      console.log(chalk.red("✗ RapidSpec not initialized"));
      console.log(chalk.yellow("Run: rapid init"));
      process.exit(1);
    }

    // Check if change already exists
    if (existsSync(changeDir)) {
      console.log(chalk.red(`✗ Change already exists: ${changeId}`));
      console.log(
        chalk.gray("Use a different change-id or delete the existing one"),
      );
      process.exit(1);
    }

    console.log(chalk.blue(`Creating proposal: ${changeId}\n`));

    // Create change directory structure
    console.log(chalk.bold("Creating directories:"));
    mkdirSync(changeDir, { recursive: true });
    console.log(chalk.green(`  ✓ rapidspec/changes/${changeId}/`));

    // Create specs subdirectory
    const specsDir = join(changeDir, "specs");
    mkdirSync(specsDir, { recursive: true });
    console.log(chalk.green(`  ✓ rapidspec/changes/${changeId}/specs/`));

    // Copy template files
    console.log(chalk.bold("\nCopying templates:"));

    const templates = [
      { src: "proposal.md", dest: "proposal.md", required: true },
      { src: "tasks.md", dest: "tasks.md", required: true },
    ];

    // Add optional templates based on options
    if (options.research !== false) {
      templates.push(
        { src: "investigation.md", dest: "investigation.md", required: false },
        { src: "research.md", dest: "research.md", required: false },
      );
    }

    for (const { src, dest, required } of templates) {
      const srcPath = join(packageRoot, "templates", src);
      const destPath = join(changeDir, dest);

      if (!existsSync(srcPath)) {
        if (required) {
          console.log(chalk.red(`  ✗ Template not found: ${src}`));
          console.log(chalk.gray(`    Looking in: ${srcPath}`));
        } else {
          console.log(chalk.gray(`  - ${dest} (template not found, skipping)`));
        }
        continue;
      }

      let content = readFileSync(srcPath, "utf-8");

      // Replace placeholders
      content = content.replace(/\[Change ID\]/g, changeId);
      content = content.replace(
        /\[Brief Description\]/g,
        changeId.replace(/-/g, " "),
      );

      writeFileSync(destPath, content);
      console.log(chalk.green(`  ✓ ${dest}`));
    }

    // Create example spec delta
    console.log(chalk.bold("\nCreating spec delta template:"));
    const exampleCapability = changeId.split("-")[0] || "feature";
    const specCapDir = join(specsDir, exampleCapability);
    mkdirSync(specCapDir, { recursive: true });

    const specSrcPath = join(packageRoot, "templates", "spec.md");
    const specDestPath = join(specCapDir, "spec.md");

    if (existsSync(specSrcPath)) {
      let specContent = readFileSync(specSrcPath, "utf-8");
      specContent = specContent.replace(
        /\[Capability Name\]/g,
        exampleCapability,
      );
      writeFileSync(specDestPath, specContent);
      console.log(chalk.green(`  ✓ specs/${exampleCapability}/spec.md`));
    } else {
      console.log(chalk.yellow(`  ⚠ Spec template not found`));
    }

    // Success message
    console.log(chalk.green.bold("\n✓ Proposal created successfully!\n"));

    console.log(chalk.bold("Next steps:\n"));
    console.log("1. Edit the proposal files:");
    console.log(chalk.cyan(`   - rapidspec/changes/${changeId}/proposal.md`));
    console.log(chalk.cyan(`   - rapidspec/changes/${changeId}/tasks.md`));
    console.log(
      chalk.cyan(
        `   - rapidspec/changes/${changeId}/specs/${exampleCapability}/spec.md`,
      ),
    );
    console.log("");
    console.log("2. Validate the proposal:");
    console.log(chalk.gray(`   rapid validate ${changeId}`));
    console.log("");
    console.log("3. In Claude Code, use:");
    console.log(
      chalk.gray(`   /rapid:apply ${changeId}  # Implement the proposal`),
    );
    console.log("");
  });

program.parse();
