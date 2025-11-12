# RapidSpec

Spec-driven development workflow with AI agents for Claude Code and Cursor IDE.

## What is RapidSpec?

RapidSpec is a spec-driven workflow with:
- **Smart AI Integration** - Prevents "imaginary code" with verification agents
- **Slash Commands** - `/rapid:proposal`, `/rapid:apply`, etc.
- **Automated Reviews** - Security, architecture, and code quality checks
- **Step-by-Step Implementation** - Supports rapid iteration with "wait, change this" workflow

## Installation

Install globally:
```bash
npm install -g rapidspec
```

Or use in your project:
```bash
npm install --save-dev rapidspec
npx rapid init
```

This will:
- Create `rapidspec/` directory structure
- Copy 18 agents to `.claude/agents/`
- Copy 7 commands to `.claude/commands/`
- Copy 7 templates to `.rapidspec/templates/`
- Generate `CLAUDE.md` and `rapidspec/AGENTS.md`
- Configure `.cursor/mcp.json` for Cursor IDE integration

This enables `/rapid:*` slash commands in Claude Code and Cursor IDE.

## Quick Start

Initialize RapidSpec in your project:

```bash
rapid init
```

This automatically:
- Creates `rapidspec/` directory structure
- Generates `CLAUDE.md` and `rapidspec/AGENTS.md`
- Copies all agents to `.claude/agents/`
- Copies all commands to `.claude/commands/`
- Copies all templates to `.rapidspec/templates/`

**What is AGENTS.md?**
- Single source of truth for AI assistants
- Documents RapidSpec workflow, slash commands, and agents
- Follows [agents.md convention](https://agents.md/) for tool-agnostic discovery
- Compatible with Claude Code, Amp, Jules, Gemini CLI, and other AI tools

## IDE Support

### Claude Code
Native support via `.claude/agents/` and `.claude/commands/`:
- **Agents**: `@agent-code-verifier`, `@agent-security-auditor`, etc.
- **Slash Commands**: `/rapid:proposal`, `/rapid:apply`, `/rapid:review`, etc.

### Cursor IDE
Agents available via [sub-agents-mcp](https://github.com/shinpr/sub-agents-mcp):
- **Setup**: `rapid init` automatically configures `.cursor/mcp.json`
- **Usage**: Reload Cursor, then ask naturally (e.g., "Use the code-verifier agent to check this file")
- **Slash Commands**: `/rapid:*` commands work in Cursor 2.0+
- **Note**: Unlike Claude Code, Cursor doesn't support `@agent-*` mentions—use natural language requests instead

**Manual Configuration (if needed):**
```json
{
  "mcpServers": {
    "sub-agents": {
      "command": "npx",
      "args": ["-y", "sub-agents-mcp"],
      "env": {
        "AGENTS_DIR": "/absolute/path/to/.claude/agents",
        "AGENT_TYPE": "cursor"
      }
    }
  }
}
```

### 1. Create your first spec

Using slash commands in Claude Code:
```
/rapid:proposal add-authentication
```

AI will:
1. Investigate codebase (prevent "imaginary code")
   - Read actual files and find existing patterns
   - Analyze git history
2. Research best practices
   - Web search for latest patterns
   - Check framework documentation
3. Present 2-3 implementation options with trade-offs

### 2. Implement the spec

```
/rapid:apply add-authentication
```

AI implements step-by-step with checkpoints:
- You can say "wait!" at any time
- Each step is testable
- No automatic commit (use `/rapid:commit` when ready)

### 3. Review and commit

```
/rapid:review add-authentication  # Optional: Run agent reviews
/rapid:commit add-authentication  # Update tasks.md and commit
```

### 4. Archive when done

```
/rapid:archive add-authentication
```

Moves to `archive/YYYYMMDDhhmmss-[name]/` and updates specs.

## Slash Commands

All commands follow `/rapid:*` pattern:

### Core Workflow
- `/rapid:proposal [name]` - Create new spec proposal with research and design review
- `/rapid:apply [name]` - Implement spec step-by-step with architecture validation and checkpoints
- `/rapid:review [name]` - Run comprehensive code quality reviews
- `/rapid:triage [name]` - Review findings one by one and add selected items to tasks
- `/rapid:resolve-parallel [name]` - Resolve multiple tasks in parallel with dependency analysis
- `/rapid:commit [name]` - Review changes, update tasks, and commit
- `/rapid:archive [name]` - Archive completed spec and update canonical specs

### Linear Integration
- `/rapid:from-linear <issue-number>` - Create proposal from existing Linear issue

## CLI Commands

```bash
# Initialize (creates rapidspec/ directory structure)
rapid init [path]

# Validate proposal structure
rapid validate [name]          # Validate specific proposal
rapid validate                 # Validate all active proposals
rapid validate --strict        # Fail on warnings

# Other commands coming soon
rapid proposal <name>          # Create new proposal
rapid list                     # List active proposals
rapid show <name>              # Show proposal details
```

### CLI Validate

The `rapid validate` CLI command performs **structure validation**:
- ✓ Checks required files exist (proposal.md, tasks.md)
- ✓ Validates proposal format (sections: Summary, Motivation, Solution, etc.)
- ✓ Checks tasks format (checkbox syntax)
- ✓ Fast and lightweight

For **comprehensive AI-powered reviews**, use the slash commands in Claude Code:
- **Design review** (before coding): `/rapid:proposal` includes design review with architecture agents
- **Code quality review** (after coding): `/rapid:review` runs code verification and security audits

## Agents

RapidSpec includes specialized agents for different workflow stages:

### Investigation Agents (Proposal - Research Phase)
Run in parallel at the start of `/rapid:proposal`:
- **@agent-git-history-analyzer** - Code evolution and decision analysis
- **@agent-pattern-recognition-specialist** - Find existing patterns in codebase
- **@agent-best-practices-researcher** - External standards research via web search
- **@agent-framework-docs-researcher** - Library documentation and source code

### Design Review Agents (Proposal - After Option Selection)
Run after user selects an option in `/rapid:proposal`:
- **@agent-database-architect** - Schema design, migration safety, RLS policies, index strategy
- **@agent-nextjs-architecture-expert** - Server/Client Component architecture, routing, data fetching

Also run at the start of `/rapid:apply` for implementation guidance.

### Code Review Agents (Review - After Implementation)
Run during `/rapid:review` to verify implementation quality:

**Core Agents (always run)**:
- **@agent-code-verifier** - Verifies implementation against actual files (prevents "imaginary code")
- **@agent-security-auditor** - Checks RLS, auth, OWASP compliance

**Conditional Agents (based on changes)**:
- **@agent-code-reviewer** - Type safety, patterns, performance, error handling
- **@agent-data-integrity-guardian** - Data consistency, constraint validation
- **@agent-test-automator** - E2E test coverage and generation
- **@agent-performance-oracle** - Performance analysis and optimization

### Workflow Agents
- **@agent-task-updater** - Reviews implementation, updates tasks.md, prepares commits (used in `/rapid:commit`)
- **@agent-pr-comment-resolver** - PR comment resolution

## Linear Integration

### Setup

1. Get your Linear API key from [linear.app/settings/api](https://linear.app/settings/api)

2. Add to your project:
```bash
# .env.local
LINEAR_API_KEY=lin_api_xxxxx
LINEAR_TEAM_ID=your-team-id
```

### Create Proposal from Linear Issue

When you already have a Linear issue and want to implement it using RapidSpec:

```
/rapid:from-linear 123
```

AI will:
1. Fetch Linear issue #123 (title, description, comments)
2. Parse requirements and acceptance criteria
3. Delegate to `/rapid:proposal` for complete workflow
4. Generate all proposal files with full research and verification

This is useful for PM-driven workflows where issues are created first, then implemented.

## Complete Workflow

### 1. Create Proposal (`/rapid:proposal`)

```
You: "/rapid:proposal add-smart-link-duplicate-prevention"

AI automatically:
1. 📖 Investigation Phase (runs in parallel)
   - Reads actual codebase (no "imaginary code")
   - @agent-git-history-analyzer: Analyzes git history
   - @agent-pattern-recognition-specialist: Finds existing patterns
   - Understands why current behavior exists

2. 🔬 Research Phase (runs in parallel)
   - @agent-best-practices-researcher: Searches best practices (web search)
   - @agent-framework-docs-researcher: Checks framework documentation
   - Analyzes reference repositories

3. 💡 Options Phase
   - Presents 2-3 implementation approaches
   - Shows trade-offs for each option
   - Recommends best approach (⭐)

You: "1" (select option)

AI runs Design Review:
✓ @agent-database-architect: Validates schema, migration safety
✓ @agent-nextjs-architecture-expert: Reviews component structure
✓ Incorporates design feedback into proposal

AI creates:
✓ rapidspec/changes/add-smart-link-duplicate-prevention/
  - proposal.md (full spec with chosen approach + design review)
  - tasks.md (step-by-step implementation plan)
  - investigation.md (findings from code analysis)
  - research.md (best practices and references)
```

### 2. Apply Implementation (`/rapid:apply`)

```
You: "/rapid:apply add-smart-link-duplicate-prevention"

AI runs Architecture Validation:
✓ @agent-database-architect: Provides implementation guidance
✓ @agent-nextjs-architecture-expert: Confirms component approach
✓ Ready to implement with validated architecture

AI implements step-by-step:

┌─────────────────────────────────────┐
│ Task 1.1: Database Migration (5min) │
└─────────────────────────────────────┘
[Shows implementation]

You: "ㄱㄱ" (go) or "wait!" (pause)

┌─────────────────────────────────────┐
│ Task 1.2: API Validation (8min)     │
└─────────────────────────────────────┘
[Shows implementation]

You: "wait! Use 400 status, not 409"

AI: [Adjusts implementation]
"Fixed - using 400 Bad Request. Continue?"

You: "ㄱㄱ"

[... continues through all tasks ...]

After completion:
✅ All tasks completed!

Summary:
- 8 files changed
- 3 migrations created
- 2 tests added

Next steps:
- Run `/rapid:review` for comprehensive review (optional)
- Or `/rapid:commit` to commit directly
```

### 3. Review Implementation (`/rapid:review`) - Optional

```
You: "/rapid:review add-smart-link-duplicate-prevention"

AI runs core + conditional agent reviews:

Core Agents (always run):
✅ Code Verification (@agent-code-verifier)
  ✓ All file references verified
  ✓ No imaginary code
  ✓ Diffs shown for all changes

✅ Security Audit (@agent-security-auditor)
  ✓ RLS enabled on smart_links table
  ✓ Policies use has_role() function
  ✓ Input validation present

Conditional Agents (based on changes):
⚠️  Code Quality Review (@agent-code-reviewer)
  ✓ Type safety maintained
  ⚠️  Function complexity: Consider extracting helper

✅ Data Integrity (@agent-data-integrity-guardian)
  ✓ Migration non-blocking
  ✓ Indexes on foreign keys
  ✓ Constraint validation present

⚠️  Test Coverage (@agent-test-automator)
  ✓ E2E test present
  ✓ Unit tests present
  ⚠️  Missing edge case: concurrent creation

Overall: PASSED (3 warnings - recommended fixes)

Next: /rapid:triage to review findings individually
```

### 4. Triage Findings (`/rapid:triage`) - Optional

```
You: "/rapid:triage add-smart-link-duplicate-prevention"

AI presents findings one by one:

┌─────────────────────────────────────────────────────────┐
│ Triage Progress: 1/3 findings | Est. 3 min remaining    │
└─────────────────────────────────────────────────────────┘

---
Finding #1: Extract Complex Validation Logic

Severity: 🟡 P2 (IMPORTANT)
Category: Code Quality

Description:
The validateSmartLink function has cognitive complexity of 15 (max 10).
Multiple nested conditions make it hard to understand.

Location: src/lib/validation.ts:42

Proposed Solution:
Extract validation rules into separate functions:
- validateUrl(url)
- validateRelease(releaseId)
- checkDuplicate(link)

Estimated Effort: Medium (2 hours)

---
Add to tasks?
1. yes - add to tasks.md
2. next - skip this finding
3. custom - modify before adding

You: "yes"

AI:
✅ Added to tasks.md: Section 3.1 - Extract validation logic

┌─────────────────────────────────────────────────────────┐
│ Triage Progress: 2/3 findings | Est. 2 min remaining    │
│ (1 added, 0 skipped)                                     │
└─────────────────────────────────────────────────────────┘

---
Finding #2: Add missing edge case test...

You: "yes"

[... continues for all findings ...]

╔═══════════════════════════════════════════════════════╗
║         Triage Complete - 3 Findings Reviewed         ║
╚═══════════════════════════════════════════════════════╝

Added to tasks.md (2 tasks):
  🟡 Task 3.1: Extract validation logic
  🔵 Task 3.2: Add concurrent creation test

Skipped (1 finding):
  Finding #3: Variable naming (cosmetic)

Next: /rapid:resolve-parallel or /rapid:apply to fix tasks
```

### 5. Resolve Tasks in Parallel (`/rapid:resolve-parallel`) - Optional

```
You: "/rapid:resolve-parallel add-smart-link-duplicate-prevention"

AI analyzes task dependencies:

Found 2 uncompleted tasks

Analyzing dependencies...
✓ Task 3.1: Extract validation (independent)
✓ Task 3.2: Add test (independent)

Execution Plan:

Wave 1 (2 tasks in parallel):
  - Task 3.1: Extract validation logic (2 hours)
  - Task 3.2: Add concurrent test (30 min)

Total: 2 hours (vs 2.5 hours sequential)
Efficiency Gain: 20% faster

Continue? (yes)

You: "yes"

AI:
Launching Wave 1 (2 tasks in parallel)...

1. Task pr-comment-resolver(task_3_1)
2. Task pr-comment-resolver(task_3_2)

[Both agents work simultaneously]

✅ Wave 1 Complete (2/2 tasks done)

╔═══════════════════════════════════════════════════════╗
║         All Tasks Complete - 2/2                      ║
╚═══════════════════════════════════════════════════════╝

Files changed: 3 files
Tests: All passing

Updated: rapidspec/changes/add-smart-link-duplicate-prevention/tasks.md

Next: /rapid:commit to commit changes
```

### 6. Commit Changes (`/rapid:commit`)

```
You: "/rapid:commit add-smart-link-duplicate-prevention"

AI (@agent-task-updater):
Reviewing changes...
✓ Git status checked
✓ Git diff analyzed
✓ Matched changes to tasks

Files changed (8):
  Modified: 3 files
  Added: 5 files
  Total: +245 -18 lines

Tasks completed (5/6):
✓ 1.1 Database Migration
✓ 1.2 API Validation
✓ 1.3 UI Toast
✓ 2.1 E2E Test
✓ 2.2 Unit Test
⏳ 3.1 Documentation (not done)

Discovered work:
📝 Added index on release_id (performance)
📝 Extracted validation logic (code quality)

Updating tasks.md...
✓ Marked 5 tasks [x]
✓ Added discovered tasks

Commit message:
────────────────────────────────────────
feat(smart-links): prevent duplicate links per release

Completed Tasks (5/6):
- Database Migration: unique constraint
- API Validation: 400 error handling
- UI Toast: duplicate warning
- E2E Test: duplicate.spec.ts
- Unit Test: validation.test.ts

Additional Improvements:
- Added index on release_id for performance
- Extracted validation logic to helper

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
────────────────────────────────────────

Ready to commit? (ㄱㄱ)

You: "ㄱㄱ"

AI:
✓ Committed: abc1234
```

### 7. Archive Completion (`/rapid:archive`)

```
You: "/rapid:archive add-smart-link-duplicate-prevention"

AI:
1. Verifies completion
   ✓ All tasks marked [x]
   ✓ Tests passing
   ✓ Committed to git

2. Archives the spec
   ✓ Moved to: archive/20251111123045-add-smart-link-duplicate-prevention/

3. Updates canonical specs
   ✓ Updated: specs/smart-links/spec.md
   ✓ Added prevention logic documentation

Done! 🎉
```

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     /rapid:proposal                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Investigation (auto - runs in parallel)                  │
│    - Read actual codebase (prevent "imaginary code")        │
│    - @agent-git-history-analyzer: Understand history        │
│    - @agent-pattern-recognition-specialist: Find patterns   │
│                                                              │
│ 2. Research (auto - runs in parallel)                       │
│    - @agent-best-practices-researcher: Web + docs           │
│    - @agent-framework-docs-researcher: Library docs         │
│                                                              │
│ 3. Options (interactive)                                     │
│    - Present 2-3 approaches with trade-offs                 │
│    - User selects (1, 2, 3)                                 │
│                                                              │
│ 4. Design Review (auto - after selection)                   │
│    - @agent-database-architect: Schema, migration safety    │
│    - @agent-nextjs-architecture-expert: Component structure │
│    - Incorporate design feedback into proposal              │
│                                                              │
│ → Files created:                                            │
│   - proposal.md, tasks.md, investigation.md, research.md    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:apply                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Read spec files                                           │
│    - proposal.md, tasks.md, investigation.md                │
│                                                              │
│ 2. Architecture Validation (auto - before implementation)   │
│    - @agent-database-architect: Implementation guidance     │
│    - @agent-nextjs-architecture-expert: Concrete approach   │
│                                                              │
│ 3. Implementation (step-by-step with checkpoints)           │
│    For each task:                                            │
│      1. Show what will be done                              │
│      2. Wait for "ㄱㄱ" (go) or "wait!" (pause)              │
│      3. Implement and show diff                             │
│      4. Support "잠깐" (wait) to change direction            │
│                                                              │
│ After all tasks complete:                                    │
│   → Shows summary (files changed, tests added)              │
│   → Suggests /rapid:review (optional) or /rapid:commit      │
│                                                              │
│ → Implementation complete (not committed)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    /rapid:review (optional)                 │
├─────────────────────────────────────────────────────────────┤
│ Core reviews (always run in parallel):                      │
│   - @agent-code-verifier: Verify implementation             │
│   - @agent-security-auditor: RLS, auth, OWASP              │
│                                                              │
│ Conditional reviews (based on changes):                     │
│   - @agent-code-reviewer: Quality, types, patterns         │
│   - @agent-data-integrity-guardian: Data consistency       │
│   - @agent-test-automator: Coverage analysis               │
│   - @agent-performance-oracle: Performance optimization    │
│                                                              │
│ Note: Architecture agents run in /rapid:proposal            │
│       and /rapid:apply (not here)                           │
│                                                              │
│ → Review report (Critical/Warning/Info)                     │
│ → Suggests /rapid:triage to review findings                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  /rapid:triage (optional)                   │
├─────────────────────────────────────────────────────────────┤
│ Review findings one by one:                                  │
│   1. Present each finding with severity and impact          │
│   2. User decides: yes/next/custom                          │
│   3. Accepted findings → Add to tasks.md                    │
│   4. Skipped findings → Document for later                  │
│                                                              │
│ → Findings converted to actionable tasks                    │
│ → Suggests /rapid:resolve-parallel or /rapid:apply          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              /rapid:resolve-parallel (optional)             │
├─────────────────────────────────────────────────────────────┤
│ Resolve multiple tasks in parallel:                         │
│   1. Analyze task dependencies                              │
│   2. Generate execution plan (Mermaid diagram)              │
│   3. Execute in waves (parallel within wave)                │
│   4. Update tasks.md after each wave                        │
│                                                              │
│ → Tasks completed 30-50% faster than sequential             │
│ → Suggests /rapid:commit after completion                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:commit                           │
├─────────────────────────────────────────────────────────────┤
│ Commit preparation (@agent-task-updater):                   │
│   1. Review git status and git diff                         │
│   2. Match changes to tasks.md                              │
│   3. Mark completed tasks [x]                               │
│   4. Capture discovered work                                │
│   5. Generate commit message from tasks                     │
│   6. Create commit with conventional format                 │
│                                                              │
│ → Committed to git                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:archive                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Verify completion (all tasks done, tests pass)           │
│ 2. Move to archive/YYYYMMDDhhmmss-[name]/                   │
│    (Timestamp format: 20251111123045)                       │
│ 3. Update canonical specs with changes                      │
│                                                              │
│ → Spec archived, specs updated                              │
└─────────────────────────────────────────────────────────────┘
```

## Best Practices

### 1. Always Verify Before Coding
RapidSpec prevents "imaginary code" by:
- Reading actual files before suggesting changes
- Checking git history for context
- Generating diffs before implementation

### 2. Use Step-by-Step Implementation
Break large features into small, testable steps:
- Each step is a checkpoint
- Say "wait!" to change direction
- No need for throwaway prototypes

### 3. Let AI Do Research
AI automatically:
- Searches best practices (web search)
- Analyzes reference repos
- Checks library documentation

### 4. Support "ㄱㄱ / 잠깐" Workflow
- "ㄱㄱ" (go): Continue to next step
- "잠깐" (wait): Pause and adjust
- Enables rapid iteration without restarts

## Philosophy

RapidSpec is based on three principles:

1. **Spec is Truth** - Code follows spec, not the other way around
2. **Verify, Don't Imagine** - Always check actual code before suggesting changes
3. **Fast Iteration** - Support rapid "wait, change this" workflow

Inspired by [OpenSpec](https://github.com/Fission-AI/OpenSpec) and [Every's Compounding Engineering](https://github.com/EveryInc/every-marketplace).

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © BAK Chanhee
