"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Coffee,
  Compass,
  CreditCard,
  FileText,
  Flag,
  GraduationCap,
  HandHeart,
  ImagePlus,
  LayoutGrid,
  Leaf,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Truck,
  UserRound,
  Users,
  X,
  Zap,
  CircleHelp,
  RotateCcw,
  Settings2,
  Wallet,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import {
  Category,
  Notification,
  Store,
  Task,
  User,
  STORE_KEY,
  areas,
  categories,
  coordinate,
  createScenario,
  distance,
  locateSchool,
  money,
  placeNames,
  schools,
  seed,
  statusNames,
  transition,
  uid,
} from "@/lib/demo";

type View = "hall" | "mine" | "messages" | "profile" | "admin";
type ModalType =
  | "create"
  | "identity"
  | "location"
  | "scenario"
  | "pay"
  | "proof"
  | "cost"
  | "cancel"
  | "dispute"
  | "review"
  | "resolve"
  | "about"
  | "reset"
  | null;
const icons = {
  快递代取: Package,
  代买物品: ShoppingBag,
  物品递送: Truck,
  学习互助: BookOpen,
};
const categoryClass = {
  快递代取: "blue",
  代买物品: "orange",
  物品递送: "yellow",
  学习互助: "blue",
};
const dateTime = (n: number) =>
  new Date(n).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
const relative = (n: number, now: number) => {
  const m = Math.max(1, Math.floor((now - n) / 60000));
  return m < 60 ? `${m} 分钟前` : `${Math.floor(m / 60)} 小时前`;
};
function remaining(t: Task, now: number) {
  const diff = t.deadline - now,
    m = Math.max(1, Math.floor(diff / 60000));
  return diff <= 0
    ? "已超时"
    : m < 60
      ? `${m} 分钟内`
      : `${Math.floor(m / 60)} 小时 ${m % 60} 分内`;
}
function Avatar({ user, small = false }: { user?: User; small?: boolean }) {
  return (
    <span
      className={`avatar ${small ? "small" : ""}`}
      style={{
        background: ["#ff8a29", "#3167fa", "#e8a900", "#2378d8"][
          Number(user?.id.slice(-1) ?? 1)
        ],
      }}
    >
      {user?.initials ?? "同"}
    </span>
  );
}
function Empty({
  title = "暂时没有任务",
  text = "试试其他筛选条件，或发布一条自己的需求。",
  children,
}: {
  title?: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-symbol">
        <Leaf size={30} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}
function Modal({
  title,
  kicker,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null),
    closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const last = document.activeElement as HTMLElement;
    const body = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, select, textarea, [tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = body;
      document.removeEventListener("keydown", listener);
      last?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
        tabIndex={-1}
      >
        <header className="modal-heading">
          <div>
            {kicker && <span className="eyebrow">{kicker}</span>}
            <h2>{title}</h2>
          </div>
          <button
            className="icon-button"
            aria-label="关闭弹窗"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
function CampusArt() {
  return (
    <svg
      className="campus-art"
      viewBox="0 0 490 280"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="285"
        cy="239"
        rx="188"
        ry="26"
        fill="#1849d6"
        opacity=".65"
      />
      <path d="M87 232 234 175l177 41-127 48z" fill="#c7d9ff" />
      <path
        d="m173 230 111-43m-45 65 118-46"
        stroke="#a9c7ff"
        strokeWidth="3"
      />
      <path d="M244 173V72l77-30 77 31v118l-77 30z" fill="#fff9e6" />
      <path d="m321 42 77 31v118l-77 30z" fill="#ffcf52" />
      <path d="m244 72 77-30 77 31-77 30z" fill="#ffecac" />
      <path d="m240 72 81-34 83 34-83 33z" fill="#ff842b" />
      <path d="m253 70 68-27 69 27-69 29z" fill="#ffab45" />
      <path
        d="M269 102v24l15-6V96zm29-12v24l14-5V85zm-29 48v24l15-6v-24zm29-12v24l14-5v-24z"
        fill="#3b74f5"
      />
      <path
        d="M340 103v22l13 5v-22zm27 10v22l13 5v-22zm-27 25v22l13 5v-22zm27 10v22l13 5v-22z"
        fill="#2455bf"
      />
      <path d="m298 188 14-5v-24l-14 5z" fill="#1a3283" />
      <path d="M166 191v-65l58-23 34 18v74l-57 23z" fill="#f9fbff" />
      <path d="m201 141 57-20v74l-57 23z" fill="#abcaff" />
      <path d="m159 126 61-27 44 22-63 25z" fill="#ffd447" />
      <path
        d="m179 150 11 5v18l-11-5zm34 4 13-5v18l-13 5zm22-9 13-5v18l-13 5z"
        fill="#5b8df7"
      />
      <path
        d="M122 218v-58m-3 28-14-11m18 4 13-12"
        stroke="#213f9c"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse cx="119" cy="159" rx="30" ry="39" fill="#ffb02e" />
      <ellipse cx="104" cy="169" rx="20" ry="24" fill="#ffb02e" />
      <path d="M415 220v-52" stroke="#213f9c" strokeWidth="5" />
      <ellipse cx="414" cy="161" rx="23" ry="32" fill="#ffd64b" />
      <path d="m331 237 18-7 22 9-19 8z" fill="#183fae" />
      <path
        d="m331 237 21 10v-21l-21-10zm21-11 19-7v20l-19 8z"
        fill="#ff8b32"
      />
      <path d="m331 216 19-7 21 10-19 7z" fill="#ffb167" />
      <path d="m341 212 21 10v9" stroke="#ffe5ae" strokeWidth="4" />
      <circle cx="206" cy="234" r="15" stroke="#102b72" strokeWidth="3" />
      <circle cx="267" cy="234" r="15" stroke="#102b72" strokeWidth="3" />
      <path
        d="m206 234 19-29 20 29h-39m19-29 42 29-12-42m-7 0h14m-38 13-5-9h-10"
        stroke="#102b72"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m242 196-14-13-9 19"
        stroke="#ffcca2"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="m228 183 8-25 18 11-8 24" fill="#ffdf4d" />
      <circle cx="246" cy="148" r="9" fill="#ffcca2" />
      <path d="M237 145q5-17 18-2" fill="#142651" />
      <path
        d="m249 172 12 15h13m-37 0-13 19 15 10"
        stroke="#ffcca2"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="m237 187-13 19 15 10"
        stroke="#173fbd"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="m170 65 14-8m-1 18 13-5m202-42 13-4"
        stroke="#91b7ff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="m116 88 8 4-2-9 7-6-9-1-4-8-4 8-9 1 7 6-2 9z" fill="#ffdf4d" />
      <g transform="translate(361 11) rotate(9)">
        <rect width="58" height="37" rx="10" fill="#fff8d6" />
        <path
          d="m20 17 7 6 13-12"
          stroke="#f36b18"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s.version === 1 && Array.isArray(s.tasks) && s.users?.length)
        return s;
    }
  } catch {}
  return seed();
}
function fileImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
      reject(new Error("请选择 8MB 以内的图片"));
      return;
    }
    const url = URL.createObjectURL(file),
      img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas"),
        scale = Math.min(1, 1000 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas
        .getContext("2d")!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取这张图片，请更换 JPG 或 PNG"));
    };
    img.src = url;
  });
}

export default function Home() {
  const [store, setStore] = useState<Store | null>(null),
    [schoolId, setSchoolId] = useState("s1"),
    [userIndex, setUserIndex] = useState(0),
    [position, setPosition] = useState(4);
  const [view, setView] = useState<View>("hall"),
    [category, setCategory] = useState("全部任务"),
    [sort, setSort] = useState("最新发布"),
    [query, setQuery] = useState(""),
    [area, setArea] = useState("全部区域"),
    [rewardFilter, setRewardFilter] = useState("全部酬谢");
  const [mineTab, setMineTab] = useState("我发布的"),
    [mineStatus, setMineStatus] = useState("全部"),
    [modal, setModal] = useState<ModalType>(null),
    [selectedId, setSelectedId] = useState<string | null>(null),
    [detailTab, setDetailTab] = useState("任务详情"),
    [toast, setToast] = useState(""),
    [now, setNow] = useState(Date.now());
  const [formCategory, setFormCategory] = useState<Category>("快递代取"),
    [chatText, setChatText] = useState(""),
    [image, setImage] = useState(""),
    [busy, setBusy] = useState(false),
    [payKind, setPayKind] = useState<"goods" | "reward">("reward"),
    [payStage, setPayStage] = useState("form"),
    [stars, setStars] = useState(5);
  const detailRef = useRef<HTMLElement>(null),
    modalRef = useRef(modal);
  modalRef.current = modal;
  const chatEnd = useRef<HTMLDivElement>(null),
    toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const school = schools.find((s) => s.id === schoolId)!;
  const userId = `${schoolId}-u${userIndex}`,
    user = store?.users.find((u) => u.id === userId);
  const task = store?.tasks.find(
    (t) => t.id === selectedId && t.schoolId === schoolId,
  );
  const notify = (message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4200);
  };
  useEffect(() => {
    const initial = readStore();
    if (!localStorage.getItem(STORE_KEY))
      localStorage.setItem(STORE_KEY, JSON.stringify(initial));
    setStore(initial);
    setNow(Date.now());
    try {
      const pref = JSON.parse(
        localStorage.getItem("campus-help-preferences") || "null",
      );
      if (pref && schools.some((s) => s.id === pref.schoolId)) {
        setSchoolId(pref.schoolId);
        setUserIndex(pref.userIndex ?? 0);
        setPosition(pref.position ?? 4);
      }
    } catch {}
    const sync = () => setStore(readStore());
    window.addEventListener("storage", sync);
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(timer);
      clearTimeout(toastTimer.current);
    };
  }, []);
  useEffect(() => {
    if (store)
      localStorage.setItem(
        "campus-help-preferences",
        JSON.stringify({ schoolId, userIndex, position }),
      );
  }, [schoolId, userIndex, position, !!store]);
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [task?.messages.length, task?.events.length, detailTab]);
  useEffect(() => {
    if (!selectedId) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    detailRef.current?.focus();
    const handle = (e: KeyboardEvent) => {
      if (modalRef.current) return;
      if (e.key === "Escape") {
        setSelectedId(null);
        return;
      }
      if (e.key === "Tab") {
        const items = detailRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),input,select,textarea",
        );
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handle);
    };
  }, [selectedId]);
  const save = async (operation: (s: Store) => Store) => {
    const work = () => {
      const fresh = readStore(),
        next = operation(fresh);
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
      setStore(next);
      setNow(Date.now());
      return next;
    };
    try {
      return navigator.locks
        ? await navigator.locks.request(STORE_KEY, work)
        : work();
    } catch (e) {
      notify(
        e instanceof Error
          ? e.name === "QuotaExceededError"
            ? "浏览器存储空间不足，请减少图片或重置演示"
            : e.message
          : "操作失败，请重试",
      );
      return null;
    }
  };
  const act = async (
    type: string,
    payload: Record<string, unknown> = {},
    success?: string,
  ) => {
    const result = await save((s) =>
      transition(s, {
        type,
        actor: userId,
        schoolId,
        taskId: selectedId ?? undefined,
        payload,
      }),
    );
    if (result && success) notify(success);
    return !!result;
  };
  const openModal = (name: ModalType) => {
    setImage("");
    setPayStage("form");
    setModal(name);
  };
  const openTask = (t: Task, tab = "任务详情") => {
    setNow(Date.now());
    setSelectedId(t.id);
    setDetailTab(tab);
    setImage("");
    setChatText("");
  };
  const switchSchool = (id: string) => {
    setSchoolId(id);
    setSelectedId(null);
    setCategory("全部任务");
    setArea("全部区域");
    setPosition(4);
    setModal(null);
    setQuery("");
    notify(`已切换至${schools.find((s) => s.id === id)?.name}，仅展示本校任务`);
  };
  const startScenario = async (kind: string) => {
    let resultId = "";
    const next = await save((s) => {
      const r = createScenario(s, schoolId, kind);
      resultId = r.id;
      return r.state;
    });
    if (next) {
      setUserIndex(0);
      setNow(Date.now());
      setSelectedId(resultId);
      setDetailTab("任务详情");
      setView("mine");
      setMineTab("我发布的");
      setModal(null);
      notify("演示任务已准备好，可在详情中切换双方身份");
    }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    try {
      setImage(await fileImage(file));
    } catch (e) {
      notify((e as Error).message);
    }
  };
  if (!store || !user)
    return (
      <div className="loading-page">
        <div className="brand-symbol">
          <HandHeart size={27} />
        </div>
        <h2>校内搭把手</h2>
        <p>正在准备你的校园…</p>
      </div>
    );
  const fulfillment = (u: User) => {
    const ongoing = store.tasks.filter(
        (t) =>
          t.runnerId === u.id &&
          !t.completedRecorded &&
          ["active", "review", "dispute"].includes(t.status),
      ).length,
      settled = Math.max(u.completed, u.accepted - ongoing);
    return settled ? `${Math.round((u.completed / settled) * 100)}%` : null;
  };
  const getUser = (id?: string) => store.users.find((u) => u.id === id);
  const schoolTasks = store.tasks.filter((t) => t.schoolId === schoolId);
  const notifications = store.notifications.filter(
    (n) => n.userId === userId && n.schoolId === schoolId,
  );
  const deadlineReminders: Notification[] = schoolTasks
    .filter(
      (t) =>
        (t.ownerId === userId || t.runnerId === userId) &&
        t.status === "active" &&
        t.deadline - now < 15 * 60000,
    )
    .map((t) => ({
      id: `deadline-${t.id}`,
      schoolId,
      userId,
      taskId: t.id,
      text:
        t.deadline < now
          ? "任务已超时，请与对方协商延期"
          : "任务将在 15 分钟内截止，请留意进度",
      at: t.deadline,
      read: false,
    }));
  const unread =
    notifications.filter((n) => !n.read).length + deadlineReminders.length;
  const hallTasks = schoolTasks
    .filter((t) => t.status === "open")
    .filter((t) => category === "全部任务" || t.category === category)
    .filter(
      (t) =>
        !query || `${t.title}${t.description}${t.category}`.includes(query),
    )
    .filter(
      (t) =>
        area === "全部区域" || areas[t.from] === area || areas[t.to] === area,
    )
    .filter(
      (t) =>
        rewardFilter === "全部酬谢" ||
        (rewardFilter === "无偿互助"
          ? t.reward === 0
          : rewardFilter === "¥ 1–5"
            ? t.reward > 0 && t.reward <= 5
            : rewardFilter === "¥ 5–10"
              ? t.reward > 5 && t.reward <= 10
              : t.reward > 10),
    )
    .sort((a, b) =>
      sort === "距离最近"
        ? distance(
            coordinate(schoolId, position),
            coordinate(schoolId, a.from),
          ) -
          distance(coordinate(schoolId, position), coordinate(schoolId, b.from))
        : sort === "截止最早"
          ? a.deadline - b.deadline
          : sort === "酬谢最高"
            ? b.reward - a.reward
            : b.createdAt - a.createdAt,
    );
  const owned = schoolTasks.filter((t) => t.ownerId === userId),
    taken = schoolTasks.filter((t) => t.runnerId === userId);
  const myTasks = (mineTab === "我发布的" ? owned : taken)
    .filter(
      (t) => mineStatus === "全部" || statusNames[t.status] === mineStatus,
    )
    .sort((a, b) => b.createdAt - a.createdAt);
  const chatItems = task
    ? [
        ...task.messages.map((m) => ({
          id: m.id,
          at: m.at,
          message: m,
          text: "",
        })),
        ...task.events.map((ev, i) => ({
          id: `system-${i}`,
          at: ev.at,
          message: undefined,
          text: ev.text,
        })),
      ].sort((a, b) => a.at - b.at)
    : [];
  const pending = schoolTasks.filter(
    (t) =>
      (t.ownerId === userId || t.runnerId === userId) &&
      ["active", "review", "dispute"].includes(t.status),
  );
  const owner = task?.ownerId === userId,
    runner = task?.runnerId === userId,
    participant = owner || runner;
  const paid = (kind: "goods" | "reward") =>
    task?.payments
      .filter((p) => p.kind === kind && p.state === "paid")
      .reduce((a, p) => a + p.amount, 0) ?? 0;
  const outstanding = (kind: "goods" | "reward") =>
    Math.max(
      0,
      (kind === "goods" ? (task?.actual ?? 0) : (task?.reward ?? 0)) -
        paid(kind),
    );
  const closeModal = () => {
    if (!busy) setModal(null);
  };
  const submitForm = async (e: FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    let payload: Record<string, unknown> = Object.fromEntries(f.entries());
    if (type === "create") {
      payload = {
        ...payload,
        category: formCategory,
        id: uid(),
        from: Number(f.get("from")),
        to: Number(f.get("to")),
        reward: Number(f.get("reward")),
        budget: formCategory === "代买物品" ? Number(f.get("budget")) : 0,
        minutes: Number(f.get("minutes")),
      };
    }
    if (type === "proof" || type === "costRequest")
      payload.image = image || undefined;
    if (type === "costRequest") payload.amount = Number(f.get("amount"));
    if (type === "review") payload.stars = stars;
    if (type === "resolve") payload.admin = true;
    setBusy(true);
    const ok = await act(
      type,
      payload,
      type === "create"
        ? "任务已发布"
        : type === "proof"
          ? "完成凭证已提交"
          : type === "review"
            ? "评价已提交"
            : "操作成功，已通知对方",
    );
    setBusy(false);
    if (ok) {
      setModal(null);
      setImage("");
      if (type === "create") {
        setSelectedId(payload.id as string);
        setDetailTab("任务详情");
        setView("mine");
        setMineTab("我发布的");
      }
    }
  };
  const imageField = (
    <div className="image-field">
      {image ? (
        <div className="image-preview">
          <img src={image} alt="已选择的凭证" />
          <button
            type="button"
            className="icon-button"
            aria-label="移除图片"
            onClick={() => setImage("")}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="upload-box">
          <ImagePlus size={24} />
          <span>上传图片凭证</span>
          <small>JPG / PNG，最大 8MB</small>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </label>
      )}
      <button
        type="button"
        className="text-button"
        onClick={() => setImage("/demo-proof.svg")}
      >
        使用演示凭证
      </button>
    </div>
  );
  const taskCard = (t: Task) => {
    const Icon = icons[t.category],
      author = getUser(t.ownerId),
      km = distance(
        coordinate(schoolId, position),
        coordinate(schoolId, t.from),
      );
    return (
      <button className="task-card" key={t.id} onClick={() => openTask(t)}>
        <div className="card-top">
          <span className={`category-tag ${categoryClass[t.category]}`}>
            <Icon size={14} />
            {t.category}
          </span>
          <span
            className={`task-time ${t.deadline - now < 45 * 60000 ? "urgent" : ""}`}
          >
            <Clock3 size={13} />
            {t.status === "open" ? remaining(t, now) : statusNames[t.status]}
          </span>
        </div>
        <div className="card-title-row">
          <h3>{t.title}</h3>
          <span className={`reward ${t.reward === 0 ? "free" : ""}`}>
            {t.reward === 0 ? (
              "互助"
            ) : (
              <>
                <small>¥</small>
                {t.reward}
                <small>酬谢</small>
              </>
            )}
          </span>
        </div>
        <p className="card-description">{t.description}</p>
        <div className="route">
          <span>
            <i className="route-dot start" />
            {placeNames[t.from]}
          </span>
          <ArrowRight size={14} />
          <span>
            <i className="route-dot end" />
            {placeNames[t.to]}
          </span>
        </div>
        {t.category === "代买物品" && (
          <span className="budget-note">
            商品预算 ¥{t.budget} · 与酬谢分开结算
          </span>
        )}
        <div className="card-footer">
          <span className="author">
            <Avatar user={author} small />
            <span>{author?.name}</span>
            <ShieldCheck size={13} />
            {author?.completed === 0 && <small>新同学</small>}
          </span>
          <span>
            {relative(t.createdAt, now)}
            <i />约{" "}
            {km < 1
              ? `${Math.max(20, Math.round((km * 1000) / 10) * 10)} m`
              : `${km.toFixed(1)} km`}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" inert={!!selectedId || !!modal}>
        <button
          className="brand"
          onClick={() => {
            setView("hall");
            setSelectedId(null);
          }}
        >
          <span className="brand-symbol">
            <HandHeart size={25} />
          </span>
          <span>
            校内搭把手<small>校园跑腿互助平台</small>
          </span>
        </button>
        <div className="sidebar-label">功能导航</div>
        <nav>
          {(
            [
              { id: "hall", label: "任务大厅", icon: LayoutGrid },
              { id: "mine", label: "我的任务", icon: FileText },
              { id: "messages", label: "消息中心", icon: MessageCircle },
              { id: "profile", label: "个人中心", icon: UserRound },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={() => {
                setView(item.id);
                setQuery("");
              }}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {item.id === "messages" && unread > 0 ? (
                <b className="nav-count">{unread > 99 ? "99+" : unread}</b>
              ) : item.id === "hall" ? (
                <span className="nav-dot" />
              ) : null}
            </button>
          ))}
        </nav>
        <div className="sidebar-label second">探索与帮助</div>
        <button
          className={`nav-item ${view === "admin" ? "active" : ""}`}
          onClick={() => setView("admin")}
        >
          <ShieldCheck size={19} />
          <span>争议处理</span>
          <span className="tiny-tag">演示</span>
        </button>
        <button className="nav-item" onClick={() => openModal("about")}>
          <CircleHelp size={19} />
          <span>互助指南</span>
        </button>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-card-icon">
              <Sparkles size={20} />
            </div>
            <h4>演示中心</h4>
            <p>基础流程 · 代购变更 · 争议处理</p>
            <button onClick={() => openModal("scenario")}>
              体验完整演示 <ArrowRight size={14} />
            </button>
          </div>
          <button
            className="sidebar-user"
            onClick={() => openModal("identity")}
          >
            <Avatar user={user} />
            <span>
              <b>{user.name}</b>
              <small>
                <ShieldCheck size={11} /> 校园已认证 · 模拟
              </small>
            </span>
            <ArrowDownUp size={16} />
          </button>
        </div>
      </aside>
      <div className="workspace" inert={!!selectedId || !!modal}>
        <header className="topbar">
          <div className="topbar-left">
            <div className="mobile-brand">
              <HandHeart size={24} />
            </div>
            <button
              className="school-switch"
              onClick={() => openModal("location")}
            >
              <GraduationCap size={19} />
              <b>{school.name}</b>
              <ChevronDown size={14} />
            </button>
            <span className="topbar-separator" />
            <span className="school-note">
              <span /> 本校任务
            </span>
          </div>
          <div className="topbar-actions">
            <button className="demo-pill" onClick={() => openModal("scenario")}>
              <Sparkles size={13} /> 作品演示
            </button>
            <button
              className="icon-button notification-button"
              aria-label="打开消息中心"
              onClick={() => setView("messages")}
            >
              <Bell size={20} />
              {unread > 0 && <i />}
            </button>
            <button
              className="topbar-avatar"
              aria-label="切换演示身份"
              onClick={() => openModal("identity")}
            >
              <Avatar user={user} small />
            </button>
          </div>
        </header>
        <main className="main-content">
          <div className="page-heading">
            <div>
              <h1>
                {view === "hall"
                  ? "任务大厅"
                  : view === "mine"
                    ? "我的任务"
                    : view === "messages"
                      ? "消息中心"
                      : view === "profile"
                        ? "个人中心"
                        : "争议处理工作台"}
                {view === "hall" && <span className="heading-dot" />}
              </h1>
            </div>
            {view !== "admin" && (
              <button
                className="button primary"
                onClick={() => openModal("create")}
              >
                <Plus size={18} />
                发布任务
              </button>
            )}
          </div>
          {view === "hall" && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <span className="hero-kicker">
                    <span /> 校园跑腿互助平台
                  </span>
                  <h2>
                    有事发布，
                    <br />
                    <span>有空接单。</span>
                  </h2>
                  <div className="hero-services">
                    <span>
                      <Package size={14} /> 快递代取
                    </span>
                    <span>
                      <ShoppingBag size={14} /> 代买物品
                    </span>
                    <span>
                      <Truck size={14} /> 物品递送
                    </span>
                  </div>
                  <button
                    className="hero-button"
                    onClick={() => openModal("create")}
                  >
                    立即发布 <ArrowRight size={16} />
                  </button>
                </div>
                <CampusArt />
              </section>
              <div className="hall-layout">
                <section className="task-section">
                  <div className="section-heading">
                    <div>
                      <h2>
                        待接任务{" "}
                        <span>
                          {
                            schoolTasks.filter((t) => t.status === "open")
                              .length
                          }
                        </span>
                      </h2>
                    </div>
                    <button
                      className="text-button muted"
                      onClick={() => {
                        setQuery("");
                        setCategory("全部任务");
                        setArea("全部区域");
                        setRewardFilter("全部酬谢");
                        setSort("最新发布");
                        setNow(Date.now());
                        notify("任务列表已更新");
                      }}
                    >
                      <RotateCcw size={14} /> 刷新
                    </button>
                  </div>
                  <div className="category-tabs">
                    {["全部任务", ...categories].map((c) => {
                      const Icon =
                        c === "全部任务" ? LayoutGrid : icons[c as Category];
                      return (
                        <button
                          key={c}
                          className={category === c ? "selected" : ""}
                          onClick={() => setCategory(c)}
                        >
                          <Icon size={16} />
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <div className="filter-bar">
                    <label className="search-field">
                      <Search size={16} />
                      <input
                        placeholder="搜索任务名称或需求…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="搜索任务"
                      />
                    </label>
                    <div className="filter-controls">
                      <label>
                        <MapPin size={13} />
                        <select
                          aria-label="校园区域"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                        >
                          {[
                            "全部区域",
                            "北区",
                            "东区",
                            "南区",
                            "西区",
                            "生活区",
                            "教学区",
                          ].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <Wallet size={13} />
                        <select
                          aria-label="酬谢筛选"
                          value={rewardFilter}
                          onChange={(e) => setRewardFilter(e.target.value)}
                        >
                          {[
                            "全部酬谢",
                            "无偿互助",
                            "¥ 1–5",
                            "¥ 5–10",
                            "¥ 10 以上",
                          ].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="list-heading">
                    <span>
                      找到 <b>{hallTasks.length}</b> 个待接任务{" "}
                      <small>· 距离为模拟估算</small>
                    </span>
                    <label className="sort-select">
                      <ArrowDownUp size={13} />
                      <select
                        aria-label="任务排序"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        {["最新发布", "距离最近", "截止最早", "酬谢最高"].map(
                          (v) => (
                            <option key={v}>{v}</option>
                          ),
                        )}
                      </select>
                    </label>
                  </div>
                  <div className="task-grid">{hallTasks.map(taskCard)}</div>
                  {!hallTasks.length && <Empty />}
                </section>
                <aside className="right-rail">
                  <div className="rail-card profile-mini">
                    <div className="mini-top">
                      <Avatar user={user} />
                      <div>
                        <h3>{user.name}</h3>
                        <p>{user.major}</p>
                      </div>
                    </div>
                    <span className="verified-tag">
                      <ShieldCheck size={13} /> 校园认证同学 <span>模拟</span>
                    </span>
                    <div className="mini-stats">
                      <div>
                        <b>{user.completed}</b>
                        <span>已完成互助</span>
                      </div>
                      <div>
                        <b>{fulfillment(user) ?? "—"}</b>
                        <span>历史履约率</span>
                      </div>
                    </div>
                    <button
                      className="full-link"
                      onClick={() => setView("profile")}
                    >
                      查看个人中心 <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="rail-card how-it-works">
                    <h3>
                      <HandHeart size={18} /> 任务流程
                    </h3>
                    {[
                      {
                        title: "发布任务",
                        text: "填写需求、地点和截止时间",
                      },
                      {
                        title: "接单与沟通",
                        text: "接单后在任务内确认细节",
                      },
                      {
                        title: "验收与结算",
                        text: "提交凭证，验收后结算",
                      },
                    ].map((s, i) => (
                      <div className="how-step" key={s.title}>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <h4>{s.title}</h4>
                          <p>{s.text}</p>
                        </div>
                      </div>
                    ))}
                    <button
                      className="text-button"
                      onClick={() => openModal("about")}
                    >
                      了解互助规则 <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="safety-note">
                    <ShieldCheck size={21} />
                    <div>
                      <h4>隐私提示</h4>
                      <p>取件码等私密信息，请在接单后通过任务聊天发送。</p>
                    </div>
                  </div>
                  <button
                    className="location-note"
                    onClick={() => openModal("location")}
                  >
                    <Navigation size={15} />
                    <span>
                      模拟位置 · {placeNames[position]}
                      <small>切换校园和位置</small>
                    </span>
                    <ChevronRight size={14} />
                  </button>
                </aside>
              </div>
            </>
          )}
          {view === "mine" && (
            <>
              <div className="stats-strip">
                <div>
                  <FileText size={20} />
                  <span>
                    我发布的<b>{owned.length}</b>
                  </span>
                </div>
                <div>
                  <Navigation size={20} />
                  <span>
                    我接下的<b>{taken.length}</b>
                  </span>
                </div>
                <div>
                  <Timer size={20} />
                  <span>
                    进行中的互助<b>{pending.length}</b>
                  </span>
                </div>
                <div>
                  <CheckCheck size={20} />
                  <span>
                    已完成的任务
                    <b>
                      {
                        schoolTasks.filter(
                          (t) =>
                            (t.ownerId === userId || t.runnerId === userId) &&
                            t.status === "done",
                        ).length
                      }
                    </b>
                  </span>
                </div>
              </div>
              <section className="white-panel">
                <div className="panel-tabs">
                  {["我发布的", "我接下的"].map((v) => (
                    <button
                      className={mineTab === v ? "selected" : ""}
                      onClick={() => {
                        setMineTab(v);
                        setMineStatus("全部");
                      }}
                      key={v}
                    >
                      {v}
                    </button>
                  ))}
                  <label className="sort-select">
                    <select
                      aria-label="我的任务状态"
                      value={mineStatus}
                      onChange={(e) => setMineStatus(e.target.value)}
                    >
                      {[
                        "全部",
                        "待接单",
                        "进行中",
                        "待验收",
                        "已完成",
                        "已取消",
                        "争议处理中",
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="task-grid">{myTasks.map(taskCard)}</div>
                {!myTasks.length && (
                  <Empty
                    title={
                      mineTab === "我发布的"
                        ? "还没有发布的任务"
                        : "还没有接下的任务"
                    }
                    text={
                      mineTab === "我发布的"
                        ? "发布一条需求，或开启预置剧情体验完整流程。"
                        : "在任务大厅浏览并接单，或切换演示身份。"
                    }
                  >
                    <button
                      className="button secondary"
                      onClick={() =>
                        mineTab === "我发布的"
                          ? openModal("create")
                          : setView("hall")
                      }
                    >
                      {mineTab === "我发布的" ? "发布一条需求" : "去任务大厅"}{" "}
                      <ArrowRight size={15} />
                    </button>
                  </Empty>
                )}
              </section>
              <div className="demo-callout">
                <Sparkles size={22} />
                <div>
                  <h3>预置演示流程</h3>
                  <p>支持基础互助、代购费用变更、超时争议三种场景。</p>
                </div>
                <button
                  className="button secondary"
                  onClick={() => openModal("scenario")}
                >
                  开启剧情演示 <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
          {view === "messages" && (
            <div className="messages-layout">
              <section className="white-panel">
                <div className="section-heading">
                  <h2>
                    任务通知 <span>{unread}</span>
                  </h2>
                  <button
                    className="text-button"
                    onClick={() =>
                      act(
                        "read",
                        {},
                        "历史通知已标记为已读；临近截止提醒会持续显示",
                      )
                    }
                  >
                    <CheckCheck size={15} /> 全部已读
                  </button>
                </div>
                {[...deadlineReminders, ...notifications].map((n) => (
                  <button
                    key={n.id}
                    className={`notification-item ${!n.read ? "unread" : ""}`}
                    onClick={() => {
                      const t = schoolTasks.find((t) => t.id === n.taskId);
                      if (t)
                        openTask(
                          t,
                          n.text.includes("：") && !n.text.includes("商品费用")
                            ? "任务聊天"
                            : "任务详情",
                        );
                    }}
                  >
                    <span className="notification-icon">
                      {n.id.startsWith("deadline") ? (
                        <Clock3 size={20} />
                      ) : (
                        <Bell size={20} />
                      )}
                    </span>
                    <div>
                      <h4>{n.text}</h4>
                      <p>{schoolTasks.find((t) => t.id === n.taskId)?.title}</p>
                      <small>{dateTime(n.at)}</small>
                    </div>
                    <ChevronRight size={16} />
                    {!n.read && <i />}
                  </button>
                ))}
                {!notifications.length && !deadlineReminders.length && (
                  <Empty
                    title="还没有新的通知"
                    text="接单、留言、费用变更和任务完成时，消息会出现在这里。"
                  />
                )}
              </section>
              <section className="rail-card conversation-list">
                <h3>我的任务聊天</h3>
                {schoolTasks
                  .filter(
                    (t) =>
                      (t.ownerId === userId || t.runnerId === userId) &&
                      t.runnerId,
                  )
                  .map((t) => (
                    <button key={t.id} onClick={() => openTask(t, "任务聊天")}>
                      <Avatar
                        user={getUser(
                          t.ownerId === userId ? t.runnerId : t.ownerId,
                        )}
                        small
                      />
                      <span>
                        <b>{t.title}</b>
                        <small>
                          {t.messages.at(-1)?.text || "接单成功，打个招呼吧"}
                        </small>
                      </span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                {!schoolTasks.some(
                  (t) =>
                    (t.ownerId === userId || t.runnerId === userId) &&
                    t.runnerId,
                ) && <p className="muted">接单后即可开始任务内沟通。</p>}
              </section>
            </div>
          )}
          {view === "profile" && (
            <>
              <section className="profile-card">
                <div className="profile-cover" aria-hidden="true">
                  <GraduationCap size={100} />
                </div>
                <div className="profile-body">
                  <Avatar user={user} />
                  <div className="profile-name">
                    <h2>
                      {user.name}
                      <span className="verified-tag">
                        <ShieldCheck size={13} /> 校园认证 · 模拟
                      </span>
                    </h2>
                    <p>
                      {school.name} · {user.major}
                    </p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() => openModal("identity")}
                  >
                    <ArrowDownUp size={15} /> 切换演示身份
                  </button>
                </div>
                <div className="profile-stats">
                  <div>
                    <b>{user.completed}</b>
                    <span>历史完成单数</span>
                  </div>
                  <div>
                    <b>{fulfillment(user) ?? "暂无记录"}</b>
                    <span>履约率</span>
                  </div>
                  <div>
                    <b>
                      {
                        schoolTasks.filter(
                          (t) => t.runnerId === userId && t.review,
                        ).length
                      }
                    </b>
                    <span>本次演示收到评价</span>
                  </div>
                  <div>
                    <b>{user.violations}</b>
                    <span>已确认违约</span>
                  </div>
                </div>
              </section>
              <div className="profile-columns">
                <section className="white-panel">
                  <h2>收到的评价</h2>
                  {schoolTasks
                    .filter((t) => t.runnerId === userId && t.review)
                    .map((t) => (
                      <div className="review-item" key={t.id}>
                        <Avatar user={getUser(t.ownerId)} small />
                        <div>
                          <b>{getUser(t.ownerId)?.name}</b>
                          <span className="stars">
                            {"★".repeat(t.review!.stars)}
                          </span>
                          <p>{t.review!.text}</p>
                          <small>{t.title}</small>
                        </div>
                      </div>
                    ))}
                  {!schoolTasks.some(
                    (t) => t.runnerId === userId && t.review,
                  ) && (
                    <Empty
                      title="暂无评价"
                      text="完成任务后，发布者可留下评分和评价。新用户可以正常接单。"
                    />
                  )}
                </section>
                <section className="rail-card">
                  <h3>
                    <ShieldCheck size={18} /> 信用规则
                  </h3>
                  <p className="rule-text">
                    我们展示校园认证、历史完成次数、履约率和真实评价，任务大厅默认按发布时间排序。
                  </p>
                  <p className="rule-text">
                    协商取消与合理延期保留记录；单方举报不会直接扣减信用。经争议处理确认的违约才会记录到个人中心。
                  </p>
                  <p className="info-banner">
                    当前所有身份和历史数据均为虚构，仅用于作品演示。
                  </p>
                  <button
                    className="text-button danger"
                    onClick={() => openModal("reset")}
                  >
                    <RotateCcw size={14} /> 重置全部演示数据
                  </button>
                </section>
              </div>
            </>
          )}
          {view === "admin" && (
            <>
              <div className="info-banner">
                <ShieldCheck size={18} />
                <span>
                  演示管理入口 · 仅查看 {school.name}{" "}
                  的争议。实际产品需要独立管理员权限，本 Demo 可直接切换体验。
                </span>
              </div>
              <section className="white-panel">
                <h2>等待处理</h2>
                {schoolTasks
                  .filter((t) => t.status === "dispute")
                  .map((t) => (
                    <div className="dispute-row" key={t.id}>
                      <div>
                        <span className="status-badge dispute">争议处理中</span>
                        <h3>{t.title}</h3>
                        <p>{t.dispute?.reason}</p>
                        <small>
                          发布者 {getUser(t.ownerId)?.name} · 跑腿者{" "}
                          {getUser(t.runnerId)?.name}
                        </small>
                      </div>
                      <div className="button-row">
                        <button
                          className="button secondary"
                          onClick={() => openTask(t, "任务记录")}
                        >
                          查看证据
                        </button>
                        <button
                          className="button primary"
                          onClick={() => {
                            setSelectedId(t.id);
                            openModal("resolve");
                          }}
                        >
                          处理争议
                        </button>
                      </div>
                    </div>
                  ))}
                {!schoolTasks.some((t) => t.status === "dispute") && (
                  <Empty
                    title="当前没有待处理争议"
                    text="可以开启异常处理剧情，体验超时、申诉和责任认定。"
                  >
                    <button
                      className="button secondary"
                      onClick={() => startScenario("dispute")}
                    >
                      创建异常演示 <ArrowRight size={14} />
                    </button>
                  </Empty>
                )}
              </section>
              <section className="white-panel resolved-panel">
                <h2>已处理记录</h2>
                {schoolTasks
                  .filter((t) => t.dispute?.resolution)
                  .map((t) => (
                    <button
                      key={t.id}
                      className="resolved-item"
                      onClick={() => openTask(t, "任务记录")}
                    >
                      <CheckCircle2 size={20} />
                      <span>
                        <b>{t.title}</b>
                        <small>{t.dispute?.resolution}</small>
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                {!schoolTasks.some((t) => t.dispute?.resolution) && (
                  <p className="muted">
                    完成处理后，结果和责任记录会显示在这里。
                  </p>
                )}
              </section>
            </>
          )}
          <footer className="page-footer">
            <span>
              <HandHeart size={14} /> 校内搭把手
            </span>
            <span>作品演示 · 虚拟校园与模拟支付</span>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" inert={!!selectedId || !!modal}>
        {(
          [
            { id: "hall", label: "大厅", icon: LayoutGrid },
            { id: "mine", label: "任务", icon: FileText },
            { id: "messages", label: "消息", icon: MessageCircle },
            { id: "profile", label: "我的", icon: UserRound },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            className={view === item.id ? "active" : ""}
            onClick={() => setView(item.id)}
          >
            <item.icon size={21} />
            {item.label}
            {item.id === "messages" && unread > 0 && <i />}
          </button>
        ))}
      </nav>

      {task && (
        <div
          className="detail-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !modal) setSelectedId(null);
          }}
        >
          <section
            className="detail-panel"
            ref={detailRef}
            tabIndex={-1}
            inert={!!modal}
            role="dialog"
            aria-modal="true"
            aria-label="任务详情"
          >
            <header className="detail-header">
              <button
                className="icon-button"
                aria-label="关闭任务详情"
                onClick={() => setSelectedId(null)}
              >
                <ArrowLeft size={20} />
              </button>
              <span>任务 #{task.id.slice(-6).toUpperCase()}</span>
              <button
                className="identity-chip"
                onClick={() => openModal("identity")}
              >
                <Avatar user={user} small />
                {user.name}
                <ArrowDownUp size={13} />
              </button>
            </header>
            <div className="detail-body">
              <div className="detail-title">
                <span
                  className={`category-tag ${categoryClass[task.category]}`}
                >
                  {(() => {
                    const Icon = icons[task.category];
                    return <Icon size={14} />;
                  })()}
                  {task.category}
                </span>
                <span className={`status-badge ${task.status}`}>
                  {statusNames[task.status]}
                </span>
                <h2>{task.title}</h2>
                <p>
                  <Clock3 size={14} /> 截止 {dateTime(task.deadline)}{" "}
                  {["open", "active"].includes(task.status) && (
                    <b className={task.deadline < now ? "danger" : ""}>
                      · {remaining(task, now)}
                    </b>
                  )}
                </p>
              </div>
              <div className="detail-amount">
                <div>
                  <small>跑腿酬谢</small>
                  <b>
                    {task.reward === 0 ? "无偿互助" : `¥ ${money(task.reward)}`}
                  </b>
                </div>
                {task.category === "代买物品" && (
                  <>
                    <Plus size={16} />
                    <div>
                      <small>
                        商品{task.actual !== task.budget ? "实际费用" : "预算"}
                      </small>
                      <b>¥ {money(task.actual)}</b>
                    </div>
                    <span>
                      <strong>合计 ¥ {money(task.actual + task.reward)}</strong>
                      {task.method === "advance"
                        ? "发布者预付商品费"
                        : "跑腿者垫付 · 完成结算"}
                    </span>
                  </>
                )}
              </div>
              {task.title.startsWith("【演示】") && (
                <div className="scenario-guide">
                  <Sparkles size={18} />
                  <div>
                    <b>
                      剧情体验 ·{" "}
                      {task.category === "代买物品"
                        ? "代购费用变更"
                        : task.deadline < now
                          ? "异常处理"
                          : "顺利完成"}
                    </b>
                    <p>
                      {task.status === "open"
                        ? "切换为程一诺接单，再通过任务聊天确认细节。"
                        : task.status === "active" && task.deadline < now
                          ? "任务已超时，可以协商延期、取消或提交争议；管理端可查看记录并认定责任。"
                          : task.status === "active"
                            ? owner
                              ? "可切换为跑腿者，申请费用变更或提交凭证。"
                              : "通过聊天沟通；完成后提交凭证，发布者将收到通知。"
                            : task.status === "review"
                              ? "发布者验收后，可体验模拟支付和评价。"
                              : task.status === "done"
                                ? "到费用结算完成支付，随后为对方留下评价。"
                                : "在争议处理工作台查看证据、处理责任。"}
                    </p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => {
                      setUserIndex(owner ? 1 : 0);
                      notify(
                        `已切换为${owner ? "跑腿者程一诺" : "发布者林小满"}`,
                      );
                    }}
                  >
                    切换身份 <ArrowDownUp size={13} />
                  </button>
                </div>
              )}
              <div className="detail-tabs">
                {["任务详情", "任务聊天", "费用结算", "任务记录"].map((tab) => (
                  <button
                    key={tab}
                    className={detailTab === tab ? "selected" : ""}
                    onClick={() => setDetailTab(tab)}
                  >
                    {tab}
                    {tab === "任务聊天" && task.messages.length > 0 && (
                      <span>{task.messages.length}</span>
                    )}
                  </button>
                ))}
              </div>
              {detailTab === "任务详情" && (
                <div className="detail-tab-content">
                  <div className="detail-route">
                    <div>
                      <span className="location-circle start">取</span>
                      <div>
                        <small>出发地点</small>
                        <h3>{placeNames[task.from]}</h3>
                        <p>
                          {school.name} · {areas[task.from]}
                        </p>
                      </div>
                    </div>
                    <div className="route-line" />
                    <div>
                      <span className="location-circle end">送</span>
                      <div>
                        <small>送达地点</small>
                        <h3>{placeNames[task.to]}</h3>
                        <p>
                          {school.name} · {areas[task.to]}
                        </p>
                      </div>
                    </div>
                    <span className="distance-chip">
                      <Navigation size={13} /> 取送约{" "}
                      {Math.round(
                        distance(
                          coordinate(schoolId, task.from),
                          coordinate(schoolId, task.to),
                        ) * 1000,
                      )}{" "}
                      m · 模拟直线距离
                    </span>
                  </div>
                  <h3 className="detail-section-title">任务要求</h3>
                  <p className="description-full">{task.description}</p>
                  {task.category === "快递代取" && (
                    <p className="muted">包裹规格：{task.size}</p>
                  )}
                  <p className="privacy-note">
                    <ShieldCheck size={15} />
                    {task.runnerId && participant
                      ? "碰面方式、取件码等细节，请在本任务聊天中确认。"
                      : "接单后开放任务聊天，私密取件信息不会公开展示。"}
                  </p>
                  <div className="participant-card">
                    <Avatar user={getUser(task.ownerId)} />
                    <div>
                      <h4>
                        {getUser(task.ownerId)?.name} <span>发布者</span>
                      </h4>
                      <p>
                        <ShieldCheck size={12} /> 校园认证 · 已完成{" "}
                        {getUser(task.ownerId)?.completed} 次互助
                      </p>
                    </div>
                    {task.runnerId && participant && (
                      <button
                        className="button secondary small-button"
                        onClick={() => setDetailTab("任务聊天")}
                      >
                        <MessageCircle size={15} /> 联系
                        {owner ? "跑腿者" : "发布者"}
                      </button>
                    )}
                  </div>
                  {task.runnerId && (
                    <div className="participant-card">
                      <Avatar user={getUser(task.runnerId)} />
                      <div>
                        <h4>
                          {getUser(task.runnerId)?.name} <span>跑腿者</span>
                        </h4>
                        <p>
                          <ShieldCheck size={12} /> 校园认证 ·{" "}
                          {getUser(task.runnerId)?.completed === 0
                            ? "已认证新同学"
                            : `已完成 ${getUser(task.runnerId)?.completed} 次互助`}
                        </p>
                      </div>
                    </div>
                  )}
                  {task.costRequest && (
                    <div className="request-card">
                      <h3>待确认的商品费用</h3>
                      <p>
                        原费用 ¥{money(task.actual)} → 新费用{" "}
                        <b>¥{money(task.costRequest.amount)}</b>
                      </p>
                      <p>{task.costRequest.reason}</p>
                      {task.costRequest.image && (
                        <img
                          className="proof-img"
                          src={task.costRequest.image}
                          alt="费用变更凭证"
                        />
                      )}
                      {owner ? (
                        <div className="button-row">
                          <button
                            className="button primary"
                            onClick={() => act("approveCost", {}, "费用已确认")}
                          >
                            同意费用
                          </button>
                          <button
                            className="button secondary"
                            onClick={() =>
                              act("rejectCost", {}, "已拒绝费用变更")
                            }
                          >
                            暂不同意
                          </button>
                        </div>
                      ) : (
                        <small>等待发布者确认，确认前不能提交完成。</small>
                      )}
                    </div>
                  )}
                  {task.extensionRequest && (
                    <div className="request-card">
                      <h3>延期申请</h3>
                      <p>申请延至 {dateTime(task.extensionRequest)}</p>
                      {task.messages
                        .filter(
                          (m) =>
                            m.text === "我希望将任务延长 30 分钟，方便吗？",
                        )
                        .at(-1)?.userId !== userId && participant ? (
                        <button
                          className="button primary"
                          onClick={() =>
                            act("approveExtension", {}, "双方已确认延期")
                          }
                        >
                          同意延期
                        </button>
                      ) : (
                        <small>等待对方确认</small>
                      )}
                    </div>
                  )}
                  {task.proof && (participant || view === "admin") && (
                    <div className="proof-card">
                      <h3>
                        <CheckCircle2 size={17} /> 完成凭证
                      </h3>
                      <p>{task.proof.text}</p>
                      {task.proof.image && (
                        <img
                          className="proof-img"
                          src={task.proof.image}
                          alt="跑腿者提交的完成凭证"
                        />
                      )}
                    </div>
                  )}
                  {task.dispute && (
                    <div className="request-card dispute-note">
                      <h3>
                        <Flag size={17} /> 争议记录
                      </h3>
                      <p>{task.dispute.reason}</p>
                      {task.dispute.resolution ? (
                        <p>处理结果：{task.dispute.resolution}</p>
                      ) : (
                        <>
                          <p>
                            争议处理期间暂停结算，单方申诉不会直接影响信用。
                          </p>
                          <button
                            className="text-button"
                            onClick={() => {
                              setView("admin");
                              setSelectedId(null);
                            }}
                          >
                            前往演示管理工作台 <ArrowRight size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {task.review && (
                    <div className="review-card">
                      <span className="stars">
                        {"★".repeat(task.review.stars)}
                      </span>
                      <p>{task.review.text}</p>
                      <small>来自发布者的评价</small>
                    </div>
                  )}
                </div>
              )}
              {detailTab === "任务聊天" && (
                <div className="detail-tab-content chat-tab">
                  {!task.runnerId || (!participant && view !== "admin") ? (
                    <Empty
                      title="接单后才能开始聊天"
                      text="任务聊天室仅对本任务的发布者和跑腿者开放。"
                    />
                  ) : (
                    <>
                      <div className="chat-tip">
                        <ShieldCheck size={14} />{" "}
                        {view === "admin" && !participant
                          ? "管理员查看任务沟通记录"
                          : `当前与 ${getUser(owner ? task.runnerId : task.ownerId)?.name} 沟通`}{" "}
                        · 请勿发送真实隐私数据
                      </div>
                      <div className="chat-messages">
                        {!task.messages.length && (
                          <div className="chat-welcome">
                            <MessageCircle size={25} />
                            <p>接单成功，先打个招呼吧。</p>
                            <small>
                              取件码、商品规格、临时变更都可以在这里确认。
                            </small>
                          </div>
                        )}
                        {chatItems.map((item) =>
                          item.message ? (
                            (() => {
                              const m = item.message;
                              return (
                                <div
                                  key={m.id}
                                  className={`chat-message ${m.userId === userId ? "self" : ""}`}
                                >
                                  <Avatar user={getUser(m.userId)} small />
                                  <div>
                                    <small>
                                      {getUser(m.userId)?.name} ·{" "}
                                      {dateTime(m.at)}
                                    </small>
                                    <div className="message-bubble">
                                      {m.text && <p>{m.text}</p>}
                                      {m.image && (
                                        <img src={m.image} alt="聊天图片" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="chat-system" key={item.id}>
                              <span>
                                {dateTime(item.at)} · {item.text}
                              </span>
                            </div>
                          ),
                        )}
                        <div ref={chatEnd} />
                      </div>
                      {participant && (
                        <>
                          <div className="quick-replies">
                            {(owner
                              ? [
                                  "你好，取件码是 8-2046（演示）",
                                  "到楼下联系我就好，谢谢！",
                                  "没问题，辛苦啦！",
                                ]
                              : [
                                  "你好，我已经出发啦！",
                                  "商品缺货了，可以换一个口味吗？",
                                  "已经送到楼下，请查收～",
                                ]
                            ).map((s) => (
                              <button key={s} onClick={() => setChatText(s)}>
                                {s}
                              </button>
                            ))}
                          </div>
                          <form
                            className="chat-composer"
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const ok = await act("message", {
                                text: chatText,
                                image: image || undefined,
                              });
                              if (ok) {
                                setChatText("");
                                setImage("");
                              }
                            }}
                          >
                            {image && (
                              <div className="chat-attachment">
                                <img src={image} alt="待发送图片" />
                                <button
                                  type="button"
                                  className="icon-button"
                                  aria-label="移除聊天图片"
                                  onClick={() => setImage("")}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                            <textarea
                              placeholder="说点什么，确认一下任务细节…"
                              aria-label="任务聊天消息"
                              value={chatText}
                              onChange={(e) => setChatText(e.target.value)}
                              maxLength={1000}
                            />
                            <div>
                              <label
                                className="icon-button attachment-button"
                                aria-label="上传聊天图片"
                              >
                                <ImagePlus size={19} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => upload(e.target.files?.[0])}
                                />
                              </label>
                              <span>文字与图片仅保存在此浏览器</span>
                              <button
                                className="button primary small-button"
                                disabled={!chatText.trim() && !image}
                              >
                                发送 <Send size={14} />
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {detailTab === "费用结算" && (
                <div className="detail-tab-content">
                  <div className="info-banner">
                    <Wallet size={18} />
                    <span>
                      模拟支付，无真实扣款。商品本金与跑腿酬谢分开结算。
                    </span>
                  </div>
                  {!participant ? (
                    <Empty
                      title="费用记录仅对任务双方开放"
                      text="接单后可以查看付款方式和结算进度。"
                    />
                  ) : (
                    <>
                      {(["goods", "reward"] as const)
                        .filter(
                          (k) => k === "reward" || task.category === "代买物品",
                        )
                        .map((kind) => {
                          const amount =
                              kind === "goods" ? task.actual : task.reward,
                            marked = task.payments.find(
                              (p) => p.kind === kind && p.state === "marked",
                            ),
                            canPay =
                              task.status === "done" ||
                              (kind === "goods" &&
                                task.status === "active" &&
                                task.method === "advance");
                          return (
                            <div className="settlement-card" key={kind}>
                              <div>
                                <span className="settlement-icon">
                                  {kind === "goods" ? (
                                    <ShoppingBag size={22} />
                                  ) : (
                                    <HandHeart size={22} />
                                  )}
                                </span>
                                <div>
                                  <h3>
                                    {kind === "goods" ? "商品费用" : "跑腿酬谢"}
                                  </h3>
                                  <p>
                                    {kind === "goods"
                                      ? task.method === "advance"
                                        ? "发布者预付 · 购买前支付商品本金"
                                        : "跑腿者垫付 · 验收完成后结算"
                                      : "验收完成后支付"}
                                  </p>
                                </div>
                                <b>¥ {money(amount)}</b>
                              </div>
                              <div className="settlement-state">
                                <span>
                                  {amount === 0
                                    ? "无需付款"
                                    : outstanding(kind) === 0
                                      ? "已结清"
                                      : marked
                                        ? "已标记线下付款 · 待确认收款"
                                        : !canPay
                                          ? "等待任务验收"
                                          : "待结算"}
                                  {paid(kind) > 0 && outstanding(kind) > 0
                                    ? ` · 已付 ¥${money(paid(kind))}`
                                    : ""}
                                </span>
                                {canPay &&
                                  outstanding(kind) > 0 &&
                                  task.status !== "dispute" && (
                                    <>
                                      {owner && !marked && (
                                        <div className="button-row">
                                          <button
                                            className="button primary small-button"
                                            disabled={!task.costApproved}
                                            onClick={() => {
                                              setPayKind(kind);
                                              openModal("pay");
                                            }}
                                          >
                                            模拟支付
                                          </button>
                                          <button
                                            className="button secondary small-button"
                                            disabled={!task.costApproved}
                                            onClick={() =>
                                              act(
                                                "markPaid",
                                                { kind },
                                                "已通知对方确认收款",
                                              )
                                            }
                                          >
                                            标记线下已付
                                          </button>
                                        </div>
                                      )}
                                      {runner && marked && (
                                        <button
                                          className="button primary small-button"
                                          onClick={() =>
                                            act(
                                              "confirmPaid",
                                              { kind },
                                              "已确认收到线下款项",
                                            )
                                          }
                                        >
                                          确认收款
                                        </button>
                                      )}
                                    </>
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      <h3 className="detail-section-title">结算记录</h3>
                      {!task.payments.length ? (
                        <p className="muted">
                          还没有结算记录。完成付款后将显示在这里。
                        </p>
                      ) : (
                        task.payments.map((p) => (
                          <div className="payment-record" key={p.id}>
                            <CheckCircle2 size={18} />
                            <span>
                              <b>
                                {p.kind === "goods" ? "商品费用" : "跑腿酬谢"} ·{" "}
                                {p.via}
                              </b>
                              <small>
                                {p.state === "paid"
                                  ? "已确认到账（模拟记录）"
                                  : "已标记付款，等待跑腿者确认"}
                              </small>
                            </span>
                            <strong>¥ {money(p.amount)}</strong>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              )}
              {detailTab === "任务记录" && (
                <div className="detail-tab-content">
                  <h3 className="detail-section-title">任务时间线</h3>
                  <div className="timeline">
                    {task.events.map((ev, i) => (
                      <div key={i}>
                        <span />
                        <div>
                          <small>{dateTime(ev.at)}</small>
                          <p>{ev.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {task.archivedChats?.length && (owner || view === "admin") ? (
                    <div className="archived-chats">
                      <h3 className="detail-section-title">历史接单沟通记录</h3>
                      {task.archivedChats.map((thread, i) => (
                        <details key={i}>
                          <summary>
                            与 {getUser(thread.runnerId)?.name}{" "}
                            的历史聊天（接单已取消）
                          </summary>
                          {thread.messages.map((m) => (
                            <p key={m.id}>
                              <b>{getUser(m.userId)?.name}：</b>
                              {m.text}
                              {m.image && (
                                <img
                                  className="proof-img"
                                  src={m.image}
                                  alt="历史聊天凭证"
                                />
                              )}
                            </p>
                          ))}
                        </details>
                      ))}
                    </div>
                  ) : null}
                  {task.dispute && (
                    <div className="info-banner">
                      争议说明：{task.dispute.reason}
                      <br />
                      {task.dispute.resolution
                        ? `处理结果：${task.dispute.resolution}`
                        : "待管理端处理；聊天和完成凭证可切换标签查看。"}
                    </div>
                  )}
                </div>
              )}
            </div>
            <footer className="detail-actions">
              {task.status === "open" && !owner ? (
                <>
                  <span>
                    <ShieldCheck size={16} /> 同校认证同学均可接单
                  </span>
                  <button
                    className="button secondary"
                    onClick={async () => {
                      if (await act("race"))
                        notify("慢了一步，另一位同学已抢先接单");
                    }}
                  >
                    模拟抢单冲突
                  </button>
                  <button
                    className="button primary"
                    disabled={task.deadline < now}
                    onClick={() =>
                      act("accept", {}, "接单成功！可以开始沟通啦")
                    }
                  >
                    <Check size={17} /> 我要接单
                  </button>
                </>
              ) : (
                <>
                  {participant && ["open", "active"].includes(task.status) && (
                    <>
                      <button
                        className="text-button muted"
                        onClick={() => openModal("cancel")}
                      >
                        取消{runner ? "接单" : "任务"}
                      </button>
                      <button
                        className="text-button"
                        onClick={() =>
                          act(
                            "extend",
                            {},
                            task.runnerId ? "延期申请已发送" : "已延长 30 分钟",
                          )
                        }
                      >
                        申请延期
                      </button>
                    </>
                  )}
                  {runner && task.status === "active" && (
                    <>
                      {task.category === "代买物品" && (
                        <button
                          className="button secondary"
                          onClick={() => openModal("cost")}
                        >
                          确认 / 变更商品费
                        </button>
                      )}
                      <button
                        className="button primary"
                        onClick={() => openModal("proof")}
                      >
                        提交完成凭证
                      </button>
                    </>
                  )}
                  {owner && task.status === "review" && (
                    <button
                      className="button primary"
                      onClick={async () => {
                        if (
                          await act(
                            "complete",
                            {},
                            "任务验收完成，可以结算与评价",
                          )
                        )
                          setDetailTab("费用结算");
                      }}
                    >
                      确认验收完成 <CheckCheck size={16} />
                    </button>
                  )}
                  {participant &&
                    ["active", "review", "done"].includes(task.status) && (
                      <button
                        className="text-button danger"
                        onClick={() => openModal("dispute")}
                      >
                        <Flag size={14} /> 申诉
                      </button>
                    )}
                  {task.status === "done" && participant && (
                    <>
                      <button
                        className="button secondary"
                        onClick={() => setDetailTab("费用结算")}
                      >
                        查看结算
                      </button>
                      {owner && !task.review && (
                        <button
                          className="button primary"
                          onClick={() => {
                            setStars(5);
                            openModal("review");
                          }}
                        >
                          评价任务 <Star size={15} />
                        </button>
                      )}
                    </>
                  )}
                  {task.status === "cancelled" && (
                    <span className="muted">取消原因：{task.cancellation}</span>
                  )}
                  {task.status === "dispute" && (
                    <button
                      className="button secondary"
                      onClick={() => {
                        setView("admin");
                        setSelectedId(null);
                      }}
                    >
                      前往争议处理工作台
                    </button>
                  )}
                  {task.status === "active" && participant && (
                    <button
                      className="demo-timeout"
                      title="仅演示：将任务变为超时"
                      onClick={() =>
                        act("timeout", {}, "已模拟超时，可协商延期或发起申诉")
                      }
                    >
                      模拟超时
                    </button>
                  )}
                </>
              )}
            </footer>
          </section>
        </div>
      )}

      {modal === "create" && (
        <Modal title="发布任务" onClose={closeModal} wide>
          <form onSubmit={(e) => submitForm(e, "create")}>
            <label className="form-label">选择任务类型</label>
            <div className="form-category">
              {categories.map((c) => {
                const Icon = icons[c];
                return (
                  <button
                    type="button"
                    key={c}
                    className={formCategory === c ? "selected" : ""}
                    onClick={() => setFormCategory(c)}
                  >
                    <Icon size={22} />
                    {c}
                  </button>
                );
              })}
            </div>
            <label className="form-field">
              任务标题 <span>*</span>
              <input
                name="title"
                required
                maxLength={45}
                placeholder={
                  formCategory === "代买物品"
                    ? "例如：代买热拿铁，中杯无糖"
                    : "例如：北区快递代取，送到东区公寓"
                }
              />
            </label>
            <label className="form-field">
              {formCategory === "代买物品" ? "商品规格 / 购买要求" : "需求说明"}{" "}
              <span>*</span>
              <textarea
                name="description"
                required
                maxLength={1000}
                rows={3}
                placeholder={
                  formCategory === "代买物品"
                    ? "写下品牌、数量、口味；缺货时可以在聊天中沟通。"
                    : "说说数量、注意事项即可；取件码等私密信息接单后再发。"
                }
              />
            </label>
            <div className="form-row">
              <label className="form-field">
                {formCategory === "代买物品" ? "购买地点" : "取件 / 出发地点"}
                <select
                  key={formCategory}
                  name="from"
                  defaultValue={formCategory === "代买物品" ? 2 : 0}
                >
                  {placeNames.map((p, i) => (
                    <option key={p} value={i}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                送达 / 见面地点
                <select name="to" defaultValue={1}>
                  {placeNames.map((p, i) => (
                    <option key={p} value={i}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {formCategory === "快递代取" && (
              <label className="form-field">
                包裹大小
                <select name="size">
                  <option>小件 · 轻便</option>
                  <option>中件 · 约 2kg</option>
                  <option>大件 · 需要搬运</option>
                </select>
              </label>
            )}
            <div className="form-row">
              <label className="form-field">
                希望多久完成
                <select name="minutes" defaultValue={60}>
                  <option value={30}>30 分钟内</option>
                  <option value={60}>1 小时内</option>
                  <option value={180}>3 小时内</option>
                  <option value={480}>今天内（8 小时内）</option>
                </select>
              </label>
              <label className="form-field">
                跑腿酬谢（元）
                <input
                  name="reward"
                  type="number"
                  min="0"
                  max="500"
                  step="0.01"
                  defaultValue="5"
                  required
                />
                <small>填写 0 元即可发起无偿互助</small>
              </label>
            </div>
            {formCategory === "代买物品" && (
              <div className="purchase-fields">
                <div className="form-row">
                  <label className="form-field">
                    商品预算（元）
                    <input
                      name="budget"
                      type="number"
                      min="0"
                      max="2000"
                      step="0.01"
                      defaultValue="20"
                      required
                    />
                  </label>
                  <label className="form-field">
                    商品费用结算方式
                    <select name="method">
                      <option value="reimburse">跑腿者垫付，完成后结算</option>
                      <option value="advance">发布者预付商品费用</option>
                    </select>
                  </label>
                </div>
                <p>
                  <CreditCard size={14} />{" "}
                  商品本金与酬谢分别记录，超预算需你确认后再购买。
                </p>
              </div>
            )}
            <div className="info-banner">
              <MapPin size={15} />
              <span>发布至 {school.name} · 地点已限制在本校模拟地理范围内</span>
            </div>
            <div className="modal-footer">
              <span>
                <ShieldCheck size={14} /> 同校可见，接单后私聊
              </span>
              <button className="button primary" disabled={busy}>
                {busy ? (
                  <LoaderCircle size={16} className="spin" />
                ) : (
                  <Plus size={16} />
                )}
                确认发布
              </button>
            </div>
          </form>
        </Modal>
      )}
      {modal === "identity" && (
        <Modal title="切换演示身份" onClose={closeModal}>
          <p className="modal-intro">
            无需登录即可切换身份，体验发布者与跑腿者的不同操作。
          </p>
          <div className="identity-list">
            {store.users
              .filter((u) => u.schoolId === schoolId)
              .map((u) => (
                <button
                  key={u.id}
                  className={u.id === userId ? "selected" : ""}
                  onClick={() => {
                    setUserIndex(Number(u.id.slice(-1)));
                    setModal(null);
                    notify(`已切换为${u.name}`);
                  }}
                >
                  <Avatar user={u} />
                  <span>
                    <b>
                      {u.name} {u.completed === 0 && <small>新同学</small>}
                    </b>
                    <p>{u.major}</p>
                    <small>
                      {u.completed
                        ? `完成 ${u.completed} 单 · 校园认证`
                        : "暂无履约记录 · 同样可以接单"}
                    </small>
                  </span>
                  {u.id === userId ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </button>
              ))}
          </div>
          <p className="footnote">
            所有身份均为虚拟人物，历史履约数据仅用于展示。
          </p>
        </Modal>
      )}
      {modal === "location" && (
        <Modal title="你的校园，你的同学" onClose={closeModal}>
          <p className="modal-intro">
            选择学校与模拟位置，查看地理围栏判断。五校数据独立。
          </p>
          <div className="school-list">
            {schools.map((s) => (
              <button
                key={s.id}
                className={s.id === schoolId ? "selected" : ""}
                onClick={() => switchSchool(s.id)}
              >
                <span className="school-monogram">{s.short}</span>
                <span>
                  <b>{s.name}</b>
                  <small>虚拟校园 · 半径 {s.radius} km 范围</small>
                </span>
                {s.id === schoolId ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            ))}
          </div>
          <form
            className="location-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget),
                lat = Number(f.get("lat")),
                lng = Number(f.get("lng"));
              if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng) ||
                Math.abs(lat) > 90 ||
                Math.abs(lng) > 180
              ) {
                notify("请输入有效的经纬度");
                return;
              }
              const found = locateSchool({ lat, lng });
              if (found) switchSchool(found.id);
              else notify("该坐标不在五所模拟学校范围内，无法发布校内任务");
            }}
          >
            <label className="form-field">
              当前校内模拟位置
              <select
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
              >
                {placeNames.map((p, i) => (
                  <option key={p} value={i}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <div className="location-coordinates">
              <Navigation size={15} />
              {coordinate(schoolId, position).lat.toFixed(4)},{" "}
              {coordinate(schoolId, position).lng.toFixed(4)} · 围栏内
            </div>
            <div className="form-row">
              <label className="form-field">
                测试纬度
                <input
                  name="lat"
                  type="number"
                  step="any"
                  defaultValue={school.lat}
                  key={`lat-${schoolId}`}
                  required
                />
              </label>
              <label className="form-field">
                测试经度
                <input
                  name="lng"
                  type="number"
                  step="any"
                  defaultValue={school.lng}
                  key={`lng-${schoolId}`}
                  required
                />
              </label>
            </div>
            <button className="button secondary full-width">
              根据模拟坐标匹配学校 <Navigation size={15} />
            </button>
          </form>
          <p className="footnote">
            位置均为模拟，不读取你的真实定位。距离为直线估算。
          </p>
        </Modal>
      )}
      {modal === "scenario" && (
        <Modal title="选择演示流程" onClose={closeModal} wide>
          <p className="modal-intro">
            选择一条剧情，系统会创建独立任务。切换双方身份，亲手走完每一步。
          </p>
          <div className="scenario-cards">
            {[
              {
                kind: "normal",
                icon: Package,
                title: "基础互助流程",
                tag: "01 · 基础流程",
                text: "发布 → 接单 → 聊天 → 凭证 → 验收 → 支付 → 评价",
              },
              {
                kind: "buy",
                icon: Coffee,
                title: "代购费用变更",
                tag: "02 · 费用变更",
                text: "接单 → 申请实际商品费 → 发布者确认 → 垫付 → 结算",
              },
              {
                kind: "dispute",
                icon: ShieldCheck,
                title: "超时与争议处理",
                tag: "03 · 异常处理",
                text: "已接单并超时 → 协商延期 / 取消 / 申诉 → 管理端处理",
              },
            ].map((s) => (
              <button key={s.kind} onClick={() => startScenario(s.kind)}>
                <span className={`scenario-icon ${s.kind}`}>
                  <s.icon size={25} />
                </span>
                <small>{s.tag}</small>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="text-button">
                  开始演示 <ArrowRight size={16} />
                </span>
              </button>
            ))}
          </div>
          <div className="info-banner">
            <Users size={17} />
            <span>
              默认发布者：林小满 ·
              默认跑腿者：程一诺。详情页顶部可随时切换身份。
            </span>
          </div>
        </Modal>
      )}
      {task && modal === "proof" && (
        <Modal title="提交完成凭证" onClose={closeModal}>
          <form onSubmit={(e) => submitForm(e, "proof")}>
            <p className="modal-intro">
              提交后由发布者确认验收。
              {["快递代取", "代买物品"].includes(task.category)
                ? "本任务需要图片凭证。"
                : "可选：上传图片凭证。"}
            </p>
            <label className="form-field">
              完成说明 <span>*</span>
              <textarea
                name="text"
                required
                rows={3}
                placeholder="例如：包裹已送到东区公寓楼下，并与同学确认。"
                maxLength={1000}
              />
            </label>
            {imageField}
            <div className="modal-footer">
              <span>请勿上传含真实隐私信息的图片</span>
              <button className="button primary" disabled={busy}>
                提交完成凭证 <Check size={16} />
              </button>
            </div>
          </form>
        </Modal>
      )}
      {task && modal === "cost" && (
        <Modal title="确认商品费用" onClose={closeModal}>
          <form onSubmit={(e) => submitForm(e, "costRequest")}>
            <p className="modal-intro">
              当前商品预算 ¥{money(task.actual)}，跑腿酬谢 ¥{money(task.reward)}
              。实际商品费用需要发布者确认。
            </p>
            <label className="form-field">
              实际商品费用（元）
              <input
                type="number"
                name="amount"
                defaultValue={task.actual}
                min={paid("goods")}
                max="2000"
                step="0.01"
                required
              />
            </label>
            <label className="form-field">
              费用说明
              <textarea
                name="reason"
                required
                rows={3}
                defaultValue="商品价格与预估略有不同，请确认是否可以购买。"
                maxLength={500}
              />
            </label>
            {imageField}
            <div className="modal-footer">
              <span>未确认前，不能提交任务完成</span>
              <button className="button primary" disabled={busy}>
                发起费用确认
              </button>
            </div>
          </form>
        </Modal>
      )}
      {task && modal === "cancel" && (
        <Modal
          title={runner ? "取消这次接单" : "取消这个任务"}
          onClose={closeModal}
        >
          <form onSubmit={(e) => submitForm(e, "cancel")}>
            <p className="modal-intro">
              {runner
                ? "取消后任务将重新开放，发布者会收到通知。"
                : "取消后任务停止接单，已接单的同学会收到通知。"}
              取消会保留记录，信用责任通过争议处理确认。
            </p>
            <label className="form-field">
              取消原因
              <select name="reason">
                <option>已与对方协商取消</option>
                <option>临时有事，无法继续</option>
                <option>需求已解决，不再需要</option>
                <option>任务信息与实际不符</option>
              </select>
            </label>
            <div className="modal-footer">
              <button
                type="button"
                className="button secondary"
                onClick={closeModal}
              >
                返回
              </button>
              <button className="button danger-button" disabled={busy}>
                确认取消
              </button>
            </div>
          </form>
        </Modal>
      )}
      {task && modal === "dispute" && (
        <Modal title="说清情况，让处理有依据" onClose={closeModal}>
          <form onSubmit={(e) => submitForm(e, "dispute")}>
            <p className="modal-intro">
              提交后暂停结算，任务聊天、完成凭证与时间线会作为处理依据。单方申诉不会直接影响对方信用。
            </p>
            <label className="form-field">
              争议说明
              <textarea
                name="reason"
                required
                rows={5}
                maxLength={1000}
                placeholder="请描述发生了什么、沟通情况，以及希望怎样解决。"
              />
            </label>
            <div className="modal-footer">
              <span>可在任务聊天内补充图片证据</span>
              <button className="button primary" disabled={busy}>
                提交争议
              </button>
            </div>
          </form>
        </Modal>
      )}
      {task && modal === "review" && (
        <Modal title="评价任务" onClose={closeModal}>
          <form onSubmit={(e) => submitForm(e, "review")}>
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  aria-label={`${n} 星`}
                  onClick={() => setStars(n)}
                >
                  <Star
                    size={36}
                    fill={n <= stars ? "#ffae00" : "none"}
                    color={n <= stars ? "#ffae00" : "#d5dfef"}
                  />
                </button>
              ))}
            </div>
            <label className="form-field">
              评价内容
              <textarea
                name="text"
                rows={3}
                maxLength={300}
                placeholder="填写完成情况、时效与沟通体验"
              />
            </label>
            <div className="modal-footer">
              <span>{stars === 5 ? "已选择 5 星" : `已选择 ${stars} 星`}</span>
              <button className="button primary" disabled={busy}>
                提交评价 <HandHeart size={16} />
              </button>
            </div>
          </form>
        </Modal>
      )}
      {task && modal === "resolve" && (
        <Modal title="争议处理 · 演示管理员" onClose={closeModal}>
          <form onSubmit={(e) => submitForm(e, "resolve")}>
            <div className="info-banner">申诉说明：{task.dispute?.reason}</div>
            <label className="form-field">
              责任认定
              <select name="liable">
                <option value="none">双方协商，无责任记录</option>
                <option value="runner">跑腿者确认违约</option>
                <option value="owner">发布者确认违约</option>
              </select>
            </label>
            <label className="form-field">
              处理结论
              <textarea
                name="resolution"
                rows={4}
                required
                defaultValue="已核对任务记录，双方同意继续履约。"
                maxLength={1000}
              />
            </label>
            <p className="footnote">
              处理后恢复至{task.proof ? "待验收" : "进行中"}
              。确认违约才会新增责任记录，之后仍可协商取消或完成任务。
            </p>
            <div className="modal-footer">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setModal(null);
                  setDetailTab("任务记录");
                }}
              >
                先查看证据
              </button>
              <button className="button primary" disabled={busy}>
                确认处理结果
              </button>
            </div>
          </form>
        </Modal>
      )}
      {task && modal === "pay" && (
        <Modal
          title={payStage === "success" ? "模拟付款成功" : "确认模拟支付"}
          kicker="DEMO PAYMENT · NO REAL CHARGE"
          onClose={closeModal}
        >
          {payStage === "form" ? (
            <>
              <div className="pay-summary">
                <span>{payKind === "goods" ? "商品费用" : "跑腿酬谢"}</span>
                <h2>
                  <small>¥</small>
                  {money(outstanding(payKind))}
                </h2>
                <p>{task.title}</p>
              </div>
              <div className="pay-recipient">
                <span>收款方</span>
                <b>{getUser(task.runnerId)?.name}</b>
              </div>
              <div className="pay-method">
                <span className="pay-method-icon">
                  <Wallet size={22} />
                </span>
                <div>
                  <b>演示钱包</b>
                  <small>虚拟余额充足 · 不连接真实账户</small>
                </div>
                <CheckCircle2 size={20} />
              </div>
              <div className="info-banner">
                仅模拟支付过程与账单状态，不发生真实资金交易。
              </div>
              <button
                className="button primary full-width pay-submit"
                onClick={async () => {
                  setBusy(true);
                  setPayStage("processing");
                  await new Promise((r) => setTimeout(r, 1100));
                  const ok = await act("pay", { kind: payKind });
                  setPayStage(ok ? "success" : "form");
                  setBusy(false);
                }}
              >
                确认模拟支付 ¥{money(outstanding(payKind))}
              </button>
            </>
          ) : payStage === "processing" ? (
            <div className="pay-result">
              <LoaderCircle size={44} className="spin" />
              <h3>正在模拟支付…</h3>
              <p>正在生成模拟结算记录</p>
            </div>
          ) : (
            <div className="pay-result">
              <span className="success-circle">
                <Check size={34} />
              </span>
              <h3>模拟支付成功</h3>
              <p>已生成模拟支付记录，没有真实扣款。</p>
              <button
                className="button primary"
                onClick={() => {
                  setModal(null);
                  setDetailTab("费用结算");
                }}
              >
                查看结算记录 <ArrowRight size={16} />
              </button>
            </div>
          )}
        </Modal>
      )}
      {modal === "about" && (
        <Modal title="平台规则" onClose={closeModal}>
          <div className="guide-list">
            {[
              {
                icon: ShieldCheck,
                title: "学校隔离与认证",
                text: "五所虚拟校园独立展示任务。当前认证与历史履约数据均为模拟，新同学可以正常接单。",
              },
              {
                icon: MessageCircle,
                title: "任务沟通",
                text: "确认取件码、商品规格和碰面方式。变更费用和延期需要对方确认，重要约定保留在任务里。",
              },
              {
                icon: Wallet,
                title: "费用结算",
                text: "商品本金与酬谢分开记账。预付或垫付可选；线下付款需要跑腿者确认收款。模拟支付不扣款。",
              },
              {
                icon: Flag,
                title: "争议处理",
                text: "取消与超时保留记录；完成可上传凭证。争议处理前暂停结算，确认违约才影响信用记录。",
              },
            ].map((g) => (
              <div key={g.title}>
                <span>
                  <g.icon size={21} />
                </span>
                <div>
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="info-banner">
            作品展示版：数据存储在当前浏览器中，同一浏览器的多标签页会同步；不同设备之间不共享。所有人物和学校均为虚构。
          </div>
          <button
            className="button primary full-width"
            onClick={() => openModal("scenario")}
          >
            选择演示流程 <ArrowRight size={16} />
          </button>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal title="重置演示数据" onClose={closeModal}>
          <p className="modal-intro">
            将清除当前浏览器中五所学校的任务、图片、聊天与结算记录，并恢复初始示例。此操作无法撤销。
          </p>
          <div className="modal-footer">
            <button className="button secondary" onClick={closeModal}>
              保留数据
            </button>
            <button
              className="button danger-button"
              onClick={async () => {
                const ok = await save(() => seed());
                if (ok) {
                  setSelectedId(null);
                  setModal(null);
                  notify("演示数据已恢复初始状态");
                }
              }}
            >
              确认重置演示
            </button>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
          <button
            className="icon-button"
            aria-label="关闭提示"
            onClick={() => setToast("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
