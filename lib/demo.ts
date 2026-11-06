export type Category = "快递代取" | "代买物品" | "物品递送" | "学习互助";
export type Status =
  | "open"
  | "active"
  | "review"
  | "done"
  | "dispute"
  | "cancelled";
export type Message = {
  id: string;
  userId: string;
  text: string;
  image?: string;
  at: number;
};
export type Payment = {
  id: string;
  kind: "goods" | "reward";
  amount: number;
  state: "pending" | "marked" | "paid";
  via?: string;
};
export type Task = {
  id: string;
  schoolId: string;
  category: Category;
  title: string;
  description: string;
  from: number;
  to: number;
  reward: number;
  budget: number;
  actual: number;
  method: "advance" | "reimburse";
  size: string;
  createdAt: number;
  deadline: number;
  ownerId: string;
  runnerId?: string;
  status: Status;
  messages: Message[];
  events: { text: string; at: number }[];
  proof?: { text: string; image?: string };
  costRequest?: { amount: number; reason: string; image?: string };
  costApproved: boolean;
  completedRecorded?: boolean;
  violationUsers?: string[];
  extensionRequest?: number;
  payments: Payment[];
  archivedChats?: { runnerId: string; messages: Message[] }[];
  dispute?: { reason: string; resolution?: string; liable?: string };
  review?: { stars: number; text: string };
  cancellation?: string;
};
export type User = {
  id: string;
  schoolId: string;
  name: string;
  initials: string;
  major: string;
  completed: number;
  accepted: number;
  color: string;
  violations: number;
};
export type Notification = {
  id: string;
  schoolId: string;
  userId: string;
  taskId: string;
  text: string;
  at: number;
  read: boolean;
};
export type Store = {
  version: number;
  tasks: Task[];
  users: User[];
  notifications: Notification[];
};
export const STORE_KEY = "campus-help-demo-v1";
export const categories: Category[] = [
  "快递代取",
  "代买物品",
  "物品递送",
  "学习互助",
];
export const statusNames: Record<Status, string> = {
  open: "待接单",
  active: "进行中",
  review: "待验收",
  done: "已完成",
  dispute: "争议处理中",
  cancelled: "已取消",
};
export const schools = [
  {
    id: "s1",
    name: "青禾大学",
    short: "青禾",
    lat: 31.3,
    lng: 121.5,
    radius: 1.8,
  },
  {
    id: "s2",
    name: "知行理工大学",
    short: "知行",
    lat: 31.04,
    lng: 121.43,
    radius: 1.6,
  },
  {
    id: "s3",
    name: "望舒师范大学",
    short: "望舒",
    lat: 30.28,
    lng: 120.13,
    radius: 1.5,
  },
  {
    id: "s4",
    name: "南川科技大学",
    short: "南川",
    lat: 32.08,
    lng: 118.8,
    radius: 1.7,
  },
  {
    id: "s5",
    name: "云栖艺术学院",
    short: "云栖",
    lat: 30.23,
    lng: 120.1,
    radius: 1.3,
  },
];
export const placeNames = [
  "北区菜鸟驿站",
  "东区学生公寓",
  "梧桐生活超市",
  "南区学生公寓",
  "知新图书馆",
  "第一教学楼",
  "西区学生公寓",
  "学生活动中心",
];
export const areas = [
  "北区",
  "东区",
  "生活区",
  "南区",
  "教学区",
  "教学区",
  "西区",
  "生活区",
];
const offsets = [
  [0.004, -0.003],
  [0.002, 0.005],
  [0, 0.001],
  [-0.004, 0.002],
  [0.001, -0.002],
  [-0.002, -0.004],
  [0.001, -0.006],
  [-0.001, 0],
];
export function coordinate(schoolId: string, place: number) {
  const s = schools.find((s) => s.id === schoolId)!;
  return { lat: s.lat + offsets[place][0], lng: s.lng + offsets[place][1] };
}
export function distance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const rad = Math.PI / 180;
  const x =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
    Math.cos(a.lat * rad) *
      Math.cos(b.lat * rad) *
      Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
export function locateSchool(point: { lat: number; lng: number }) {
  return schools
    .map((s) => ({ ...s, distance: distance(point, s) }))
    .filter((s) => s.distance <= s.radius)
    .sort((a, b) => a.distance - b.distance)[0];
}
export function money(n: number) {
  return n.toFixed(2);
}
export function uid() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}
export function seed(now = Date.now()): Store {
  const users: User[] = schools.flatMap((s) => [
    {
      id: `${s.id}-u0`,
      schoolId: s.id,
      name: "林小满",
      initials: "满",
      major: "设计学院 · 大二",
      completed: 8,
      accepted: 8,
      color: "#e6b07c",
      violations: 0,
    },
    {
      id: `${s.id}-u1`,
      schoolId: s.id,
      name: "程一诺",
      initials: "诺",
      major: "信息学院 · 大三",
      completed: 36,
      accepted: 37,
      color: "#83a99b",
      violations: 0,
    },
    {
      id: `${s.id}-u2`,
      schoolId: s.id,
      name: "许知夏",
      initials: "夏",
      major: "人文学院 · 大一",
      completed: 0,
      accepted: 0,
      color: "#b0a2d2",
      violations: 0,
    },
    {
      id: `${s.id}-u3`,
      schoolId: s.id,
      name: "周予安",
      initials: "安",
      major: "建筑学院 · 大二",
      completed: 21,
      accepted: 21,
      color: "#83a7c7",
      violations: 0,
    },
  ]);
  const definitions = [
    [
      "帮取一个小快递，顺路就好",
      "快递代取",
      0,
      1,
      5,
      0,
      42,
      "一个轻巧的小包裹，送到东区公寓楼下就可以。取件码接单后发，辛苦啦！",
    ],
    [
      "想喝一杯热拿铁，求顺路带一杯",
      "代买物品",
      2,
      4,
      8,
      22,
      55,
      "梧桐超市旁的咖啡角，热拿铁、中杯、无糖。请先确认商品价格。",
    ],
    [
      "帮忙把画筒送到第一教学楼",
      "物品递送",
      6,
      5,
      6,
      0,
      80,
      "一个 A2 画筒，不重，麻烦轻拿轻放。到楼下发消息，我下来取。",
    ],
    [
      "图书馆还书搭个手",
      "学习互助",
      3,
      4,
      0,
      0,
      150,
      "两本书需要归还，如果你刚好去图书馆，可以帮我带一下吗？请你喝汽水！",
    ],
    [
      "晚饭帮带一份三明治和牛奶",
      "代买物品",
      2,
      6,
      5,
      18,
      35,
      "全麦鸡蛋三明治一份、250ml 纯牛奶一盒，没有的话请先联系我。",
    ],
    [
      "北区快递站取件，今天内送达",
      "快递代取",
      0,
      3,
      4,
      0,
      240,
      "一箱书，约 2kg。请帮忙送到南区公寓楼下，时间可以商量。",
    ],
    [
      "社团活动物料，帮忙送到活动中心",
      "物品递送",
      5,
      7,
      10,
      0,
      90,
      "两袋装饰纸和气球，有提手，方便拿。活动 2 小时后开始。",
    ],
    [
      "帮忙打印一份课程资料",
      "学习互助",
      4,
      1,
      3,
      0,
      120,
      "12 页资料，黑白双面，文件通过任务聊天发送，打印费另行沟通。",
    ],
  ];
  const tasks = schools.flatMap((s) =>
    definitions.map((d, i) => ({
      id: `${s.id}-task-${i}`,
      schoolId: s.id,
      title: d[0] as string,
      category: d[1] as Category,
      from: d[2] as number,
      to: d[3] as number,
      reward: d[4] as number,
      budget: d[5] as number,
      actual: d[5] as number,
      deadline: now + (d[6] as number) * 60000,
      description: d[7] as string,
      createdAt: now - (i * 3 + 2) * 60000,
      ownerId: `${s.id}-u${i === 5 ? 0 : (i % 3) + 1}`,
      status: "open" as Status,
      method: i % 2 === 0 ? ("advance" as const) : ("reimburse" as const),
      size: i === 5 ? "中件 · 约 2kg" : "小件 · 轻便",
      messages: [],
      events: [
        { text: "任务已发布，等待同校同学接单", at: now - (i * 3 + 2) * 60000 },
      ],
      payments: [],
      costApproved: true,
    })),
  );
  return { version: 1, tasks, users, notifications: [] };
}
export type Action = {
  type: string;
  taskId?: string;
  actor: string;
  schoolId: string;
  payload?: any;
};
export function transition(
  input: Store,
  action: Action,
  now = Date.now(),
): Store {
  const state: Store = structuredClone(input);
  const { type, actor, schoolId, payload = {} } = action;
  const user = state.users.find(
    (u) => u.id === actor && u.schoolId === schoolId,
  );
  if (!user) throw new Error("请先选择当前学校的演示身份");
  const notify = (task: Task, text: string, target?: string) => {
    const receivers = target
      ? [target]
      : ([task.ownerId, task.runnerId].filter(Boolean) as string[]);
    receivers
      .filter((id) => !!target || id !== actor)
      .forEach((userId) =>
        state.notifications.unshift({
          id: uid(),
          schoolId,
          userId,
          taskId: task.id,
          text,
          at: now,
          read: false,
        }),
      );
  };
  if (type === "read") {
    state.notifications.forEach((n) => {
      if (n.userId === actor && n.schoolId === schoolId) n.read = true;
    });
    return state;
  }
  if (type === "create") {
    const { title, description, category, from, to, reward, budget, minutes } =
      payload;
    if (
      !title?.trim() ||
      !description?.trim() ||
      !categories.includes(category) ||
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      from < 0 ||
      from > 7 ||
      to < 0 ||
      to > 7 ||
      from === to ||
      !Number.isFinite(reward) ||
      reward < 0 ||
      reward > 500 ||
      !Number.isFinite(budget) ||
      budget < 0 ||
      budget > 2000 ||
      ![30, 60, 180, 480].includes(minutes)
    )
      throw new Error(
        "请完整填写任务，地点需不同，酬谢 0–500 元，预算 0–2000 元",
      );
    state.tasks.unshift({
      id: payload.id ?? uid(),
      schoolId,
      ownerId: actor,
      title: title.trim(),
      description: description.trim(),
      category,
      from,
      to,
      reward,
      budget,
      actual: budget,
      method: payload.method ?? "reimburse",
      size: payload.size ?? "小件",
      createdAt: now,
      deadline: now + minutes * 60000,
      status: "open",
      messages: [],
      events: [{ text: "任务发布成功", at: now }],
      payments: [],
      costApproved: true,
    });
    return state;
  }
  const t = state.tasks.find(
    (t) => t.id === action.taskId && t.schoolId === schoolId,
  );
  if (!t) throw new Error("任务不存在或不属于当前学校");
  const owner = actor === t.ownerId,
    runner = actor === t.runnerId,
    participant = owner || runner;
  const event = (text: string) => {
    t.events.push({ text, at: now });
    notify(t, text);
  };
  const assert = (ok: boolean, text = "当前身份或任务状态不支持此操作") => {
    if (!ok) throw new Error(text);
  };
  if (type === "accept" || type === "race") {
    assert(!owner, "不能接取自己发布的任务");
    assert(
      t.status === "open" && !t.runnerId,
      "慢了一步，这个任务已被其他同学接走",
    );
    assert(t.deadline > now, "任务已经超时，请等待发布者更新");
    t.runnerId =
      type === "race"
        ? state.users.find(
            (u) =>
              u.schoolId === schoolId && u.id !== actor && u.id !== t.ownerId,
          )!.id
        : actor;
    t.status = "active";
    state.users.find((u) => u.id === t.runnerId)!.accepted++;
    event(
      type === "race"
        ? "另一位同学抢先接单，任务已锁定"
        : "已有同学接单，可以开始沟通啦",
    );
    if (type === "race")
      notify(t, "演示：你的接单未成功，该任务已被抢先接走", actor);
  } else if (type === "message") {
    assert(participant && !!t.runnerId);
    assert(!!payload.text?.trim() || !!payload.image, "请输入消息或选择图片");
    t.messages.push({
      id: uid(),
      userId: actor,
      text: payload.text?.trim() ?? "",
      image: payload.image,
      at: now,
    });
    notify(t, `${user.name}：${payload.text || "发送了一张图片"}`);
  } else if (type === "costRequest") {
    assert(runner && t.status === "active" && t.category === "代买物品");
    assert(!t.costRequest, "请等待上一笔费用变更处理");
    assert(
      Number.isFinite(payload.amount) &&
        payload.amount >= 0 &&
        payload.amount <= 2000 &&
        !!payload.reason?.trim(),
      "请填写 0–2000 元内的实际金额和变更原因",
    );
    assert(
      !t.payments.some((p) => p.state === "marked"),
      "请先确认已有的线下付款，再变更商品费用",
    );
    t.costRequest = {
      amount: payload.amount,
      reason: payload.reason,
      image: payload.image,
    };
    t.costApproved = false;
    event(`申请确认商品费用 ¥${money(payload.amount)}，等待发布者确认`);
  } else if (type === "approveCost" || type === "rejectCost") {
    assert(owner && t.status === "active" && !!t.costRequest);
    if (type === "approveCost") {
      const paid = t.payments
        .filter((p) => p.kind === "goods" && p.state === "paid")
        .reduce((a, p) => a + p.amount, 0);
      assert(
        t.costRequest!.amount >= paid,
        "新费用不能低于已付商品费用，请先协商退款",
      );
      t.actual = t.costRequest!.amount;
    }
    t.costRequest = undefined;
    t.costApproved = true;
    event(
      type === "approveCost"
        ? "发布者已确认商品费用"
        : "发布者未同意变更，请按原预算协商",
    );
  } else if (type === "proof") {
    assert(runner && t.status === "active");
    assert(t.costApproved, "请等待发布者确认费用");
    assert(!!payload.text?.trim(), "请填写完成说明");
    assert(
      !["快递代取", "代买物品"].includes(t.category) || !!payload.image,
      "此类任务需要图片凭证",
    );
    if (t.category === "代买物品" && t.method === "advance")
      assert(
        t.payments
          .filter((p) => p.kind === "goods" && p.state === "paid")
          .reduce((a, p) => a + p.amount, 0) >= t.actual,
        "预付商品费用确认收款后才能提交完成",
      );
    t.proof = { text: payload.text, image: payload.image };
    t.status = "review";
    event("跑腿者已提交完成凭证，等待验收");
  } else if (type === "complete") {
    assert(owner && t.status === "review");
    t.status = "done";
    if (!t.completedRecorded) {
      state.users.find((u) => u.id === t.runnerId)!.completed++;
      t.completedRecorded = true;
    }
    event("发布者已验收，任务完成，待结算酬谢");
  } else if (type === "cancel") {
    assert(participant && ["open", "active"].includes(t.status));
    assert(!!payload.reason?.trim(), "请选择取消原因");
    assert(
      !t.payments.some((p) => p.state !== "pending"),
      "任务已有付款记录，请通过争议处理协商退款",
    );
    if (t.runnerId) state.users.find((u) => u.id === t.runnerId)!.accepted--;
    t.cancellation = payload.reason;
    event(
      `${user.name}取消了任务：${payload.reason}${runner ? "；任务重新开放接单" : ""}`,
    );
    if (runner) {
      if (t.messages.length)
        t.archivedChats = [
          ...(t.archivedChats ?? []),
          { runnerId: actor, messages: t.messages },
        ];
      t.messages = [];
      t.extensionRequest = undefined;
      t.runnerId = undefined;
      t.status = "open";
      t.costRequest = undefined;
      t.costApproved = true;
      t.actual = t.budget;
      t.deadline = Math.max(t.deadline, now + 30 * 60000);
    } else t.status = "cancelled";
  } else if (type === "extend") {
    assert(participant && ["open", "active"].includes(t.status));
    if (!t.runnerId) {
      assert(owner);
      t.deadline = Math.max(t.deadline, now) + 30 * 60000;
      event("发布者将截止时间延长 30 分钟");
    } else {
      assert(!t.extensionRequest, "已有延期申请待确认");
      t.extensionRequest = Math.max(t.deadline, now) + 30 * 60000;
      t.messages.push({
        id: uid(),
        userId: actor,
        text: "我希望将任务延长 30 分钟，方便吗？",
        at: now,
      });
      event("已申请延期 30 分钟，等待对方确认");
    }
  } else if (type === "approveExtension") {
    assert(
      participant &&
        !!t.extensionRequest &&
        t.messages
          .filter((m) => m.text === "我希望将任务延长 30 分钟，方便吗？")
          .at(-1)?.userId !== actor,
    );
    t.deadline = t.extensionRequest!;
    t.extensionRequest = undefined;
    event("双方已同意延期 30 分钟");
  } else if (type === "dispute") {
    assert(participant && ["active", "review", "done"].includes(t.status));
    assert(!!payload.reason?.trim(), "请填写争议说明");
    t.dispute = { reason: payload.reason };
    t.status = "dispute";
    event("已提交争议，费用结算暂停，等待演示管理员处理");
  } else if (type === "resolve") {
    assert(payload.admin === true && t.status === "dispute");
    assert(["owner", "runner", "none"].includes(payload.liable));
    t.dispute = {
      ...t.dispute!,
      resolution: payload.resolution || "双方协商完成，按约定继续履约",
      liable: payload.liable,
    };
    if (payload.liable !== "none") {
      const responsible = payload.liable === "owner" ? t.ownerId : t.runnerId!;
      if (!t.violationUsers?.includes(responsible)) {
        state.users.find((u) => u.id === responsible)!.violations++;
        t.violationUsers = [...(t.violationUsers ?? []), responsible];
      }
    }
    t.status = t.proof ? "review" : "active";
    event(
      `争议已处理：${t.dispute.resolution}${payload.liable === "none" ? "；未记录违约" : "；已记录确认违约责任（同一任务不重复计入）"}`,
    );
  } else if (type === "pay" || type === "markPaid" || type === "confirmPaid") {
    assert(type === "confirmPaid" ? runner : owner);
    assert(t.costApproved, "请先处理费用变更");
    assert(t.status !== "dispute", "争议处理期间暂停结算");
    const kind = payload.kind as "goods" | "reward";
    assert(["goods", "reward"].includes(kind));
    if (kind === "goods")
      assert(
        t.category === "代买物品" &&
          (t.status === "done" ||
            (t.status === "active" && t.method === "advance")),
        "当前尚不需要结算商品费用",
      );
    else assert(t.status === "done", "任务验收完成后才能结算酬谢");
    const amount =
      (kind === "goods" ? t.actual : t.reward) -
      t.payments
        .filter((p) => p.kind === kind && p.state === "paid")
        .reduce((a, p) => a + p.amount, 0);
    assert(amount > 0, "该费用已结清或无需支付");
    let p = t.payments.find((p) => p.kind === kind && p.state === "marked");
    if (type === "confirmPaid") {
      assert(!!p, "发布者尚未标记线下付款");
      p!.state = "paid";
    } else {
      assert(!p, "线下付款已标记，请等待收款方确认");
      p = {
        id: uid(),
        kind,
        amount,
        state: type === "pay" ? "paid" : "marked",
        via: type === "pay" ? "模拟支付" : "线下结算",
      };
      t.payments.push(p);
    }
    event(
      `${kind === "goods" ? "商品费用" : "跑腿酬谢"} ¥${money(p!.amount)}：${type === "markPaid" ? "已标记线下付款，等待确认收款" : type === "confirmPaid" ? "收款方已确认收到" : "模拟付款成功（无真实扣款）"}`,
    );
  } else if (type === "review") {
    assert(owner && t.status === "done" && !t.review);
    assert(
      Number.isInteger(payload.stars) &&
        payload.stars >= 1 &&
        payload.stars <= 5,
    );
    t.review = {
      stars: payload.stars,
      text: payload.text?.trim() || "任务已按要求完成。",
    };
    event(`收到一条 ${payload.stars} 星评价`);
  } else if (type === "timeout") {
    assert(participant && ["open", "active"].includes(t.status));
    t.deadline = now - 60000;
    event("演示：任务已超时，请协商延期或发起争议");
  } else throw new Error("未知操作");
  return state;
}
export function createScenario(
  input: Store,
  schoolId: string,
  kind: string,
  now = Date.now(),
) {
  const owner = `${schoolId}-u0`,
    runner = `${schoolId}-u1`,
    id = uid();
  let state = transition(
    input,
    {
      type: "create",
      actor: owner,
      schoolId,
      payload: {
        id,
        title:
          kind === "buy"
            ? "【演示】帮带一杯拿铁和三明治"
            : kind === "dispute"
              ? "【演示】快递迟迟未送达"
              : "【演示】帮取北区的小快递",
        description:
          kind === "buy"
            ? "热拿铁无糖，全麦三明治。商品预算 ¥30，超预算请先联系我。"
            : "一个轻便的小包裹，请送到东区公寓楼下。取件码会在聊天中发送。",
        category: kind === "buy" ? "代买物品" : "快递代取",
        from: kind === "buy" ? 2 : 0,
        to: 1,
        reward: kind === "buy" ? 8 : 5,
        budget: kind === "buy" ? 30 : 0,
        minutes: 60,
        method: "reimburse",
      },
    },
    now,
  );
  if (kind === "dispute") {
    state = transition(
      state,
      { type: "accept", taskId: id, actor: runner, schoolId },
      now,
    );
    state = transition(
      state,
      { type: "timeout", taskId: id, actor: owner, schoolId },
      now,
    );
  }
  return { state, id };
}
