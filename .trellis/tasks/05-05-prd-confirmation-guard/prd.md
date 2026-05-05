# Lightweight PRD Confirmation Guard

## Context

A Copilot+Trellis test run showed one PRD confirmation misclassification in nine runs. The model asked one final product preference question, the user answered that local preference, and the model then treated the answer as full PRD confirmation before running `set-prd-status confirmed` and `task.py start`.

This is low-frequency in the current sample, so the accepted remediation is lightweight prompt/workflow hardening rather than a platform-level transcript verifier.

## Requirements

1. Brainstorm guidance must state that answering a final clarification or product preference question is not the same as confirming the entire PRD.
2. Before recording `prd_status=confirmed`, the assistant must present a whole-PRD confirmation summary and require a distinct user response selecting confirm, revise, or override.
3. The assistant must not run `set-prd-status confirmed` in the same turn that it receives an answer to a sub-question unless that same user message explicitly confirms the entire PRD.
4. Planning breadcrumbs and hook messages should point agents back to the structured Step 8 PRD confirmation flow.
5. Regression coverage should assert that the generated guidance contains the new anti-misclassification rule.

## Non-Goals

- Do not add transcript-level user confirmation verification.
- Do not redesign the `prd_status` data model.
- Do not block `override`; the existing explicit override path remains valid.
- Do not change the release package name.

## Verification

- Update or add regression tests for the new guidance text.
- Run focused regression tests for the changed template guidance.
- Run lint, typecheck, build, and relevant package tests before publishing.
