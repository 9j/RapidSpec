# RapidSpec Agents

Specialized AI agents for automated code review, research, and verification.

## Core Agents (Always Run)

### 1. @agent-code-verifier
**Prevents "imaginary code"**
- Verifies all file references exist
- Ensures Read/Grep/Git used before suggesting changes
- Shows diffs for all modifications
- **Runs:** proposal, apply, validate

### 2. @agent-security-auditor
**Security & RLS compliance**
- Checks RLS policies on all user tables
- Auth token handling
- OWASP top 10 compliance
- Input validation
- **Runs:** validate, apply (if security changes)

## Feature-Specific Agents

### 3. @agent-code-reviewer
**Comprehensive code review**
- Code quality (conventions, complexity)
- Type safety (no `any` types)
- React/Next.js patterns
- Performance (O(n²), pagination)
- Error handling
- Testing coverage
- **Runs:** after apply, before commit

### 4. @agent-task-updater
**Progress tracking & commit preparation**
- Reviews implementation status with git
- Updates tasks.md with completed tasks
- Captures discovered work
- Generates commit messages
- **Runs:** before commit, before archive

## Architecture Experts

### 5. @agent-nextjs-architecture-expert
**Next.js 16 best practices**
- Server vs Client Component usage
- Data fetching patterns (prefetch + hydrate)
- Async API handling (params, searchParams)
- Image optimization
- Metadata API
- **Runs:** validate (if Next.js files changed)
- **User frequency:** 11 times

### 6. @agent-database-architect
**Database safety & performance**
- Migration safety (non-blocking, rollback)
- RLS policy enforcement
- Index recommendations
- N+1 query detection
- Data integrity constraints
- **Runs:** validate (if migrations changed)
- **User frequency:** 9 times

### 7. @agent-test-automator
**Test coverage & generation**
- E2E test generation (Playwright)
- Unit test generation (Vitest)
- Edge case identification
- Coverage analysis (target 80%+)
- **Runs:** validate
- **User frequency:** 11 times

## Research Agents

### 8. @agent-best-practices-researcher
**External best practices research**
- Official documentation (Context7)
- Web search for current standards
- Open source project examples
- Style guides & conventions
- **Use when:** researching how to implement new features

### 9. @agent-framework-docs-researcher
**Library & framework documentation**
- Fetches official docs
- Explores source code (node_modules, gems)
- Version-specific constraints
- Breaking changes & migrations
- **Use when:** using new library or troubleshooting

### 10. @agent-git-history-analyzer
**Code evolution analysis**
- File evolution timeline
- Contributor expertise mapping
- Historical issue patterns
- Code pattern origins
- **Use when:** understanding why code exists, finding past decisions

### 11. @agent-pr-comment-resolver
**PR comment resolution**
- Implements requested changes
- Reports on resolution
- Maintains codebase consistency
- **Use when:** addressing code review comments

## Usage

### Automatic Execution
Agents run automatically during workflow:
```
/rapid:proposal  → code-verifier, best-practices-researcher
/rapid:apply     → code-verifier, security-auditor (if needed)
/rapid:validate  → all relevant agents based on changes
Before commit    → code-reviewer, task-updater
```

### Manual Invocation
Invoke specific agent:
```
@agent-code-verifier check this file
@agent-nextjs-architecture-expert review this component
@agent-database-architect analyze this migration
```

### In Conversation
Agents automatically activate based on context:
```
User: "How should I structure this Next.js page?"
→ @agent-nextjs-architecture-expert activates

User: "Is this migration safe?"
→ @agent-database-architect activates

User: "What's the best way to implement OAuth?"
→ @agent-best-practices-researcher activates
```

## Severity Levels

**Critical (Blocking):**
- No "imaginary code" (code-verifier)
- RLS missing on user tables (security-auditor)
- `any` types without justification (code-reviewer)
- Async APIs not awaited (nextjs-architecture-expert)
- Migration without rollback (database-architect)

**Warning (Should Fix):**
- Complex functions (code-reviewer)
- Missing indexes (database-architect)
- Low test coverage (test-automator)
- Unnecessary Client Components (nextjs-architecture-expert)

**Info (Nice to Have):**
- Additional comments
- Performance micro-optimizations
- Refactoring opportunities

## Agent Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    /rapid:proposal                          │
├─────────────────────────────────────────────────────────────┤
│ 1. @agent-code-verifier                                     │
│    ✓ Read actual files                                      │
│    ✓ Verify patterns exist                                  │
│    ✓ Check git history                                      │
│                                                              │
│ 2. @agent-best-practices-researcher                         │
│    ✓ Search web for patterns                                │
│    ✓ Fetch official docs                                    │
│    ✓ Analyze reference repos                                │
│                                                              │
│ 3. @agent-git-history-analyzer                              │
│    ✓ Analyze file evolution                                 │
│    ✓ Find past decisions                                    │
│                                                              │
│ → Proposal created with options                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:apply                            │
├─────────────────────────────────────────────────────────────┤
│ [Step-by-step implementation with checkpoints]              │
│                                                              │
│ After completion:                                            │
│                                                              │
│ 1. @agent-code-reviewer                                     │
│    ✓ Code quality                                           │
│    ✓ Type safety                                            │
│    ✓ Patterns                                               │
│    ✓ Performance                                            │
│                                                              │
│ 2. @agent-security-auditor (if applicable)                  │
│    ✓ RLS policies                                           │
│    ✓ Auth handling                                          │
│                                                              │
│ 3. @agent-nextjs-architecture-expert (if applicable)        │
│    ✓ Server/Client usage                                    │
│    ✓ Data fetching                                          │
│                                                              │
│ 4. @agent-database-architect (if applicable)                │
│    ✓ Migration safety                                       │
│    ✓ Indexes                                                │
│                                                              │
│ 5. @agent-test-automator                                    │
│    ✓ Test coverage                                          │
│    ✓ Edge cases                                             │
│                                                              │
│ 6. @agent-task-updater                                      │
│    ✓ Update tasks.md                                        │
│    ✓ Generate commit message                                │
│                                                              │
│ → Ready to commit                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    /rapid:validate                          │
├─────────────────────────────────────────────────────────────┤
│ Runs ALL relevant agents based on file changes              │
│                                                              │
│ → Comprehensive validation report                           │
└─────────────────────────────────────────────────────────────┘
```

## Adding Custom Agents

Create `[agent-name].md` in this directory:

```markdown
---
name: my-custom-agent
description: What this agent does and when to use it
---

# My Custom Agent

**Role:** Brief description

## When to Run
- Trigger condition 1
- Trigger condition 2

## Checklist
- [ ] Check 1
- [ ] Check 2

## Example Output
[Show report format]
```

Then add to config:
```json
{
  "agents": {
    "autoRun": ["code-verifier", "my-custom-agent"]
  }
}
```

## Notes

- Agents compound - learn from your feedback over time
- Critical issues block progress
- Warnings should be fixed or documented
- Each agent has specific expertise domain
- Agents work together for comprehensive review
