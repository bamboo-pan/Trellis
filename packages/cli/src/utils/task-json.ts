/**
 * Canonical task.json shape — single source of truth shared by all TS writers.
 *
 * The runtime Python writer is `.trellis/scripts/common/task_store.py` in
 * `cmd_create` (lines ~147-172). This TS factory mirrors that 24-field shape
 * so bootstrap tasks (trellis init) and migration tasks (trellis update
 * --migrate) produce structurally identical task.json files.
 *
 * Field names, order, and null defaults match task_store.py exactly.
 */

export type PrdStatus = "draft" | "confirmed" | "override";
export type WorkflowStep =
  | "awaiting_implement"
  | "awaiting_check"
  | "awaiting_spec_review"
  | "awaiting_commit"
  | "ready_to_finish";
export type WorkflowVcsKind = "git" | "non-git" | "unknown";

export interface TaskWorkflowVcs extends Record<string, unknown> {
  kind: WorkflowVcsKind;
  commit_required: boolean;
}

export interface TaskWorkflowState extends Record<string, unknown> {
  version: 1;
  current_step: WorkflowStep;
  vcs: TaskWorkflowVcs;
  implement: {
    dispatched_at: string | null;
    completed_at: string | null;
  };
  check: {
    completed_at: string | null;
    fingerprint: string | null;
    head: string | null;
  };
  spec_update: {
    reviewed_at: string | null;
    result: "updated" | "noop" | null;
  };
  commit: {
    hash: string | null;
    recorded_at: string | null;
  };
}

export interface TaskMeta extends Record<string, unknown> {
  prd_status: PrdStatus;
  linear_issue?: string;
  workflow?: TaskWorkflowState;
}

export type TaskJsonOverrides = Partial<Omit<TaskJson, "meta">> & {
  meta?: Partial<TaskMeta> & Record<string, unknown>;
};

export interface TaskJson {
  id: string;
  name: string;
  title: string;
  description: string;
  status: string;
  dev_type: string | null;
  scope: string | null;
  package: string | null;
  priority: string;
  creator: string;
  assignee: string;
  createdAt: string;
  completedAt: string | null;
  branch: string | null;
  base_branch: string | null;
  worktree_path: string | null;
  commit: string | null;
  pr_url: string | null;
  subtasks: string[];
  children: string[];
  parent: string | null;
  relatedFiles: string[];
  notes: string;
  meta: TaskMeta;
}

/**
 * Produce a fully-populated canonical-shape TaskJson.
 *
 * All 24 fields are emitted in canonical order. `overrides` shallow-merges on
 * top — callers should supply the per-task values (id, name, title, assignee,
 * createdAt, etc.) and leave null-default fields untouched unless they have a
 * real value.
 */
function emptyWorkflowState(): TaskWorkflowState {
  return {
    version: 1,
    current_step: "awaiting_implement",
    vcs: {
      kind: "unknown",
      commit_required: false,
    },
    implement: {
      dispatched_at: null,
      completed_at: null,
    },
    check: {
      completed_at: null,
      fingerprint: null,
      head: null,
    },
    spec_update: {
      reviewed_at: null,
      result: null,
    },
    commit: {
      hash: null,
      recorded_at: null,
    },
  };
}

export function emptyTaskJson(overrides: TaskJsonOverrides = {}): TaskJson {
  const today = new Date().toISOString().split("T")[0];
  const workflow = emptyWorkflowState();
  const base: TaskJson = {
    id: "",
    name: "",
    title: "",
    description: "",
    status: "planning",
    dev_type: null,
    scope: null,
    package: null,
    priority: "P2",
    creator: "",
    assignee: "",
    createdAt: today,
    completedAt: null,
    branch: null,
    base_branch: null,
    worktree_path: null,
    commit: null,
    pr_url: null,
    subtasks: [],
    children: [],
    parent: null,
    relatedFiles: [],
    notes: "",
    meta: { prd_status: "draft", workflow },
  };
  const metaOverrides = overrides.meta ?? {};
  return {
    ...base,
    ...overrides,
    meta: {
      ...base.meta,
      ...metaOverrides,
      workflow: metaOverrides.workflow ?? workflow,
    },
  };
}
