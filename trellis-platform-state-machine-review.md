# Trellis 状态机约束现状

> 更新日期：2026-05-05
>
> 本文记录 Trellis 当前标准流程里，哪些阶段已经由持久状态和命令 gate 形成强状态机，哪些阶段仍主要依赖提示词、子代理职责和模型自我约束。

## 约束定义

| 类型 | 含义 |
|---|---|
| 强状态机 | 有持久状态、命令 gate 或运行时拒绝逻辑，非法顺序会被命令拒绝，能阻止继续推进。 |
| 混合约束 | 已有状态或 guard 兜底，但触发 mark、派发子代理或判断质量仍依赖模型执行。 |
| 提示词约束 | 主要靠 workflow、session-start、agent prelude、命令说明或测试保护，模型仍可能无视。 |

## 结论摘要

Trellis 已经从“workflow + 提示词提醒”升级为“轻量状态机 + 命令级硬 gate + 提示词协作”。

现在已经变成强状态机的部分：PRD confirmation 后才能 start、`meta.workflow.current_step` 细步骤、check freshness、spec review 落盘、git commit 记录与 HEAD 校验、finish/archive 前置 gate、non-git 跳过 commit gate。

仍主要靠提示词和模型自律的部分：是否真的派 `trellis-implement` / `trellis-check` / `trellis-update-spec`，子代理检查质量，主会话是否避免直接写代码，commit 内容质量，以及 Copilot 等平台的上下文可见性。

第一阶段尚未实现工具级写入拦截，也没有让子代理 hook 自动 mark 所有状态，因此“流程顺序”已经硬化，“执行者是否按角色行动”仍是软约束。

## 测试结果对比：自定义版本2 vs RC

对比来源：`Test_results.md` 中 RC 版本 8 条记录与自定义版本2 8 条记录。评估口径不是追求 100% mechanical follow，而是判断 Trellis 核心流程是否被守住：先 task/PRD/context，再 start，再 implement 子代理，再 check 子代理，再 spec update gate；non-git 场景不应继续被 commit 阶段卡死。

| 检查项 | RC 版本 | 自定义版本2 | 结论 |
|---|---:|---:|---|
| 先创建 task 并进入 PRD/brainstorm | 8/8 | 8/8 | 稳定，无退化。 |
| research 落到 `research/*.md` 且主要由 `trellis-research` 完成 | 4/8 | 7/8 | 明显改善，但仍有 1 条 Codex 记录由主线程完成站点研究。 |
| `implement.jsonl` / `check.jsonl` 在 start 前配置 | 8/8 | 8/8 | 稳定，无退化。 |
| PRD confirmed 后再 `task.py start` | 8/8 | 8/8 | 稳定，无退化。 |
| Phase 2.1 使用 `trellis-implement`，不由主线程直接实现 | 7/8 | 8/8 | 核心改善；RC 中 Codex 有 1 条直接实现，第二版已消除。 |
| Phase 2.2 使用 `trellis-check` | 7/8 | 8/8 | 核心改善；第二版已稳定派发检查子代理。 |
| Phase 3.3 显式执行 `trellis-update-spec` gate | 6/8 | 8/8 | 核心改善；第二版不再依赖“顺手更新”或口头判断。 |
| non-git commit 分支处理 | 0/8 | 约 5/8 | 明显改善；第二版开始识别 `vcs.kind=non-git` / `commit_required=false`，但仍有记录沿用“没 commit 所以未完成”的旧表述。 |
| 到达 `ready_to_finish` 或已归档 | 0/8 | 5/8 | 实质改善；核心执行链后能推进到可收尾状态。 |
| 完成 archive / journal 生命周期闭环 | 0/8 | 1/8 | 改善有限；这属于收尾自动化和状态记账问题，不是核心执行主干失守。 |

结论：自定义版本2相对 RC 的核心预期已经实现。Phase 2 的 implement/check 子代理主干从“偶发失守”变成 8/8 稳定执行，Phase 3.3 的 spec update gate 也从 6/8 提升到 8/8；non-git commit 处理从普遍阻塞改善为多数样本可进入 `ready_to_finish`。如果验收标准是“核心流程能守住”，第二版可以判定为成功。

剩余问题主要集中在收尾层，而不是核心流程层：`workflow mark` 仍需手动补录，`implement-dispatched` 等审计字段可能缺失，active task / hook 状态偶尔漂移，`/finish-work` / archive 没有在多数样本中自动闭环。这些问题影响可追踪性和收尾体验，但不推翻第二版已经守住 task -> PRD/context -> implement -> check -> spec gate 主干的结论。

## 最新状态表

| 阶段 / Gate | 当前约束类型 | 强状态机覆盖 | 仍靠提示词 + 模型自我约束 |
|---|---|---|---|
| Phase 1.0 创建任务 | 强状态机 | `task.py create` 写入 `task.json.status=planning`，并可设置 session active task。 | 是否该创建任务仍由主会话按 workflow 判断。 |
| Phase 1.1 写 PRD | 提示词约束 | 无命令级 gate 强制 PRD 内容质量。 | 依赖 `trellis-brainstorm`、workflow、PRD checklist。 |
| Phase 1.3 curate `implement.jsonl` / `check.jsonl` | 混合约束 | `task.py validate` 能检查 JSONL 结构和路径有效性。 | 是否认真选择正确 spec / research context 仍靠模型执行。 |
| PRD confirmation | 强状态机 | `meta.prd_status=confirmed/override` 后才能 `task.py start`。 | 用户确认语义是否真实充分，仍靠模型判断。 |
| Phase 1.4 `start` 进入实现 | 强状态机 | `task.py start` 写 `status=in_progress`，并初始化 `meta.workflow.current_step=awaiting_implement`；未确认 PRD 时不会写 active session。 | 触发 start 的时机仍靠主会话遵守流程。 |
| Phase 2.1 派发 implement | 混合约束 | `workflow guard dispatch-implement`、`implement-dispatched`、`implement-completed` 可落盘实现阶段状态。 | 是否真的由 `trellis-implement` 子代理实现，而不是主会话直接改，仍主要靠提示词；尚无工具级写入拦截。 |
| 实现完成后进入 check | 混合偏强 | `workflow mark implement-completed` 推进到 `awaiting_check`；没有该状态时后续 check / spec / commit gate 会挡住。 | 实现代理结束后是否主动 mark，仍靠流程执行。 |
| Phase 2.2 派发 check | 混合约束 | `workflow guard dispatch-check` 只允许在 `awaiting_check`；`check-completed` 记录 fingerprint 和 HEAD。 | 是否真的派 `trellis-check`，以及 check 是否足够深入，仍靠提示词和模型能力。 |
| Phase 3.1 check freshness | 强状态机 | `check-completed` 记录 code fingerprint；commit / finish / archive 前重新计算，不一致会拒绝。 | 该跑哪些验证命令仍由 check 代理判断。 |
| Phase 3.3 spec update 显式判断 | 强状态机 | `spec-reviewed-updated/noop` 推进状态；未记录则不能进入 commit / finish / archive。 | 判断“是否需要更新 spec”的质量仍靠 `trellis-update-spec` / 模型判断。 |
| spec 更新后重跑 check | 强状态机 | spec 或代码变更会使 freshness 失效；重复 `check-completed` 可刷新状态；git 项目会清空旧 commit 记录并回到 `awaiting_commit`。 | 是否及时重跑 check 由流程提示触发，但 gate 会兜底挡住后续。 |
| Phase 3.4 commit 前 gate | 强状态机 | git 项目必须处于 `awaiting_commit` 且 check fresh；`commit-recorded` 记录当前 HEAD。 | 真正执行 `git commit` 仍由主会话操作。 |
| commit 记录有效性 | 强状态机 | finish / archive 前要求 recorded commit 等于当前 HEAD；旧 hash 会被拒绝。 | commit message 和 commit 内容质量仍靠主会话判断。 |
| non-git 项目 commit 跳过 | 强状态机 | `vcs.kind=non-git` 时 spec review 后直接进入 `ready_to_finish`，不要求 commit hash。 | 无。 |
| `task.py finish` | 强状态机 | finish 前执行 guard；不满足时不会清 active session。 | 是否应该 finish、archive 或继续开发，仍靠流程判断。 |
| `task.py archive` / `/finish-work` 核心完成 | 强状态机 | archive 前执行 guard；不满足时不会写 completed、移动目录、清 session 或 auto-commit archive。 | `/finish-work` 的汇报、journal 摘要质量仍靠模型。 |
| 主会话禁止直接写代码 | 提示词约束 | 第一阶段没有 PreToolUse / Edit / Write 物理拦截。 | 依赖 workflow breadcrumb、agent 说明，以及用户未给 inline override。 |
| 平台上下文可见性，尤其 Copilot | 提示词约束 | 命令级 gate 对所有平台有效。 | Copilot session-start 仍偏 diagnostic-only，主会话看到多少上下文不如 Claude / OpenCode 稳定。 |
| 状态恢复 / continue 判断下一步 | 混合约束 | `meta.workflow.current_step` 可直接读当前细步骤。 | 如何把状态翻译成下一步行动，仍靠 `/continue` 或模型执行。 |

## 当前状态机边界

Trellis 仍保留粗生命周期：

```text
planning -> in_progress -> completed
```

细流程状态写入 `task.json.meta.workflow.current_step`：

```text
awaiting_implement
  -> awaiting_check
  -> awaiting_spec_review
  -> awaiting_commit      # 仅 git 项目需要
  -> ready_to_finish
```

非 git 项目在 spec review 后跳过 `awaiting_commit`：

```text
awaiting_implement
  -> awaiting_check
  -> awaiting_spec_review
  -> ready_to_finish
```

核心事件：

```text
implement-dispatched
implement-completed
check-completed
spec-reviewed-updated
spec-reviewed-noop
commit-recorded
ready-to-finish
```

核心 guard action：

```text
start
dispatch-implement
dispatch-check
review-spec
commit
finish
archive
```

## 平台差异

| 平台 | 命令级状态机 | 主会话提示可见性 | 主要残留风险 |
|---|---|---|---|
| Claude | 同等适用 | 较强，workflow / session-start / agent 文件通常可见。 | 没有工具级写入拦截时，主会话仍可能越权 inline。 |
| Codex | 同等适用 | 中等，更多依赖 pull-based prelude 和模型主动读上下文。 | 主会话是否派 implement/check/update-spec 仍靠自律。 |
| OpenCode | 同等适用 | 较强，plugin/session-utils 对当前状态注入较稳定。 | 仍未做到 Edit/Write 物理阻断。 |
| Copilot | 同等适用 | 较弱，SessionStart 偏 diagnostic-only。 | 主会话可能看不到完整状态提示，尤其需要命令 gate 兜底。 |

## 仍未强约束的部分

1. 子代理派发本身没有硬拦截：状态机可以拒绝后续步骤，但不能物理强制主会话必须先调用某个子代理。
2. 主会话写代码没有工具层拦截：还没有 PreToolUse / Edit / Write blocker。
3. PRD、check、spec update、commit message 的质量仍由模型判断，状态机只验证流程顺序和落盘事实。
4. Copilot 等平台的主会话上下文可见性仍弱于 Claude / OpenCode。
5. 子代理完成后自动 mark 尚未完全接入 hook，当前仍依赖主会话或代理按流程调用 `task.py workflow mark`。

## 下一步建议

| 优先级 | 建议 | 目的 |
|---|---|---|
| P1 | 给支持 hook 的平台增加主会话 Edit/Write/Bash blocker。 | 把“主会话不得直接实现”从提示词约束升级为工具级硬约束。 |
| P1 | 在子代理 dispatch / stop hook 中自动写 `implement-dispatched`、`implement-completed`、`check-completed`。 | 减少状态漂移，降低忘记 mark 的概率。 |
| P2 | 将 breadcrumb 精简为 `state / next / blocked`，直接读取 `meta.workflow.current_step`。 | 降低 token 与认知负担，让恢复工作更稳。 |
| P2 | 增加 repair / override 命令。 | 处理用户手动修复、旧任务迁移、hook 漏 mark 等误拦截。 |
| P3 | 补齐跨平台提示同步。 | 让 Claude、Codex、OpenCode、Copilot 对新状态机的说明保持一致。 |

## 最终判断

当前 Trellis 的 Phase 2/3 已经从“纯提示词流程”升级为“命令级轻量强状态机”。

它能硬性阻止跳过 check、跳过 spec review、旧 check 覆盖新改动、未记录 commit 就 finish/archive、non-git 被 commit gate 卡住等问题。

它还不能硬性保证模型一定派正确子代理、一定不直接写代码、一定做高质量 review。这些仍是下一阶段工具级 gate 和 hook 自动 mark 要解决的部分。