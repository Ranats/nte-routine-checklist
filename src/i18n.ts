import type { ChecklistItem, Language, RoutineType } from "./types";

export const LANGUAGES: Array<{ code: Language; label: string; htmlLang: string }> = [
  { code: "en", label: "English", htmlLang: "en" },
  { code: "ja", label: "日本語", htmlLang: "ja" },
  { code: "zh", label: "简体中文", htmlLang: "zh-Hans" },
];

type PresetText = {
  title: string;
  description: string;
  category: string;
};

type Messages = {
  eyebrow: string;
  heroCopy: string;
  progress: string;
  updateReady: string;
  reload: string;
  unofficialStrong: string;
  unofficialBody: string;
  freshnessTitle: string;
  resetSummary: string;
  templateReviewed: string;
  appVersion: string;
  safetyPosture: string;
  safetyValue: string;
  safetyValueWithAds: string;
  checklistSwitcher: string;
  resetInfo: string;
  nextReset: string;
  resetVisible: string;
  uncheckVisible: string;
  today: string;
  tomorrow: string;
  weekdays: string[];
  markAs: (title: string, state: string) => string;
  complete: string;
  incomplete: string;
  hide: string;
  delete: string;
  management: string;
  addItem: string;
  title: string;
  note: string;
  cycle: string;
  category: string;
  custom: string;
  resetSettings: string;
  serverProfile: string;
  asiaServer: string;
  americaServer: string;
  europeServer: string;
  customTimezone: string;
  dailyReset: string;
  weeklyDay: string;
  timezone: string;
  currentPeriod: (timezone: string) => string;
  restorePresets: string;
  export: string;
  import: string;
  importFailed: string;
  hiddenItems: string;
  adSlotLabel: string;
  adSlotText: string;
  supportLabel: string;
  supportTitle: string;
  supportBody: string;
  hostingStatus: string;
  footerNoThirdParty: string;
  privacy: string;
  fanContent: string;
  language: string;
};

export const messages: Record<Language, Messages> = {
  en: {
    eyebrow: "Unofficial fan-made tracker",
    heroCopy: "Track Neverness to Everness daily and weekly routines with local-only storage.",
    progress: "Progress",
    updateReady: "Update ready.",
    reload: "Reload",
    unofficialStrong: "Unofficial tool.",
    unofficialBody:
      "These items are editable templates. If the in-game list differs, hide, add, or rename items to match your account.",
    freshnessTitle: "Freshness and reset assumptions",
    resetSummary:
      "Default Asia profile uses 05:00 server time. Sources agree on daily reset at 05:00 server time and weekly reset on Monday, but regional conversions can differ by server and daylight saving.",
    templateReviewed: "Template reviewed",
    appVersion: "App version",
    safetyPosture: "Safety posture",
    safetyValue: "Local-only / no ad SDK",
    safetyValueWithAds: "Local-only data / ad-supported",
    checklistSwitcher: "Checklist switcher",
    resetInfo: "Reset information",
    nextReset: "Next reset",
    resetVisible: "Reset visible",
    uncheckVisible: "Uncheck visible items",
    today: "Today",
    tomorrow: "Tomorrow",
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    markAs: (title, state) => `Mark ${title} as ${state}`,
    complete: "complete",
    incomplete: "incomplete",
    hide: "Hide",
    delete: "Delete",
    management: "Management",
    addItem: "Add item",
    title: "Title",
    note: "Note",
    cycle: "Cycle",
    category: "Category",
    custom: "Custom",
    resetSettings: "Reset settings",
    serverProfile: "Server profile",
    asiaServer: "Asia server UTC+8",
    americaServer: "America server UTC-5",
    europeServer: "Europe server UTC+1",
    customTimezone: "Custom timezone",
    dailyReset: "Daily reset",
    weeklyDay: "Weekly day",
    timezone: "Timezone",
    currentPeriod: (timezone) => `Current period is calculated with ${timezone}.`,
    restorePresets: "Restore presets",
    export: "Export",
    import: "Import",
    importFailed: "Import failed. Please select an exported NTE checklist JSON file.",
    hiddenItems: "Hidden items",
    adSlotLabel: "Future ad slot",
    adSlotText: "Sponsored area reserved",
    supportLabel: "Support links",
    supportTitle: "Support this project",
    supportBody: "Optional support helps keep the checklist maintained after NTE updates.",
    hostingStatus: "Hosting status",
    footerNoThirdParty: "No third-party scripts are loaded in this MVP.",
    privacy: "Privacy",
    fanContent: "Fan content notice",
    language: "Language",
  },
  ja: {
    eyebrow: "非公式ファンメイド補助ツール",
    heroCopy: "Neverness to Everness の日課・週課を、ログインなしのローカル保存で管理します。",
    progress: "進捗",
    updateReady: "更新があります。",
    reload: "再読み込み",
    unofficialStrong: "非公式ツールです。",
    unofficialBody:
      "項目は編集可能なテンプレートです。ゲーム内の内容と違う場合は、非表示・追加・名称変更で自分の進行に合わせてください。",
    freshnessTitle: "情報鮮度とリセット前提",
    resetSummary:
      "初期設定のAsiaはサーバー時刻05:00を基準にします。日次05:00、週次月曜リセットという情報が複数ありますが、地域やサマータイムで換算が変わる可能性があります。",
    templateReviewed: "テンプレート確認日",
    appVersion: "アプリ版",
    safetyPosture: "安全性の方針",
    safetyValue: "ローカル保存のみ / 広告SDKなし",
    safetyValueWithAds: "データはローカル保存 / 広告あり",
    checklistSwitcher: "チェックリスト切り替え",
    resetInfo: "リセット情報",
    nextReset: "次のリセット",
    resetVisible: "表示中をリセット",
    uncheckVisible: "表示中の項目のチェックを外す",
    today: "今日",
    tomorrow: "明日",
    weekdays: ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"],
    markAs: (title, state) => `${title}を${state}にする`,
    complete: "完了",
    incomplete: "未完了",
    hide: "非表示",
    delete: "削除",
    management: "管理",
    addItem: "項目追加",
    title: "タイトル",
    note: "メモ",
    cycle: "周期",
    category: "分類",
    custom: "カスタム",
    resetSettings: "リセット設定",
    serverProfile: "サーバー設定",
    asiaServer: "Asia server UTC+8",
    americaServer: "America server UTC-5",
    europeServer: "Europe server UTC+1",
    customTimezone: "カスタムタイムゾーン",
    dailyReset: "日次リセット",
    weeklyDay: "週次曜日",
    timezone: "タイムゾーン",
    currentPeriod: (timezone) => `現在の周期は ${timezone} で計算します。`,
    restorePresets: "初期項目を復元",
    export: "エクスポート",
    import: "インポート",
    importFailed: "読み込みに失敗しました。エクスポート済みのNTE checklist JSONを選択してください。",
    hiddenItems: "非表示の項目",
    adSlotLabel: "将来の広告枠",
    adSlotText: "スポンサー枠を予約中",
    supportLabel: "支援リンク",
    supportTitle: "このプロジェクトを支援",
    supportBody: "任意の支援は、NTE更新後もチェックリストを保守する助けになります。",
    hostingStatus: "ホスティング状況",
    footerNoThirdParty: "このMVPでは第三者スクリプトを読み込んでいません。",
    privacy: "プライバシー",
    fanContent: "ファンコンテンツ表記",
    language: "言語",
  },
  zh: {
    eyebrow: "非官方玩家制作工具",
    heroCopy: "用本地存储管理 Neverness to Everness 的每日和每周事项。",
    progress: "进度",
    updateReady: "有可用更新。",
    reload: "重新加载",
    unofficialStrong: "非官方工具。",
    unofficialBody: "这些事项是可编辑模板。如果游戏内列表不同，请隐藏、添加或重命名事项以匹配你的账号进度。",
    freshnessTitle: "信息时效和重置假设",
    resetSummary:
      "默认Asia配置按服务器时间05:00计算。多个来源提到每日05:00和每周一重置，但不同服务器和夏令时可能导致换算差异。",
    templateReviewed: "模板确认日期",
    appVersion: "应用版本",
    safetyPosture: "安全状态",
    safetyValue: "仅本地存储 / 无广告SDK",
    safetyValueWithAds: "数据仅本地存储 / 有广告支持",
    checklistSwitcher: "清单切换",
    resetInfo: "重置信息",
    nextReset: "下次重置",
    resetVisible: "重置当前列表",
    uncheckVisible: "取消当前显示项目的勾选",
    today: "今天",
    tomorrow: "明天",
    weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    markAs: (title, state) => `将 ${title} 标记为${state}`,
    complete: "完成",
    incomplete: "未完成",
    hide: "隐藏",
    delete: "删除",
    management: "管理",
    addItem: "添加事项",
    title: "标题",
    note: "备注",
    cycle: "周期",
    category: "分类",
    custom: "自定义",
    resetSettings: "重置设置",
    serverProfile: "服务器配置",
    asiaServer: "Asia server UTC+8",
    americaServer: "America server UTC-5",
    europeServer: "Europe server UTC+1",
    customTimezone: "自定义时区",
    dailyReset: "每日重置",
    weeklyDay: "每周日期",
    timezone: "时区",
    currentPeriod: (timezone) => `当前周期按 ${timezone} 计算。`,
    restorePresets: "恢复预设",
    export: "导出",
    import: "导入",
    importFailed: "导入失败。请选择导出的NTE checklist JSON文件。",
    hiddenItems: "隐藏事项",
    adSlotLabel: "未来广告位",
    adSlotText: "预留赞助区域",
    supportLabel: "支持链接",
    supportTitle: "支持这个项目",
    supportBody: "可选支持可以帮助我们在NTE更新后继续维护清单。",
    hostingStatus: "托管状态",
    footerNoThirdParty: "此MVP不加载第三方脚本。",
    privacy: "隐私",
    fanContent: "粉丝内容声明",
    language: "语言",
  },
};

export const presetText: Record<Language, Record<string, PresetText>> = {
  en: {},
  ja: {
    "daily-character-pixels": {
      title: "Character Pixelsを消費",
      description: "上限に達する前に、クリア可能な最高ランクの育成素材ステージでスタミナを使います。",
      category: "育成",
    },
    "daily-exploration-guide": {
      title: "探索ガイドの日課報酬を回収",
      description: "日課ガイドを進め、アクティビティ報酬の到達分を受け取ります。",
      category: "報酬",
    },
    "daily-login-events": {
      title: "ログイン・イベント報酬を回収",
      description: "ログインボーナス、イベント画面、メール、期間限定の受け取りボタンを確認します。",
      category: "報酬",
    },
    "daily-cafe": {
      title: "Cafe収益を回収",
      description: "売上を回収し、必要に応じて補充やレシピ調整を行います。",
      category: "街",
    },
    "daily-nacupeda-pool": {
      title: "Nacupeda's Poolを確認",
      description: "解放済みなら、1日1回の願いや報酬選択を行います。",
      category: "街",
    },
    "daily-witch-fortune": {
      title: "日次の占いを利用",
      description: "Witch's Houseで利用可能な占い効果や探索ヒントを確認します。",
      category: "街",
    },
    "daily-gifts": {
      title: "キャラクターへギフト",
      description: "育成中のキャラクターに日次上限分のギフトを渡します。",
      category: "絆",
    },
    "daily-illegal-activities": {
      title: "Illegal Activitiesを処理",
      description: "交換素材が必要な時に、オープンワールド上の違法行為エンカウントを処理します。",
      category: "街",
    },
    "weekly-anomaly-pilgrimage": {
      title: "Anomaly Pilgrimage報酬を回収",
      description: "手持ちの育成計画に合わせて、週次報酬枠を必要なボス素材に使います。",
      category: "育成",
    },
    "weekly-city-stamina": {
      title: "City Staminaを消費",
      description: "月曜リセット前に、週次のCity Staminaを使い切ります。",
      category: "Fons",
    },
    "weekly-auction": {
      title: "Ebisu's Auction Houseを確認",
      description: "週次の出品を確認し、育成計画に合う希少素材だけ購入します。",
      category: "ショップ",
    },
    "weekly-realm-of-greed": {
      title: "Realm of Greedをクリア",
      description: "解放済みなら自宅のMammon経由で週次Fons報酬を受け取ります。",
      category: "Fons",
    },
    "weekly-special-commission": {
      title: "Special City Commissionを完了",
      description: "Old MailboxまたはCity Deliveryで、スタミナ不要の週次依頼を確認します。",
      category: "Fons",
    },
    "weekly-circle-bounty": {
      title: "Circle Bounty週課を完了",
      description: "リセット前に、バトルパス系の週次目標を受け取ります。",
      category: "報酬",
    },
    "weekly-pink-paw-heist": {
      title: "Pink Paw Heist上限を確認",
      description: "一部ガイドでは長めの周期とされています。該当しない場合は非表示にしてください。",
      category: "任意",
    },
  },
  zh: {
    "daily-character-pixels": {
      title: "消耗 Character Pixels",
      description: "在达到上限前，把体力用于当前能稳定通关的最高级培养材料关卡。",
      category: "养成",
    },
    "daily-exploration-guide": {
      title: "领取探索指南每日奖励",
      description: "完成足够的每日指南任务，领取活跃度奖励。",
      category: "奖励",
    },
    "daily-login-events": {
      title: "领取登录和活动奖励",
      description: "检查登录奖励、活动页面、邮件以及限时领取按钮。",
      category: "奖励",
    },
    "daily-cafe": {
      title: "领取Cafe收益",
      description: "领取营业收益，需要时补货，并在解锁升级后调整配方。",
      category: "城市",
    },
    "daily-nacupeda-pool": {
      title: "查看 Nacupeda's Pool",
      description: "如果账号已解锁，进行每日许愿或奖励选择。",
      category: "城市",
    },
    "daily-witch-fortune": {
      title: "使用每日占卜",
      description: "前往Witch's House查看可用的占卜效果或地图提示。",
      category: "城市",
    },
    "daily-gifts": {
      title: "赠送角色礼物",
      description: "把每日礼物次数用于正在培养的角色。",
      category: "羁绊",
    },
    "daily-illegal-activities": {
      title: "清理 Illegal Activities",
      description: "需要兑换材料时，清理开放世界中的非法活动遭遇。",
      category: "城市",
    },
    "weekly-anomaly-pilgrimage": {
      title: "领取 Anomaly Pilgrimage 奖励",
      description: "根据队伍培养需求，把每周奖励次数用于最需要的Boss材料。",
      category: "养成",
    },
    "weekly-city-stamina": {
      title: "消耗 City Stamina",
      description: "在周一重置前用完每周City Stamina。",
      category: "Fons",
    },
    "weekly-auction": {
      title: "查看 Ebisu's Auction House",
      description: "查看每周拍卖库存，只购买符合培养计划的稀有材料。",
      category: "商店",
    },
    "weekly-realm-of-greed": {
      title: "完成 Realm of Greed",
      description: "如果已解锁，通过家中的Mammon路线领取每周Fons奖励。",
      category: "Fons",
    },
    "weekly-special-commission": {
      title: "完成 Special City Commission",
      description: "检查Old Mailbox或City Delivery中的每周无体力委托。",
      category: "Fons",
    },
    "weekly-circle-bounty": {
      title: "完成 Circle Bounty 每周任务",
      description: "在重置前领取类似通行证的每周目标奖励。",
      category: "奖励",
    },
    "weekly-pink-paw-heist": {
      title: "查看 Pink Paw Heist 上限",
      description: "部分指南显示它可能是更长周期；如果不适用于你的账号，可以隐藏。",
      category: "可选",
    },
  },
};

export function detectLanguage(): Language {
  const saved = localStorage.getItem("nte-routine-checklist:language");
  if (isLanguage(saved)) return saved;
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const browserLanguage of browserLanguages) {
    const language = normalizeBrowserLanguage(browserLanguage);
    if (language) return language;
  }
  return "en";
}

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "ja" || value === "zh";
}

function normalizeBrowserLanguage(value: string | undefined): Language | null {
  const browserLanguage = value?.toLowerCase() ?? "";
  if (browserLanguage.startsWith("ja")) return "ja";
  if (browserLanguage.startsWith("zh")) return "zh";
  if (browserLanguage.startsWith("en")) return "en";
  return null;
}

export function getDisplayItem(item: ChecklistItem, language: Language) {
  const translated = item.source === "preset" ? presetText[language][item.id] : undefined;
  return {
    title: translated?.title ?? item.title,
    description: translated?.description ?? item.description,
    category: translated?.category ?? item.category,
  };
}

export function languageHref(language: Language, page: "privacy" | "fan-content") {
  if (language === "en") return `/${page}.html`;
  return `/${page}.${language}.html`;
}

export function resetLabel(language: Language, type: RoutineType, dayOffset: number, weeklyResetDay: number, resetTime: string) {
  const t = messages[language];
  if (type === "daily") return `${dayOffset === 0 ? t.today : t.tomorrow} ${resetTime}`;
  return `${t.weekdays[weeklyResetDay] ?? t.weekdays[1]} ${resetTime}`;
}
