# Proposal: a Midnight builder catalog that shows evidence, not verdicts

**Problem.** Newcomers need a safe place to explore what is being built on Midnight, and the ecosystem needs bad projects filtered out without a person reading every submission.

**Approach.** A catalog where every listing carries machine-checkable public evidence, bound to the exact commit it was read at. Checks raise flags with evidence; a human decides; nobody is auto-banned; every flag has an appeal path.

**What works today (open source, runs with Node 22, no dependencies)**
- Browse page with search, filters and per-project evidence checks
- Repo checks: exists, public, original, history, activity, README, owner account age
- Demo/video liveness, contract address format
- Commit-bound results with an "outdated" marker when the repo has moved on
- Secret scan (file and line only, never the value)
- Soft notes: wallet-risk code patterns and look-alike names (context, never scored)
- Test cases: designed bad entries must be flagged; scanners have offline unit tests

**What it is not.** Not an audit, not an endorsement, and it cannot stop a determined scammer alone. A pass means the public facts match what the builder claimed.

**Roadmap (each step is independently useful)**
1. Evidence-receipt format: a signed record of what was checked, at which commit, by which verifier version
2. Signed listings anchored on Midnight, so a listing cannot be silently swapped
3. Live-test receipts and, later, ZK track records (builder proves history without exposing identity)
4. Submission by pull request to `projects.json`; reviewer queue for flags

**Asks.** Is there an official catalog already? Which checks matter most to the ecosystem? Who would act as human reviewer?

Repo: https://github.com/tomiin/midnight-catalog (screenshots in the README)
