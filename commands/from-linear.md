---
name: RapidSpec: From Linear
description: Convert Linear issue to RapidSpec proposal
category: RapidSpec
tags: [rapidspec, linear, import]
allowed-tools: Read, Write, Edit, Bash, WebSearch, Task
argument-hint: <issue-id-or-url>
---

<!-- RAPIDSPEC:START -->
# Create Proposal from Linear Issue

<command_purpose>
Convert Linear issues to RapidSpec proposals with automated research and verification.
Fetch issue details, run parallel agents for research, present options, generate files.
</command_purpose>

<issue_id> #$ARGUMENTS </issue_id>

<critical_requirement>
MUST fetch full Linear issue details before proceeding.
MUST run standard proposal research with parallel agents.
MUST present options and wait for user choice.
NEVER generate files without verification and research.
</critical_requirement>

## Main Tasks

### 1. Fetch Linear Issue (ALWAYS FIRST)

<thinking>
Fetch complete Linear issue data including description, comments, and links.
Parse requirements and acceptance criteria from issue content.
</thinking>

**Fetch process:**
   ```bash
   # Via Linear API
   linear issue <issue-number>
   ```
   - Get title, description, comments
   - Get linked issues and PRs
   - Get current status, assignee, labels
   - Extract acceptance criteria from description

### 2. Analyze Requirements

<thinking>
Parse Linear issue content to extract requirements and constraints.
Map to RapidSpec format (Why, What, Impact).
</thinking>

**Analysis process:**
   - Parse user requirements from description
   - Identify acceptance criteria (bullet points, numbered lists)
   - Extract technical constraints from comments
   - Map to RapidSpec format (Why, What, Options)

### 3. Research & Verify (Parallel Agents)

<thinking>
Run parallel agents to verify code and research best practices.
This prevents "imaginary code" and ensures evidence-based proposals.
</thinking>

<parallel_tasks>

Run these agents in parallel:

**Verification:**
- Task code-verifier(feature_description, affected_files)
- Task git-history-analyzer(affected_files)

**Research:**
- Task best-practices-researcher(feature_description, technology_stack)
- Task framework-docs-researcher(detected_framework)

</parallel_tasks>

### 4. Present Options

<thinking>
Synthesize agent findings into 2-3 concrete implementation options.
Present pros/cons/cost and wait for user decision.
</thinking>

**Option presentation:**
   - Show 2-3 implementation approaches
   - Include pros/cons/cost for each
   - Mark recommended option with ⭐
   - Wait for user choice: "1", "2", "yes"

### 5. Generate Proposal Files

<thinking>
Create RapidSpec files in rapidspec/changes/ directory.
Use verified code and research findings from agents.
</thinking>

**File generation:**
   - Create `rapidspec/changes/<change-id>/`
   - Generate `proposal.md` with Linear link
   - Create `investigation.md`, `research.md`, `tasks.md`
   - Create spec deltas in `specs/<capability>/spec.md`

### 6. Update Linear Issue

<thinking>
Link Linear issue back to generated proposal.
Add label and comment so team can track spec progress.
</thinking>

**Linear integration:**
   - Add label: "has-spec"
   - Add comment with spec link
   - Update description with proposal link (optional)

## Linear → Spec Mapping

| Linear Field | Maps To |
|-------------|---------|
| Title | Change title |
| Description | Why section |
| Acceptance Criteria | Requirements |
| Comments | Investigation notes |
| Labels | Spec tags |
| Linked Issues | Related changes |
| Assignee | (preserved in Linear) |

**Examples**

Example 1: Feature Request
```
User: "/rapid:from-linear 123"

AI:
Fetching Linear issue #123...
✓ Found: "[Feature] Add two-factor authentication"
✓ Status: In Progress
✓ Assignee: @chanhee
✓ Description: 850 chars
✓ Acceptance criteria: 3 items

Analyzing requirements...
Main goal: Add 2FA for enhanced security
Requirements:
  - TOTP support (authenticator apps)
  - QR code generation
  - Backup codes (8 codes)
Acceptance criteria:
  1. Users can enable 2FA in settings
  2. QR code shown for initial setup
  3. Backup codes generated and downloadable

Generating change-id...
Suggested: add-two-factor-auth
Proceed? (yes or custom name)

User: "yes"

AI:
Research & verification...
✓ Read @src/app/settings/page.tsx
✓ WebSearch: "Supabase 2FA implementation 2025"
✓ Found: Supabase Auth v2.38+ has built-in 2FA

Options:

### Option 1: Supabase Auth TOTP ⭐
- Use built-in `supabase.auth.mfa.enroll()`
- QR code via `data:image` URI
- Time: 4 hours, Risk: Low
- Pros: Official support, maintained
- Cons: Locked to Supabase

### Option 2: Custom with speakeasy
- Full control, flexible
- Time: 2 days, Risk: Medium
- Pros: Portable, customizable
- Cons: Security maintenance burden

Which? (1 or 2)

User: "1"

AI:
Creating proposal...
✓ Created: rapidspec/changes/add-two-factor-auth/
✓ Files:
  - proposal.md (linked to Linear #123)
  - investigation.md
  - research.md
  - tasks.md
  - specs/auth/spec.md

Updating Linear #123...
✓ Added label: "has-spec"
✓ Added comment:
  "RapidSpec proposal created: rapidspec/changes/add-two-factor-auth/
   Next: /rapid:apply add-two-factor-auth"

Done!
Next steps:
- Review: rapidspec/changes/add-two-factor-auth/proposal.md
- Implement: /rapid:apply add-two-factor-auth
```

Example 2: Bug Report
```
User: "/rapid:from-linear https://linear.app/team/issue/BUG-456"

AI:
Fetching Linear issue BUG-456...
✓ Found: "[Bug] 409 token refresh race condition"
✓ Description: "Users see 409 errors when refreshing in multiple tabs"
✓ Comments: 5 (includes reproduction steps)

Analyzing...
Problem: Token refresh race condition
Reproduction: Open app in 2 tabs → 409 error
Expected: Graceful mutex handling

Suggested change-id: fix-token-refresh-race
Proceed? (yes)

User: "yes"

AI researches and presents options...
```

Example 3: Incomplete Issue
```
User: "/rapid:from-linear 789"

AI:
Fetching Linear issue #789...
✓ Found: "Add search"
⚠️  Description is empty (3 chars)
⚠️  No acceptance criteria

Issue incomplete. Options:
1. Add details in Linear first (recommended)
2. Create minimal proposal (needs manual editing)

Which? (1 or 2)

User: "1"

AI:
Opening Linear issue in browser...
Please add:
- Description: What should search do?
- Acceptance criteria: How will we know it works?

Run /rapid:from-linear 789 again when ready.
```

**Error Handling**

Issue not found:
```
❌ Linear issue #123 not found
- Check issue number
- Verify LINEAR_API_KEY is set: echo $LINEAR_API_KEY
- Ensure issue is in configured team
```

API error:
```
❌ Linear API error: Unauthorized
Fix:
1. Get API key: https://linear.app/settings/api
2. Set: export LINEAR_API_KEY=lin_api_...
3. Retry: /rapid:from-linear 123
```

**Anti-Patterns**

❌ Don't: Generate proposal without research
```
Bad: Parse Linear → Generate files immediately
→ No code verification, no options
```

✅ Do: Research first, then present options
```
Good: Parse Linear → Research → Options → Generate
```

**Reference**
- Linear API: Auto-fetch via issue number or URL
- Change-id: Kebab-case from title (e.g., "add-two-factor-auth")
- Auto-label: "has-spec"
- Auto-comment: Link to proposal
- User says "yes" (go), "wait" (wait), "no" (no)
- After generation, suggest `/rapid:apply <change-id>`

<!-- RAPIDSPEC:END -->
