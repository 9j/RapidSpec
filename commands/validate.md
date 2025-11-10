---
name: RapidSpec: Validate
description: Validate proposal structure and run agent reviews
category: RapidSpec
tags: [rapidspec, validate]
allowed-tools: Read, Bash, Grep, Glob, Task
argument-hint: <change-id> [--strict]
---

<!-- RAPIDSPEC:START -->
# Validate RapidSpec

<command_purpose>
Validate OpenSpec proposal structure, format, and content integrity.
Optionally run agent reviews for security, architecture, and quality checks.
</command_purpose>

<change_id> #$ARGUMENTS </change_id>

<critical_requirement>
MUST validate all required files exist before checking format.
MUST report errors, warnings, and info separately with clear severity.
NEVER skip structure validation even in quick mode.
</critical_requirement>

## Main Tasks

### 1. Structure Validation (ALWAYS FIRST)

<thinking>
First, verify that all required OpenSpec files exist and are in correct locations.
This catches missing files early before attempting format validation.
</thinking>

**Immediate Actions:**

   Check required files:
   - [ ] `proposal.md` exists
   - [ ] `tasks.md` exists
   - [ ] At least one spec delta in `specs/*/spec.md`

   Check proposal.md format:
   - [ ] Has "Why" section
   - [ ] Has "What Changes" section
   - [ ] Has "Impact" section
   - [ ] Has options (if decision needed)

   Check tasks.md format:
   - [ ] Tasks use `- [ ]` or `- [x]` checkbox format
   - [ ] Tasks grouped by section (Implementation, Testing, etc.)
   - [ ] Each task is specific and actionable
   - [ ] Includes time estimates

   Check spec deltas:
   - [ ] Uses `## ADDED|MODIFIED|REMOVED|RENAMED Requirements` headers
   - [ ] Each requirement has `### Requirement:` header
   - [ ] Each requirement has at least one `#### Scenario:`
   - [ ] Scenarios use WHEN/THEN format

### 2. Content Validation

<thinking>
After structure validation passes, verify cross-references and consistency.
Check that files mentioned actually exist and tasks align with proposed changes.
</thinking>

**Cross-reference checks:**
   - [ ] Files mentioned in proposal.md exist
   - [ ] Tasks in tasks.md align with proposal
   - [ ] Spec deltas match "What Changes"
   - [ ] Change-id consistent across files

**Git integration:**
   - [ ] Branch name matches change-id (if branch exists)
   - [ ] Commits reference change-id (if commits exist)

### 3. Agent Reviews (Optional)

<thinking>
Optionally run specialized agents to review proposed changes for quality issues.
Agents provide warnings and suggestions but don't block validation unless critical.
</thinking>

<parallel_tasks>

Run these agents in parallel if `--agents` flag present:

**Core Reviewers:**
- Task code-verifier(proposal_files) - Verify no imaginary code
- Task security-auditor(proposal_files) - Check security implications

**Conditional Reviewers:**
- Task nextjs-architecture-expert(proposal_files) - If Next.js changes
- Task database-architect(migration_files) - If database changes
- Task test-automator(proposal_files) - If user-facing features

</parallel_tasks>

### 4. Strict Mode (`--strict` flag)

<thinking>
In strict mode, perform additional formatting and completeness checks.
These are optional quality improvements, not blockers.
</thinking>

**Additional checks:**
   - Markdown formatting (heading levels, lists)
   - Spelling and grammar
   - Link validity (internal links)
   - Code snippet syntax
   - Scenario completeness (all have WHEN/THEN)

**Examples**

Example 1: Valid Proposal
```
User: "/rapid:validate add-loading-state"

AI:
Validating proposal: add-loading-state

Structure Validation:
✓ proposal.md exists
✓ tasks.md exists
✓ spec deltas found: ui/spec.md

Format Validation:
✓ proposal.md format correct
  - Why section ✓
  - What Changes section ✓
  - Impact section ✓
✓ tasks.md format correct
  - 3 tasks with checkboxes ✓
  - Grouped by section ✓
  - Actionable tasks ✓
✓ spec deltas format correct
  - ADDED Requirements ✓
  - Requirement headers ✓
  - Scenarios with WHEN/THEN ✓

Content Validation:
✓ File references valid
✓ Tasks align with proposal
✓ Spec deltas match changes

╔═════════════════════════════════════════╗
║ VALIDATION: ✅ PASSED                   ║
╚═════════════════════════════════════════╝

Proposal ready to implement.
Next: /rapid:apply add-loading-state
```

Example 2: Missing Sections
```
User: "/rapid:validate add-feature"

AI:
Validating proposal: add-feature

Structure Validation:
✓ proposal.md exists
✓ tasks.md exists
✓ spec deltas found

Format Validation:
❌ proposal.md format issues:
  - Missing "Why" section
  - Missing "Impact" section
✓ tasks.md format correct
⚠️ spec deltas issues:
  - Scenario missing THEN clause (line 42)

╔═════════════════════════════════════════╗
║ VALIDATION: ❌ FAILED (2 errors, 1 warn)║
╚═════════════════════════════════════════╝

Fix required:
1. Add "Why" section to proposal.md
2. Add "Impact" section to proposal.md
3. Add THEN clause to scenario at line 42

Fix now? (yes to fix)
```

Example 3: Strict Mode
```
User: "/rapid:validate add-feature --strict"

AI:
Validating proposal: add-feature (strict mode)

[Standard checks pass...]

Strict Mode Checks:
✓ Markdown formatting correct
✓ Heading hierarchy valid
⚠️ Spelling issues:
  - Line 23: "valdiation" → "validation"
  - Line 45: "seperately" → "separately"
✓ Links valid
✓ Code syntax correct
⚠️ Scenario completeness:
  - Scenario at line 89: Missing error case

╔═════════════════════════════════════════╗
║ VALIDATION: ⚠️ PASSED (2 warnings)      ║
╚═════════════════════════════════════════╝

Warnings (can proceed):
- Fix spelling errors
- Add error case scenario

Fix warnings? (yes to fix, skip to continue)
```

Example 4: With Agent Reviews
```
User: "/rapid:validate add-admin-panel"

AI:
Validating proposal: add-admin-panel

Structure: ✅ Pass
Format: ✅ Pass
Content: ✅ Pass

Running agent reviews...

@agent-security-auditor:
⚠️ Proposed change creates admin_logs table
   Reminder: Must enable RLS policy
   Add to tasks.md: "Enable RLS on admin_logs"

@agent-database-architect:
💡 Suggestion: Add index on user_id
   Performance: Queries by user_id common

╔═════════════════════════════════════════╗
║ VALIDATION: ✅ PASSED (1 warn, 1 info)  ║
╚═════════════════════════════════════════╝

Update tasks.md with security reminder? (yes)
```

**When to Run**

Before `/rapid:apply`:
- Ensure proposal structure correct
- Catch format issues early
- Validate spec deltas

After editing proposal:
- Re-validate after manual changes
- Check consistency

Before archiving:
- Ensure completed spec is valid
- Run with `--strict` for final check

**Command Variations**

Basic validation:
```bash
/rapid:validate <change-id>
```

Strict validation:
```bash
/rapid:validate <change-id> --strict
```

With agent reviews:
```bash
/rapid:validate <change-id> --agents
```

**Anti-Patterns**

❌ Don't: Skip validation before apply
```
Bad: Create proposal → /rapid:apply immediately
→ Missing sections, malformed spec
```

✅ Do: Validate first
```
Good: Create proposal → /rapid:validate → Fix → /rapid:apply
```

**Reference**
- Validate before implementing: `/rapid:validate <id>`
- Strict mode for comprehensive checks: `--strict`
- Agent reviews optional: `--agents`
- Validation report shows errors (block), warnings (should fix), info (nice to have)
- User says "yes" (fix), "skip" (proceed anyway)
- After validation passes, run `/rapid:apply <id>`

<!-- RAPIDSPEC:END -->
