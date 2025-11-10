---
name: RapidSpec: Proposal
description: Create spec-driven proposal with verification and research
category: RapidSpec
tags: [rapidspec, proposal]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, Task
argument-hint: <change-id> [description]
---

<!-- RAPIDSPEC:START -->
# Create RapidSpec Proposal

Transform feature descriptions, bug reports, or improvements into well-structured OpenSpec proposals with automated verification and research.

## Feature Description

<feature_description> #$ARGUMENTS </feature_description>

## Main Tasks

### 1. Parallel Verification & Research

<thinking>
First, I must verify the current codebase state and research best practices.
Run multiple specialized agents in parallel to gather comprehensive context.
This prevents "imaginary code" and ensures evidence-based proposals.
</thinking>

<critical_requirement>
MUST verify actual code exists before proposing. No "imaginary code".
All file references must be verified with Read, Grep, or Git commands.
</critical_requirement>

Run these agents in parallel at the same time:

Investigation agents:
- Task git-history-analyzer(affected_files)
- Task pattern-recognition-specialist(affected_files)

Research agents:
- Task best-practices-researcher(feature_description, technology_stack)
- Task framework-docs-researcher(detected_framework)

**Verification Checklist:**

- [ ] Read actual files with `@file/path`, `Grep`, `Glob`
- [ ] Check git history: `git log --oneline -- path/to/file`
- [ ] Find existing patterns in codebase
- [ ] Document all findings with specific file paths (e.g., `src/app/page.tsx:42`)

**Research Collection:**

- [ ] WebSearch for latest patterns (e.g., "Next.js 16 caching patterns 2025")
- [ ] Check reference repositories (midday-ai, dub, epic-stack)
- [ ] Read library CHANGELOG.md for breaking changes
- [ ] Analyze git log for past decisions: `git log --all --grep="keyword"`
- [ ] Include URLs to external documentation and best practices guides

### 2. Synthesize Research & Present Options

<thinking>
Analyze all agent findings to form 2-3 concrete implementation options.
Each option must include verified "Before" code with file:line references.
Consider trade-offs: time, risk, complexity, and pattern alignment.
</thinking>

**Option Structure:**

Present 2-3 concrete approaches with:
- **Before** (verified actual code with @file:line)
- **After** (proposed changes)
- **Pros/Cons/Cost** (time, risk, complexity)
- **Pattern Match** (how it aligns with project conventions)
- Mark recommended option with ⭐

**Example Presentation:**

```markdown
### Option 1: Client + DB Unique Constraint ⭐ (Recommended)
**Before:** @src/app/dashboard/page.tsx:42 - No duplicate check
**After:** Add client validation + unique index on `links` table
**Pros:** Strong data integrity, prevents race conditions
**Cons:** Migration required, slightly slower inserts
**Cost:** Time: 2h, Risk: Low, Complexity: Medium
**Pattern Match:** ✅ Follows @midday-ai/midday deduplication pattern

### Option 2: Client Warning Only
**Before:** @src/app/dashboard/page.tsx:42 - No duplicate check
**After:** Show warning toast if duplicate detected
**Pros:** No migration, fast implementation
**Cons:** No DB enforcement, race conditions possible
**Cost:** Time: 30m, Risk: Medium, Complexity: Low
**Pattern Match:** ⚠️ Not recommended for production
```

### 3. Wait for User Decision

<thinking>
Present options clearly and wait for user confirmation.
User may choose option number, say "yes" (go), or "wait" (wait) to reconsider.
</thinking>

**User responses:**
- User replies with "1", "2", "3", or option number
- User says "yes" (go) to proceed with recommended option
- User says "wait" (wait) or "no" (no) to change direction

**DO NOT proceed to file generation until user confirms their choice.**

### 4. Scaffold with CLI then Fill Templates

<thinking>
First run CLI to scaffold template files, then fill them with research findings.
This ensures consistent structure and prevents missing files.
</thinking>

<critical_requirement>
MUST run `rapid proposal <change-id>` CLI command first to scaffold templates.
MUST fill ALL scaffolded files with agent research findings.
NEVER skip files - populate proposal.md, tasks.md, investigation.md, research.md, and spec deltas.
</critical_requirement>

**Step 4a: Scaffold Templates**
```bash
# Run CLI to create template files
rapid proposal <change-id>
```

This creates the directory structure and template files.

**Step 4b: Fill the Templates**

Now populate these scaffolded files in `rapidspec/changes/<change-id>/`:

**`proposal.md`** - Chosen option with before/after diffs:
```markdown
# Change: [Brief Description]

## Why
[1-2 sentences: problem or opportunity]

## Code Verification
- [x] Read actual files: @path/to/file:line
- [x] Git history checked: [findings from git-history-analyzer]
- [x] Existing patterns found: [patterns from code-verifier]

## What Changes

### Before (Verified Actual Code)
\```typescript
// @src/app/dashboard/page.tsx:42
[actual current code from verification]
\```

### After (Proposed)
\```typescript
[new code based on chosen option]
\```

## Option Analysis

### Option 1: [Approach] ⭐ (Recommended)
**Pros:** [benefits from best-practices-researcher]
**Cons:** [drawbacks]
**Cost:** Time: [X], Risk: [low/med/high], Complexity: [low/med/high]
**Pattern Match:** ✅ Follows @docs/[reference from framework-docs-researcher]

## Recommendation
Option 1 because: [evidence-based reasoning from agent findings]

## Impact
- Affected specs: [list]
- Affected files: [list with line numbers from code-verifier]
- Breaking changes: [yes/no, details]
```

**`investigation.md`** - Code analysis and git history:
```markdown
# Investigation: [Change ID]

## Current State Analysis
[Findings from code-verifier agent]

## Git History
[Relevant commits and patterns from git-history-analyzer]

## Existing Patterns
[Codebase patterns that inform this change]
```

**`research.md`** - Best practices and reference repos:
```markdown
# Research: [Change ID]

## Best Practices
[Findings from best-practices-researcher agent]

## Framework Documentation
[Relevant docs from framework-docs-researcher agent]

## Reference Implementations
- [Links to reference repos and their approaches]
```

**`tasks.md`** - Step-by-step implementation with checkpoints:
```markdown
## 1. Implementation

### 1.1 [Step Name] (X min) - Checkpoint ⏸
- [ ] [specific task]
- [ ] [specific task]
**Checkpoint:** User can test here and change direction

### 1.2 [Next Step] (Y min) - Checkpoint ⏸
- [ ] [specific task]
**Checkpoint:** User can test here

## 2. Testing
- [ ] E2E tests added (if user-facing)
- [ ] Unit tests added (if business logic)

## 3. Review (run /rapid:review after implementation)
- [ ] @agent-code-verifier: Verify implementation
- [ ] @agent-security-auditor: Security audit
- [ ] Fix any critical issues
```

**`specs/<capability>/spec.md`** - OpenSpec deltas:
```markdown
## ADDED Requirements
### Requirement: [Feature Name]
The system SHALL [requirement text]

#### Scenario: [Success case]
- **WHEN** [condition]
- **THEN** [expected result]

## MODIFIED Requirements
### Requirement: [Existing Feature]
[Complete modified requirement text]

## REMOVED Requirements
### Requirement: [Deprecated]
**Reason**: [why]
**Migration**: [how to migrate existing usage]
```

### 5. Validate Strictly

<thinking>
Run validation to ensure proposal meets all quality standards.
Use rapid show to verify generated files are correct.
</thinking>

```bash
# View generated proposal
rapid show <change-id>

# View deltas only (save tokens)
rapid show <change-id> --json --deltas-only

# Validate structure and content
rapid validate <change-id> --strict
```

Resolve all validation issues before completing.

## Examples

### Example 1: Feature Addition

```
User: "/rapid:proposal Smart Links duplicate prevention"

AI thinking:
→ Need to verify current smart links implementation
→ Research duplicate prevention patterns
→ Check git history for past decisions

AI executes in parallel:

Investigation:
→ Read codebase → Found @src/app/dashboard/smart-links/page.tsx:127
→ Task git-history-analyzer → Found commit fd2db07 "allow duplicates for A/B testing"
→ Task pattern-recognition-specialist → Found similar validation pattern in @src/app/dashboard/projects

Research:
→ Task best-practices-researcher → Found UX patterns for deduplication
→ Task framework-docs-researcher → Next.js 16 form validation patterns

AI synthesizes:
✓ Current code allows duplicates (verified at line 127)
✓ Past decision: duplicates were intentional for A/B testing
✓ Existing pattern: project creation already has duplicate check (should follow same pattern)
✓ Research: midday.ai uses client + DB unique constraint
✓ Framework: Next.js recommends server actions with zod validation

AI presents:
### Option 1: Client + DB Unique Constraint ⭐
- Time: 2h, Risk: Low, Pattern: 100% match with midday.ai
### Option 2: Client Warning Only
- Time: 30m, Risk: Medium (no DB enforcement)

AI: "Which option? Reply '1' or '2'"
User: "1"

AI generates:
✓ proposal.md with verified Before/After code
✓ investigation.md with git findings
✓ research.md with midday.ai references
✓ tasks.md with 5 checkpoints
✓ specs/smart-links/spec.md with deltas
```

### Example 2: Bug Fix

```
User: "/rapid:proposal fix 409 token refresh error"

AI executes in parallel:

Investigation:
→ Read @src/lib/supabase/client.ts → No mutex protection found
→ Task git-history-analyzer → No mutex implementations found in history

Research:
→ Task best-practices-researcher → Supabase auth best practices
→ Task framework-docs-researcher → @supabase/ssr v0.5 changelog

AI synthesizes:
✓ Issue reproduced: Concurrent refresh → 409 (no mutex protection)
✓ Framework update: @supabase/ssr v0.5 has built-in mutex
✓ Alternative: midday uses p-limit for older versions

AI presents options and waits for choice
```

## Anti-Patterns

❌ **Don't: Generate "imaginary code" without verifying**
```
Bad: "I'll update the middleware to add token validation"
→ Never checked if middleware exists!
→ Never verified current token handling!
```

✅ **Do: Investigate first with agents, then propose**
```
Good: "Running parallel investigation and research...

Investigation:
→ Read @src/middleware.ts:42 - Current auth logic
→ git-history-analyzer: Refactored yesterday in commit abc123

Research:
→ best-practices-researcher: Found Next.js 16 middleware patterns

Based on investigation and research, here are 3 options..."
```

❌ **Don't: Research without context**
```
Bad: WebSearch "authentication best practices"
→ Generic results, not tailored to codebase
```

✅ **Do: Use specialized agents**
```
Good: Task framework-docs-researcher(next.js, authentication)
→ Gets Next.js-specific auth patterns
→ Checks project's Next.js version
→ Returns relevant examples
```

## Reference

- Search existing requirements: `rg -n "Requirement:|Scenario:" rapidspec/specs`
- Inspect proposal: `rapid show <id> --json --deltas-only`
- Check specs: `rapid show <spec> --type spec`
- Show diffs (Before → After) with file:line references
- Verify code exists before proposing - never assume or use "imaginary code"

## Notes

- **Always run agents in parallel** for faster context gathering
- **Wait for user confirmation** before generating files
- **Use OpenSpec format** for all proposal files
- **Verify everything** with actual code reads, never assume

<!-- RAPIDSPEC:END -->
