# Trellis Fork：bamboo-pan 分发版

[English](./README_FORK.md)

本仓库是上游 Trellis 项目的 fork。本文用于区分 bamboo-pan 分发版和 Mindfold 官方版本。

- 上游仓库：https://github.com/mindfold-ai/Trellis
- Fork 仓库：https://github.com/bamboo-pan/Trellis
- 上游 npm 包：`@mindfoldhq/trellis`
- Fork npm 包：`@bamboo-pan/trellis`

## 对比基线

下面的 fork 独有变化摘要在 2026-05-05 对比生成，对比目标是上游 `mindfold-ai/Trellis` main 的 `33efa6476d89cffcd979f3b2b0ec4542109d8074`。Fork 基线是 `bamboo-pan/Trellis` main 的 `c811d9ad68c19e2231b4140484a9f9cca413bd88`，再加上当前分支里的 npm fork 发布配置改动。

如果任一仓库继续前进，请在发布新的 fork 版本前重新对比 upstream diff，并更新本节。

## 安装

这个 fork 保留原始 CLI 命令名，方便作为兼容替代版本使用：

```bash
npm install -g @bamboo-pan/trellis@rc
trellis init -u your-name
```

上面的 `@rc` 安装命令要求 fork 包发布时带有 `rc` npm dist-tag，例如在 `packages/cli` 目录执行 `pnpm publish --access public --tag rc`。

维护者请按 [docs/fork-npm-publish.md](docs/fork-npm-publish.md) 里的 fork 发布流程操作。可靠的手动路径是先完成 npm web 登录，再通过临时 npm userconfig 使用 token 发布。

同时也保留短命令：

```bash
tl --help
```

因为该 fork 仍然使用 `trellis` 和 `tl` 作为全局命令名，如果它和 `@mindfoldhq/trellis` 同时全局安装，最后安装的包会拥有这些命令入口。

## 官方上游不存在的变化

| 范围 | bamboo-pan fork 的变化 | 对用户的影响 |
| --- | --- | --- |
| npm 分发身份 | 包名改为 `@bamboo-pan/trellis`，repository/homepage/issues 元数据指向 `bamboo-pan/Trellis`，workspace、CI、publish、manifest 和 release 检查也都改为面向 fork 包。 | 用户需要显式安装 fork 包。Fork 发布流程不会查询或发布到官方 `@mindfoldhq/trellis` 包。 |
| fork 专用 npm README | 发布时把本文对应的英文 fork README 作为 npm 包 README，并把中文 fork 说明一起放进 npm 包。 | npm 页面和 tarball 会明确显示这是非官方 bamboo-pan 分发版。 |
| 工作流状态机 | 围绕 `task.py` 增加轻量任务工作流状态机，包括持久化的 `meta.workflow.current_step`、workflow guard/mark 行为，以及 `workflow_state.py` 等新的 Trellis 模板脚本。 | 默认流程更难被意外跳过：实现、检查、spec review、commit、finish、archive 都有更强的命令级 gate。 |
| PRD 确认 gate | 在 `task.py start` 前加入 PRD 状态追踪，必须显式确认或 override 后才能从 planning 进入 implementation。 | Agent 不应在需求确认前开始实现。 |
| 检查新鲜度与收尾 gate | 记录检查新鲜度和 commit 状态；后续代码或 spec 变更会让旧检查失效。Git 项目 finish/archive 前需要记录当前 commit；非 git 项目可以跳过 commit gate。 | 降低“改完没重新检查”“旧检查覆盖新改动”“未记录 commit 就收尾”的风险。 |
| 主会话 agent 流程强化 | 为主会话何时派发 `trellis-implement`、`trellis-check` 和 spec review 增加 workflow 指引与平台 hook。 | 这个 fork 试图让实现、检查、spec review 的角色分工在不同 agent 平台上更稳定。 |
| 平台专项修复 | 增加 Codex 子代理任务 fallback 和 OpenCode POSIX shell context prefix 这类 fork 独有修复。 | 改善 shell 敏感 agent 环境里的任务上下文恢复与命令兼容性。 |
| 验证材料 | 增加 fork 本地评估与复核材料，例如 `Test_results.md` 和 `trellis-platform-state-machine-review.md`。 | 用户可以查看状态机为什么存在，以及它相对 RC 基线改善了哪些行为。 |

## 保持一致的部分

- 项目仍然是 Trellis：用于 specs、tasks、workflows 和 session memory 的 AI coding harness。
- 为了兼容，CLI 入口仍然是 `trellis` 和 `tl`。
- 许可证仍然是 `AGPL-3.0-only`；发布修改版时仍需注意上游许可证和源码可获得性要求。
- 上游文档仍然适用于核心概念和工作流：https://docs.trytrellis.app/

## 发布说明维护

每次发布 fork 版本前，请更新“官方上游不存在的变化”，写清楚用户能感知到的行为差异。纯本地任务日志不需要列入，除非它解释了已发布行为或验证结果。

## 原项目致谢

Trellis 最初由 Mindfold 开发。这个 fork 不是 Mindfold 官方 npm 包。官方源码、release、issue 和项目品牌信息请以 https://github.com/mindfold-ai/Trellis 为准。