import { describe, expect, it } from "vitest";
import { emptyTaskJson } from "../../src/utils/task-json.js";
import type { TaskMeta } from "../../src/utils/task-json.js";

describe("emptyTaskJson", () => {
  it("includes workflow defaults alongside PRD status", () => {
    const task = emptyTaskJson();

    expect(task.meta.prd_status).toBe("draft");
    expect(task.meta.workflow?.version).toBe(1);
    expect(task.meta.workflow?.current_step).toBe("awaiting_implement");
    expect(task.meta.workflow?.vcs).toEqual({
      kind: "unknown",
      commit_required: false,
    });
    expect(task.meta.workflow?.check).toEqual({
      completed_at: null,
      fingerprint: null,
      head: null,
    });
  });

  it("preserves workflow defaults when meta overrides only PRD status", () => {
    const task = emptyTaskJson({ meta: { prd_status: "confirmed" } });

    expect(task.meta.prd_status).toBe("confirmed");
    expect(task.meta.workflow?.current_step).toBe("awaiting_implement");
  });

  it("allows legacy TaskMeta values to omit workflow", () => {
    const meta: TaskMeta = { prd_status: "draft" };

    expect(meta.workflow).toBeUndefined();
  });
});
