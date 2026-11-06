import { test } from "node:test";
import assert from "node:assert/strict";
import {
  coordinate,
  createScenario,
  locateSchool,
  seed,
  transition,
  type Action,
  type Store,
} from "../lib/demo.ts";
const now = 1800000000000;
function flow(kind = "normal") {
  const { state, id } = createScenario(seed(now), "s1", kind, now);
  let s = state;
  const act = (
    type: string,
    actor = "s1-u0",
    payload: Record<string, unknown> = {},
    schoolId = "s1",
  ) => {
    s = transition(s, { type, actor, schoolId, taskId: id, payload }, now);
    return s.tasks.find((t) => t.id === id)!;
  };
  return {
    act,
    task: () => s.tasks.find((t) => t.id === id)!,
    state: () => s,
    id,
  };
}
test("only one student can claim a task; immutable state; school isolation", () => {
  const { state, id } = createScenario(seed(now), "s1", "normal", now);
  const accepted = transition(
    state,
    { type: "accept", actor: "s1-u1", schoolId: "s1", taskId: id },
    now,
  );
  assert.equal(state.tasks[0].status, "open");
  assert.equal(accepted.tasks[0].runnerId, "s1-u1");
  assert.throws(
    () =>
      transition(
        accepted,
        { type: "accept", actor: "s1-u2", schoolId: "s1", taskId: id },
        now,
      ),
    /已被其他同学/,
  );
  assert.throws(
    () =>
      transition(
        state,
        { type: "accept", actor: "s2-u1", schoolId: "s2", taskId: id },
        now,
      ),
    /不属于当前学校/,
  );
  assert.throws(
    () =>
      transition(
        state,
        { type: "accept", actor: "s1-u0", schoolId: "s1", taskId: id },
        now,
      ),
    /自己发布/,
  );
});
test("delivery proof -> owner acceptance -> payment -> review with authorization", () => {
  const f = flow();
  f.act("accept", "s1-u1");
  assert.throws(() => f.act("message", "s1-u2", { text: "outsider" }));
  f.act("message", "s1-u0", { text: "取件码 8-2046" });
  assert.throws(() => f.act("proof", "s1-u1", { text: "done" }), /图片凭证/);
  f.act("proof", "s1-u1", { text: "已送达", image: "/demo-proof.svg" });
  assert.throws(() => f.act("complete", "s1-u1"));
  f.act("complete");
  assert.equal(f.task().status, "done");
  f.act("pay", "s1-u0", { kind: "reward" });
  assert.equal(f.task().payments[0].state, "paid");
  assert.throws(() => f.act("pay", "s1-u0", { kind: "reward" }), /已结清/);
  f.act("review", "s1-u0", { stars: 5, text: "靠谱" });
  assert.equal(f.task().review?.stars, 5);
  assert.equal(f.state().users.find((u) => u.id === "s1-u1")!.completed, 37);
  assert.ok(
    f
      .state()
      .notifications.some(
        (n) => n.userId === "s1-u1" && n.text.includes("评价"),
      ),
  );
});
test("buy cost changes require approval and preserve independent reward and goods ledger", () => {
  const f = flow("buy");
  f.act("accept", "s1-u1");
  f.act("costRequest", "s1-u1", { amount: 36, reason: "商品涨价" });
  assert.throws(
    () => f.act("proof", "s1-u1", { text: "done", image: "/demo-proof.svg" }),
    /确认费用/,
  );
  assert.throws(() => f.act("approveCost", "s1-u1"));
  f.act("approveCost");
  assert.equal(f.task().actual, 36);
  assert.equal(f.task().reward, 8);
  f.act("proof", "s1-u1", { text: "商品已送达", image: "/demo-proof.svg" });
  f.act("complete");
  f.act("markPaid", "s1-u0", { kind: "goods" });
  assert.equal(f.task().payments[0].state, "marked");
  assert.throws(() => f.act("confirmPaid", "s1-u0", { kind: "goods" }));
  f.act("confirmPaid", "s1-u1", { kind: "goods" });
  f.act("pay", "s1-u0", { kind: "reward" });
  assert.equal(
    f
      .task()
      .payments.filter((p) => p.state === "paid")
      .reduce((n, p) => n + p.amount, 0),
    44,
  );
});
test("prepaid goods must be paid before proof; approved top-up does not charge twice", () => {
  const f = flow("buy");
  const pre = structuredClone(f.state());
  pre.tasks.find((t) => t.id === f.id)!.method = "advance";
  let s = pre;
  const a = (type: string, actor = "s1-u0", payload = {}) => {
    s = transition(
      s,
      { type, actor, schoolId: "s1", taskId: f.id, payload },
      now,
    );
  };
  a("accept", "s1-u1");
  assert.throws(
    () => a("proof", "s1-u1", { text: "done", image: "/demo-proof.svg" }),
    /预付/,
  );
  a("pay", "s1-u0", { kind: "goods" });
  a("costRequest", "s1-u1", { amount: 35, reason: "加一份" });
  a("approveCost");
  a("pay", "s1-u0", { kind: "goods" });
  assert.deepEqual(
    s.tasks[0].payments.map((p) => p.amount),
    [30, 5],
  );
  a("proof", "s1-u1", { text: "done", image: "/demo-proof.svg" });
});
test("dispute blocks settlement; reported user has no violation until resolution", () => {
  const f = flow("dispute");
  f.act("dispute", "s1-u0", { reason: "超时未送达" });
  assert.equal(f.state().users.find((u) => u.id === "s1-u1")!.violations, 0);
  assert.throws(() => f.act("pay", "s1-u0", { kind: "reward" }), /暂停结算/);
  f.act("resolve", "s1-u0", {
    admin: true,
    liable: "runner",
    resolution: "确认无故超时，继续履约",
  });
  assert.equal(f.state().users.find((u) => u.id === "s1-u1")!.violations, 1);
  assert.equal(f.task().status, "active");
});
test("cancelled runner task reopens; rescheduling needs the other participant", () => {
  const f = flow();
  f.act("accept", "s1-u1");
  const before = f.task().deadline;
  f.act("extend", "s1-u1");
  assert.equal(f.task().deadline, before);
  assert.throws(() => f.act("approveExtension", "s1-u1"));
  f.act("approveExtension");
  assert.ok(f.task().deadline > before);
  f.act("cancel", "s1-u1", { reason: "已协商取消" });
  assert.equal(f.task().status, "open");
  assert.equal(f.task().runnerId, undefined);
  f.act("accept", "s1-u2");
  assert.equal(f.task().runnerId, "s1-u2");
});
test("each mock campus resolves coordinates and rejects points outside all campuses", () => {
  for (const schoolId of ["s1", "s2", "s3", "s4", "s5"])
    for (let i = 0; i < 8; i++)
      assert.equal(locateSchool(coordinate(schoolId, i))?.id, schoolId);
  assert.equal(locateSchool({ lat: 0, lng: 0 }), undefined);
});
test("posting validates numbers and routes; expired tasks cannot be claimed", () => {
  const s = seed(now);
  assert.equal(new Set(s.tasks.map((t) => t.schoolId)).size, 5);
  assert.throws(() =>
    transition(
      s,
      {
        type: "create",
        actor: "s1-u0",
        schoolId: "s1",
        payload: {
          title: "test",
          description: "test",
          category: "代买物品",
          from: 1,
          to: 1,
          reward: 5,
          budget: 20,
          minutes: 60,
        },
      },
      now,
    ),
  );
  assert.throws(
    () =>
      transition(
        s,
        { type: "accept", actor: "s1-u0", schoolId: "s1", taskId: "s1-task-0" },
        now + 10 * 60 * 60000,
      ),
    /已经超时/,
  );
});
test("new runners cannot access the old private conversation after cancellation", () => {
  const f = flow();
  f.act("accept", "s1-u1");
  f.act("message", "s1-u0", { text: "old private code" });
  f.act("cancel", "s1-u1", { reason: "协商取消" });
  f.act("accept", "s1-u2");
  assert.equal(f.task().messages.length, 0);
  assert.equal(
    f.task().archivedChats?.[0].messages[0].text,
    "old private code",
  );
  assert.equal(f.task().archivedChats?.[0].runnerId, "s1-u1");
});
test("race demo records winning runner, loser notification and a single assignment", () => {
  const f = flow();
  f.act("race", "s1-u1");
  assert.notEqual(f.task().runnerId, "s1-u1");
  assert.ok(
    f
      .state()
      .notifications.some(
        (n) => n.userId === "s1-u1" && n.text.includes("抢先"),
      ),
  );
  assert.throws(() => f.act("accept", "s1-u1"), /抢先|已被其他/);
});
test("reinspection after dispute cannot double-count completion or violation", () => {
  const f = flow();
  f.act("accept", "s1-u1");
  f.act("proof", "s1-u1", { text: "done", image: "/demo-proof.svg" });
  f.act("complete");
  const completed = f.state().users.find((u) => u.id === "s1-u1")!.completed;
  for (let i = 0; i < 2; i++) {
    f.act("dispute", "s1-u0", { reason: "需要复核" });
    f.act("resolve", "s1-u0", {
      admin: true,
      liable: "runner",
      resolution: "责任已确认，重新验收",
    });
    f.act("complete");
  }
  assert.equal(
    f.state().users.find((u) => u.id === "s1-u1")!.completed,
    completed,
  );
  assert.equal(f.state().users.find((u) => u.id === "s1-u1")!.violations, 1);
});
