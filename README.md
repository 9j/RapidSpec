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
- `/rapid:proposal [name]` - Create new spec proposal with research
- `/rapid:apply [name]` - Implement spec step-by-step with checkpoints
- `/rapid:review [name]` - Run comprehensive agent reviews
- `/rapid:commit [name]` - Review changes, update tasks, and commit
- `/rapid:validate [name]` - Validate spec structure (structure check only)
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

For **comprehensive AI-powered implementation reviews**, use the slash command in Claude Code:
```
/rapid:review add-authentication
```

This runs core + conditional agent reviews:
- @agent-code-verifier: Verify implementation (prevents imaginary code)
- @agent-security-auditor: Security audit (RLS, OWASP)
- @agent-nextjs-architecture-expert: Architecture review (if Next.js changes)
- @agent-database-architect: Database safety (if DB changes)
- @agent-test-automator: Test coverage analysis (if user-facing features)

## Agents

RapidSpec includes specialized agents for different workflow stages:

### Investigation Agents (Proposal Stage)
- **@agent-git-history-analyzer** - Code evolution and decision analysis
- **@agent-pattern-recognition-specialist** - Find existing patterns in codebase
- **@agent-best-practices-researcher** - External standards research via web search
- **@agent-framework-docs-researcher** - Library documentation and source code

### Core Review Agents (Always Run in Review/Validate)
- **@agent-code-verifier** - Verifies implementation against actual files (prevents "imaginary code")
- **@agent-security-auditor** - Checks RLS, auth, OWASP compliance

### Conditional Review Agents (Based on Changes)
- **@agent-nextjs-architecture-expert** - Next.js 16 best practices, Server/Client Components
- **@agent-database-architect** - Migration safety, RLS, N+1 queries, indexes
- **@agent-test-automator** - E2E test coverage and generation
- **@agent-code-reviewer** - Type safety, patterns, performance, error handling

### Workflow Agents
- **@agent-task-updater** - Reviews implementation, updates tasks.md, prepares commits (used in `/rapid:commit`)
- **@agent-pr-comment-resolver** - PR comment resolution

Investigation agents run during `/rapid:proposal`, review agents during `/rapid:review` and `/rapid:validate`.

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
3. Run investigation and research (same as `/rapid:proposal`)
4. Present implementation options
5. Create proposal.md with Linear issue link

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

AI creates:
✓ rapidspec/changes/add-smart-link-duplicate-prevention/
  - proposal.md (full spec with chosen approach)
  - tasks.md (step-by-step implementation plan)
  - investigation.md (findings from code analysis)
  - research.md (best practices and references)
```

### 2. Apply Implementation (`/rapid:apply`)

```
You: "/rapid:apply add-smart-link-duplicate-prevention"

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
⚠️  Architecture Review (@agent-nextjs-architecture-expert)
  ✓ Server Components used appropriately
  ⚠️  Consider adding loading state

✅ Database Review (@agent-database-architect)
  ✓ Migration non-blocking
  ✓ Indexes on foreign keys
  ✓ Rollback script provided

⚠️  Test Coverage (@agent-test-automator)
  ✓ E2E test present
  ✓ Unit tests present
  ⚠️  Missing edge case: concurrent creation

Overall: PASSED (2 warnings - recommended fixes)

Fix warnings? (ㄱㄱ to fix, skip to ignore)
```

### 4. Commit Changes (`/rapid:commit`)

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

### 5. Validate Structure (`/rapid:validate`) - Optional

```
You: "/rapid:validate add-smart-link-duplicate-prevention"

AI validates structure:

✅ Structure Validation
  ✓ proposal.md exists with required sections
  ✓ tasks.md exists with proper format
  ✓ spec deltas found in specs/smart-links/spec.md

✅ Format Validation
  ✓ Proposal has Why, What Changes, Impact sections
  ✓ Tasks use proper checkbox format
  ✓ Spec deltas use ADDED/MODIFIED/REMOVED headers

✅ Content Validation
  ✓ File references match actual files
  ✓ Tasks align with proposal
  ✓ Spec deltas match proposed changes

Overall: PASSED

Next: /rapid:apply add-smart-link-duplicate-prevention
```

For comprehensive agent reviews, use `/rapid:review` instead.

### 6. Archive Completion (`/rapid:archive`)

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
│ → Files created:                                            │
│   - proposal.md, tasks.md, investigation.md, research.md    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:apply                            │
├─────────────────────────────────────────────────────────────┤
│ Implementation (step-by-step with checkpoints)              │
│                                                              │
│ For each task:                                               │
│   1. Show what will be done                                 │
│   2. Wait for "ㄱㄱ" (go) or "wait!" (pause)                 │
│   3. Implement and show diff                                │
│   4. Support "잠깐" (wait) to change direction               │
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
│   - @agent-nextjs-architecture-expert: Next.js patterns    │
│   - @agent-database-architect: Migration safety, indexes   │
│   - @agent-test-automator: Coverage analysis               │
│                                                              │
│ → Review report (Critical/Warning/Info)                     │
│ → Option to fix warnings before commit                      │
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
│                    /rapid:validate (optional)               │
├─────────────────────────────────────────────────────────────┤
│ Structure validation (always):                              │
│   - Required files exist (proposal.md, tasks.md)            │
│   - Proposal format (sections present)                      │
│   - Task checkbox syntax                                     │
│                                                              │
│ Agent reviews (optional, with --agents flag):               │
│   - @agent-code-verifier: Verify no imaginary code          │
│   - @agent-security-auditor: Check security implications    │
│                                                              │
│ → Structure validation report                               │
│ Note: For post-implementation review, use /rapid:review     │
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
