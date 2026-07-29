import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity, AlertTriangle, Bell, Briefcase, Camera, Car, CheckCircle2, ClipboardCheck,
  Compass, Database, Download, FileText, GraduationCap, Heart, Home as HomeIcon,
  Map as MapIcon, Megaphone, Play, Radio, Send, ShieldAlert, ShoppingBag, Siren, Store,
  UserRound, Users, Vote,
} from "lucide-react";

const TOUR_DURATION = 42000;
const MAX_ZOOM = 4;
const MAP_WIDTH = 2048;
const MAP_HEIGHT = 1388;

const scenicSpots = [
  {
    id: "liqiao",
    name: "犁桥水镇",
    scene: "Liqiao Water Town in Tongling Anhui, elegant Jiangnan canal town, white walls and dark tiled roofs, stone bridge, warm lantern reflections at dusk, realistic premium travel photography, no text, no watermark",
    x: 0.381,
    y: 0.176,
    width: 132,
    height: 48,
    intro: "犁桥水镇依托犁桥村自然水系与田园肌理营造江南水乡游览空间。青砖街巷、临水建筑、石桥与夜间灯影相互映衬，可体验慢行游园、非遗民俗、特色餐饮和水乡夜景。傍晚入园可同时感受日景与夜景。",
    tags: ["江南水乡", "亲子休闲", "夜游打卡"],
    hours: "建议游览 15:00—21:00；开放情况以景区当天公告为准",
    duration: "建议游玩 3—4 小时",
    bestTime: "春秋季及傍晚时段",
    services: ["游客服务：咨询引导、失物招领、简易医疗与便民充电", "游览配套：公共卫生间、休憩座椅、母婴便利设施", "餐饮购物：水镇小吃、地方土菜、文创及农特产品", "停车服务：入口周边设停车区域，节假日建议错峰抵达"],
    traffic: "地址：铜陵市义安区西联镇犁桥村。自驾可导航至“犁桥水镇游客中心”；从铜陵市区出发建议经沿江道路前往。公共交通班次可能调整，出行前可查询实时公交。节假日晚间客流集中，请服从现场临时交通引导。",
    shows: ["16:00—16:30｜水乡迎宾互动（参考时段）", "18:30—19:00｜民俗巡游与街区互动（参考时段）", "19:30—20:10｜水岸光影夜游（参考时段）", "提示：演出受天气、季节及活动安排影响，以景区当天节目单为准"],
    mapKeyword: "安徽铜陵犁桥水镇游客中心",
    ticket: "水镇公共游览区域的开放政策，以及游船、体验项目、节庆活动等收费标准可能不同。儿童、老人等优惠政策需以现场公示为准，建议出发前通过景区官方账号核验当日开放时间、预约要求与票务信息。",
    facilities: [
      { type: "parking", label: "游客停车场", note: "主入口外侧", x: 16, y: 74 },
      { type: "service", label: "游客服务台", note: "主入口内侧", x: 32, y: 55 },
      { type: "toilet", label: "公共卫生间", note: "水镇中街附近", x: 67, y: 39 },
      { type: "toilet", label: "公共卫生间", note: "夜游街区附近", x: 80, y: 67 },
    ],
    transitRoutes: [
      { from: "铜陵站", steps: ["20路", "山水人家站换乘", "35路", "明塘村站", "步行约 300 米"] },
      { from: "铜陵北站", steps: ["39路", "陵江大道口站换乘", "34路", "斗门村站换乘 35 路", "明塘村站"] },
    ],
  },
  {
    id: "yongquan",
    name: "永泉小镇",
    scene: "Yongquan Town resort in Tongling Anhui, lush Jiangnan garden, traditional pavilions, stone paths, flowing stream and mountain valley, refined realistic travel photography, natural light, no text, no watermark",
    x: 0.654,
    y: 0.409,
    width: 132,
    height: 48,
    intro: "永泉小镇是一处融合江南园林、山谷景观、温泉度假与地方美食的综合型文旅目的地。园内可漫步忆江南园林、体验温泉与住宿，并在特色街区品尝铜陵及皖南风味，适合家庭度假、情侣出游和周末短途旅行。",
    tags: ["江南园林", "温泉度假", "特色美食"],
    hours: "各园区开放时间不同，日游与夜游时段以当日运营公告为准",
    duration: "建议游玩 4—6 小时；度假可安排 1—2 天",
    bestTime: "四季皆宜，秋冬温泉体验更佳",
    services: ["游客中心：咨询、寄存、轮椅及便民物品服务", "度假配套：酒店民宿、温泉、更衣淋浴与休息空间", "餐饮体验：江南味道街区、地方小吃及特色宴席", "出行配套：停车场、接驳服务及新能源汽车充电设施（以现场为准）"],
    traffic: "地址：铜陵市义安区钟鸣镇。自驾建议导航至“永泉小镇游客中心”或预订酒店对应停车区域；经高速抵达铜陵后转城市主干道较为便捷。入住游客可提前向酒店确认接驳、停车及入园办理方式。",
    shows: ["10:30—11:00｜江南街景互动（参考时段）", "15:30—16:00｜民俗技艺展示（参考时段）", "19:00—19:40｜夜间沉浸式游园（参考时段）", "提示：工作日、周末及节假日节目安排可能不同，以景区电子屏和当日公告为准"],
    mapKeyword: "安徽铜陵永泉小镇游客中心",
    ticket: "园林游览、温泉、住宿及餐饮通常为不同产品，价格随日期、房型和套餐内容变化。部分产品可能需要提前预约，儿童及长者优惠以购票页面规则为准。请优先通过景区官方渠道查询并购买，避免购买来源不明的票券。",
    facilities: [
      { type: "parking", label: "西门停车场", note: "自驾推荐", x: 13, y: 68 },
      { type: "service", label: "游客服务中心", note: "小镇入口", x: 30, y: 53 },
      { type: "toilet", label: "公共卫生间", note: "江南味道街区", x: 57, y: 66 },
      { type: "toilet", label: "公共卫生间", note: "忆江南入口", x: 75, y: 31 },
    ],
    transitRoutes: [
      { from: "铜陵站", steps: ["前往市区公交站", "22路或28路方向", "顺安镇站换乘", "24路", "永泉小镇附近下车"] },
      { from: "铜陵北站", steps: ["28路", "顺安镇站换乘", "24路", "永泉小镇附近下车", "步行抵达游客中心"] },
    ],
  },
  {
    id: "fenghuangshan",
    name: "凤凰山景区",
    scene: "Phoenix Mountain scenic area in Tongling Anhui, green forested mountains, rocky valley and blooming peony garden in spring, clear daylight, realistic Chinese landscape travel photography, no text, no watermark",
    x: 0.576,
    y: 0.778,
    width: 150,
    height: 50,
    intro: "凤凰山景区以山林生态、奇石溪谷和牡丹文化为主要特色。春季牡丹花期是传统游览亮点，平日则适合登山健步、森林观景与乡野休闲。景区道路具有一定坡度，建议穿着防滑运动鞋并根据体力选择游览路线。",
    tags: ["牡丹文化", "生态登山", "自然观景"],
    hours: "建议白天游览；实际开放时间受季节、天气和活动安排影响",
    duration: "建议游玩 2—4 小时",
    bestTime: "春季赏花，秋季登山观景",
    services: ["咨询服务：游览线路、活动信息与安全提醒", "基础设施：停车区域、公共卫生间及沿途休息点", "游览补给：入口及部分节点提供饮水和简餐（以现场为准）", "安全提示：雨雪、强风等天气可能临时关闭部分山路"],
    traffic: "位于铜陵市义安区凤凰山一带。建议自驾导航至“凤凰山景区”并按现场标识进入停车区域；山区道路弯道较多，雨雾天气请减速行驶。团队游客宜提前确认大巴停靠及预约要求，返程前注意末班交通时间。",
    shows: ["09:30—10:00｜牡丹文化讲解（花期参考）", "14:00—14:30｜地方文化互动活动（节庆参考）", "全天｜生态科普与登山打卡活动（视活动安排开放）", "提示：凤凰山以自然游览为主，节目多在花期和节庆期间安排，以景区当天公告为准"],
    mapKeyword: "安徽铜陵凤凰山景区",
    ticket: "常规开放、花期活动及特色体验项目可能执行不同票务政策。花期和节假日可能实行预约、客流管控或临时交通安排。出发前请通过当地文旅或景区官方信息渠道确认开放状态、门票政策和天气情况。",
    facilities: [
      { type: "parking", label: "景区停车场", note: "山门入口", x: 14, y: 76 },
      { type: "service", label: "游客服务台", note: "入口广场", x: 29, y: 61 },
      { type: "toilet", label: "公共卫生间", note: "入口游览区", x: 42, y: 70 },
      { type: "toilet", label: "公共卫生间", note: "牡丹园附近", x: 70, y: 39 },
    ],
    transitRoutes: [
      { from: "铜陵站", steps: ["2路", "绿云山庄站换乘", "8路", "凤凰山景区终点站"] },
      { from: "铜陵北站", steps: ["68路快线", "绿云山庄站换乘", "8路", "凤凰山景区终点站"] },
    ],
  },
] as const;

const shunanTown = {
  id: "shunan",
  name: "顺安镇",
  scene: "Shunan ancient town in Tongling Anhui at sunrise, traditional Chinese old street, local breakfast shops and pastry stalls, distant green Phoenix Mountain with peony flowers, realistic premium travel photography, no text, no watermark",
  x: 0.493,
  y: 0.443,
  width: 120,
  height: 48,
  mapKeyword: "安徽铜陵义安区顺安镇",
  categories: {
    "美食": [
      { name: "顺安酥糖", meta: "百年风味 · 芝麻桂花香", detail: "顺安代表性传统糕点，口感松柔酥润，适合作为老街随手小食，也便于购买礼盒带走。" },
      { name: "大肠小刀面", meta: "老街早餐 · 卤香浓郁", detail: "手工面配卤制大肠，是顺安街头常见的热乎早餐，建议早晨到老街一带寻找本地面馆。" },
      { name: "钟鸣杀猪汤", meta: "乡土土菜 · 鲜香暖胃", detail: "以猪杂、时蔬等烹制的地方风味，适合多人在周边农家菜馆搭配柴火土鸡、葛根圆子品尝。" },
      { name: "白姜风味菜", meta: "铜陵名味 · 脆嫩微辛", detail: "糖醋白姜可作佐餐小菜，鲜姜也常用于炒肉等地方菜，是体验铜陵饮食风味的一道特色。" },
    ],
    "游玩": [
      { name: "顺安老街", meta: "古镇烟火 · 早市慢游", detail: "适合从早餐开始感受老镇生活，沿街寻找传统糕点、小吃和日常商铺，建议安排约 1 小时。" },
      { name: "凤凰山景区", meta: "牡丹花海 · 山林徒步", detail: "顺安镇域代表性景区，春季可赏牡丹，平日适合登山观景，并可联游附近凤凰村。" },
      { name: "金牛洞古采矿遗址", meta: "千年铜矿 · 文化研学", detail: "了解铜陵古代采冶文明的重要点位，可观看古矿坑、采矿巷道及相关采冶遗存。" },
      { name: "东湖湿地公园", meta: "亲水栈道 · 城市休闲", detail: "开放式滨水休闲空间，适合散步、亲子活动和傍晚观景，可与顺安镇区行程组合。" },
    ],
    "住宿": [
      { name: "永泉小镇度假住宿", meta: "园林度假 · 温泉体验", detail: "适合希望安排两日游的游客，可将江南园林、温泉、餐饮和住宿组合体验。" },
      { name: "顺安镇区商务住宿", meta: "交通便利 · 性价实用", detail: "镇区及义安城区住宿适合公交出行或短途停留，餐饮、购物等日常配套相对方便。" },
      { name: "凤凰山周边乡村民宿", meta: "山野清静 · 亲近自然", detail: "适合赏花季、亲子或自驾游客，预订前建议确认停车、餐饮、入住时间及距景点距离。" },
    ],
    "特产": [
      { name: "顺安酥糖", meta: "传统糕点 · 经典手信", detail: "以芝麻、糖、面粉等制成，酥而不散、甜香柔润，是顺安最具识别度的伴手礼之一。" },
      { name: "铜陵白姜", meta: "地理标志 · 糖醋皆宜", detail: "肉质脆嫩、姜香鲜明，可选择糖醋姜、嫩姜礼盒等便携产品，购买时注意生产日期与储存方式。" },
      { name: "凤丹产品", meta: "药用牡丹 · 地方物产", detail: "顺安凤凰山一带以凤丹闻名，可关注凤丹花茶及相关文创农产品，功效类宣传请理性辨别。" },
      { name: "铜工艺文创", meta: "古铜都记忆 · 文化礼物", detail: "铜摆件、书签及城市主题文创体现铜陵地域文化，适合作为旅行纪念。" },
    ],
  },
} as const;

type ScenicSpot = (typeof scenicSpots)[number];
type TownCategory = keyof typeof shunanTown.categories;
type DetailTab = "介绍" | "服务" | "交通" | "演出节目单";
const detailTabs: DetailTab[] = ["介绍", "服务", "交通", "演出节目单"];
const MEITUAN_MINI_PROGRAM = "weixin://dl/business/?t=IYgDT21eme4SAJA";

const charmTowns = [
  { id: "wusong", name: "五松镇", subtitle: "滨江城韵 · 宜居五松", intro: "五松镇承载着义安城区的生活记忆，城市服务、滨水空间与老城烟火在这里交融。适合沿滨河公园散步，在街巷中感受义安城区从容而便利的日常。", highlights: ["滨河休闲", "城区烟火", "便捷生活"], scene: "aerial view of a refined riverside Chinese town, green waterfront park, modern low rise neighborhoods, morning mist, Anhui travel photography, realistic, no text" },
  { id: "shunan-charm", name: "顺安镇", subtitle: "千年古镇 · 凤丹之乡", intro: "顺安是铜陵历史悠久的古镇之一，也是义安东部城区的重要节点。这里既有老街酥糖的烟火气，也有凤凰山牡丹、金牛洞古采矿遗址所串联的自然与青铜文化。", highlights: ["顺安老街", "凤凰山", "青铜文化"], scene: "historic Anhui market town street at sunrise, traditional Chinese shops, local pastry stalls, distant green mountains and peony flowers, realistic travel photography, no text" },
  { id: "zhongming", name: "钟鸣镇", subtitle: "山谷秘境 · 度假钟鸣", intro: "钟鸣镇山林资源丰厚，是义安东部颇具吸引力的生态旅游目的地。永泉小镇的江南园林、温泉度假和特色餐饮，让这里适合安排一场慢节奏的周末旅行。", highlights: ["永泉小镇", "山林温泉", "江南园林"], scene: "lush Anhui mountain valley resort with traditional Jiangnan gardens, stone bridges, streams, hot spring atmosphere, cinematic realistic travel photography, no text" },
  { id: "tianmen", name: "天门镇", subtitle: "山水田园 · 白姜故里", intro: "天门镇以生态山水、乡村田园和铜陵白姜等特色物产见长。山林、水库与村落共同构成清新的乡野图景，适合自驾、亲子和近郊休闲。", highlights: ["天门山水", "铜陵白姜", "乡村自驾"], scene: "Anhui countryside landscape, terraced vegetable fields with white ginger crops, reservoir and forested hills, bright natural daylight, realistic tourism photography, no text" },
  { id: "donglian", name: "东联镇", subtitle: "江畔沃野 · 活力东联", intro: "东联镇位于沿江区域，产业活力与广阔圩田相互映衬。这里能看到平坦田野、乡村道路与江畔生产生活共同组成的现代乡镇风貌。", highlights: ["沿江风光", "现代农业", "产业活力"], scene: "vast riverside farmland in Anhui China, geometric green fields, country roads, distant modern industrial skyline, golden hour, realistic aerial photography, no text" },
  { id: "xilian", name: "西联镇", subtitle: "艺术水乡 · 梦里西联", intro: "西联镇拥有丰沛水系与典型圩区田园风光，犁桥水镇让徽派建筑、民俗体验和水乡夜游成为当地鲜明名片。适合傍晚抵达，慢赏水岸灯影。", highlights: ["犁桥水镇", "圩区田园", "水乡夜游"], scene: "dreamy Anhui water town at blue hour, Huizhou architecture, canals, stone bridges, warm lantern reflections, realistic premium travel photography, no text" },
  { id: "xuba", name: "胥坝乡", subtitle: "江心绿洲 · 洲岛人家", intro: "胥坝乡隔江相望，洲岛、堤岸、田园和村庄形成独特的江心乡野景观。这里节奏舒缓，适合感受长江生态、骑行堤岸与原生乡村生活。", highlights: ["江心洲岛", "堤岸骑行", "生态田园"], scene: "Yangtze river island countryside in Anhui, green embankments, village houses, bicycles on riverside path, expansive river, realistic travel photography, no text" },
  { id: "laozhou", name: "老洲乡", subtitle: "长江湿地 · 生态老洲", intro: "老洲乡依长江而生，洲滩湿地、农田水网与候鸟生态构成开阔自然画卷。这里适合观江、亲近湿地，并体验安静质朴的沿江乡村。", highlights: ["太阳岛", "湿地观鸟", "沿江乡村"], scene: "peaceful Yangtze wetland island in Anhui, reeds, migratory birds, river sunset, rural fields and small village, realistic nature travel photography, no text" },
] as const;

const charmTownGuides = {
  wusong: {
    "美食": ["城区徽菜与铜陵土菜", "白姜炒肉、椒盐猪手等地方味"],
    "游玩": ["义安滨河公园慢行", "城区街巷与笠帽山周边休闲"],
    "住宿": ["城区商务酒店", "滨河及商业配套周边住宿"],
    "特产": ["铜陵白姜礼盒", "铜工艺文创与顺安酥糖"],
  },
  "shunan-charm": {
    "美食": ["大肠小刀面与老街早点", "顺安酥糖、钟鸣杀猪汤"],
    "游玩": ["顺安老街", "凤凰山景区与金牛洞遗址"],
    "住宿": ["顺安镇区便捷住宿", "凤凰山周边乡村民宿"],
    "特产": ["顺安酥糖", "凤丹产品与铜陵白姜"],
  },
  zhongming: {
    "美食": ["江南味道街区", "柴火土鸡、葛根圆子等乡土菜"],
    "游玩": ["永泉小镇忆江南园林", "山谷温泉与夜间游园"],
    "住宿": ["永泉度假酒店", "山林主题民宿与温泉住宿"],
    "特产": ["白姜制品", "凤丹花茶及地方农产品"],
  },
  tianmen: {
    "美食": ["白姜风味菜", "农家土鸡、时令山野菜"],
    "游玩": ["天门山水与乡村公路", "水库、田园及亲子采摘"],
    "住宿": ["镇区便捷住宿", "生态农庄与乡村民宿"],
    "特产": ["铜陵白姜", "时令果蔬及农副产品"],
  },
  donglian: {
    "美食": ["沿江河鲜与家常土菜", "圩区时令蔬菜"],
    "游玩": ["沿江堤岸观景", "现代农业与田园风光体验"],
    "住宿": ["镇区商务住宿", "义安城区酒店联动选择"],
    "特产": ["优质稻米", "沿江农副产品"],
  },
  xilian: {
    "美食": ["犁桥水镇特色小吃", "水乡土菜与河鲜"],
    "游玩": ["犁桥水镇日夜游", "圩区田园与水岸摄影"],
    "住宿": ["犁桥水镇度假住宿", "西联乡村民宿"],
    "特产": ["水镇文创", "稻米、茶干等地方手信"],
  },
  xuba: {
    "美食": ["江鲜与乡村家宴", "时令洲岛蔬果"],
    "游玩": ["江心洲岛漫游", "堤岸骑行与长江观景"],
    "住宿": ["乡村民宿与农家体验", "建议联动城区住宿"],
    "特产": ["洲岛农产品", "时令蔬果与生态稻米"],
  },
  laozhou: {
    "美食": ["沿江鱼鲜", "农家土菜与时令菜蔬"],
    "游玩": ["老洲太阳岛", "湿地观鸟与江岸日落"],
    "住宿": ["乡村休闲住宿", "城区或周边镇区酒店"],
    "特产": ["生态稻米", "沿江水产与农副产品"],
  },
} as const;

type CharmGuideCategory = keyof (typeof charmTownGuides)["wusong"];
type CharmTown = (typeof charmTowns)[number];
const charmGuideCategories: CharmGuideCategory[] = ["美食", "游玩", "住宿", "特产"];

const charmGuideDetails: Record<CharmGuideCategory, string[]> = {
  "美食": ["寻找当地最具代表性的餐桌风味，在老街小店或乡村餐馆感受义安烟火。", "结合时令食材与地方做法，适合作为行程中的特色正餐或小吃体验。"],
  "游玩": ["串联自然、人文与乡村场景，适合拍照、散步和了解当地故事。", "可结合半日或一日行程游览，出发前建议确认开放及活动安排。"],
  "住宿": ["兼顾出行便利与休息体验，可按商务、亲子或度假需求进行选择。", "节假日建议提前预约，并向商家确认早餐、停车和接驳等服务。"],
  "特产": ["汇集当地物产和风味手信，适合现场品尝或作为伴手礼带回。", "购买时可留意产地、保质期和包装方式，并优先选择正规经营渠道。"],
};

const guideScene = (town: CharmTown, category: CharmGuideCategory, item: string) => {
  const categoryScenes: Record<CharmGuideCategory, string> = {
    "美食": "authentic local Anhui Chinese cuisine served in a refined rustic restaurant, appetizing food photography",
    "游玩": "beautiful rural attraction and cultural landscape in Anhui China, premium realistic travel photography",
    "住宿": "welcoming boutique hotel or countryside homestay in Anhui China, warm natural interior and exterior travel photography",
    "特产": "local Anhui specialty products and elegant souvenir packaging on a natural wooden table, commercial lifestyle photography",
  };
  return `${categoryScenes[category]}, inspired by ${town.name} and ${item}, natural daylight, realistic, no text, no watermark`;
};

type TravelCategory = "景点" | "美食" | "住宿" | "购物";
const travelCategories: TravelCategory[] = ["景点", "美食", "住宿", "购物"];
const travelCatalog = {
  "景点": [
    { name: "永泉旅游度假区", area: "钟鸣镇", detail: "忆江南十二景、九宝温泉、铜钱市集与山林度假体验。" },
    { name: "犁桥水镇", area: "西联镇", detail: "徽派古建、水巷夜游、非遗展演与水乡民俗体验。" },
    { name: "凤凰山景区", area: "顺安镇", detail: "凤丹牡丹花海、相思树、滴水崖及山野休闲空间。" },
    { name: "金牛洞古采矿遗址", area: "顺安镇", detail: "探访古代铜矿遗址，了解义安三千年采冶文明。" },
    { name: "梧桐花谷", area: "钟鸣镇", detail: "四季花海、生态漂流、彩虹滑道与亲子户外体验。" },
    { name: "龙潭肖古村落", area: "钟鸣镇", detail: "古宅、石桥、溪流与山村生活交织的传统村落。" },
    { name: "江南铜谷旅游风景道", area: "顺安—钟鸣", detail: "串联铜文化遗址、古村和山林景观的自驾风景廊道。" },
    { name: "金山淘金小镇", area: "钟鸣镇", detail: "淘金互动、露营草坪与山野休闲相结合的新场景。" },
    { name: "印象河边", area: "天门镇", detail: "森林露营、户外烧烤、咖啡与农事体验的森野空间。" },
    { name: "东湖湿地公园", area: "顺安镇", detail: "环湖步道、荷塘、观鸟平台和开阔草坪组成的城市湿地。" },
  ],
  "美食": [
    { name: "永泉江南味道小吃街", area: "钟鸣镇", detail: "铜钱消费场景中集中品尝柴火饼、鱼丸和地方小吃。" },
    { name: "犁桥水镇圆楼", area: "西联镇", detail: "太白雕胡饭、水乡土菜与非遗风味的集中体验地。" },
    { name: "月明土菜馆", area: "义安区", detail: "主打地方家常菜、时令食材和义安乡土风味。" },
    { name: "山里任家", area: "义安区", detail: "适合品尝柴火土鸡、河鲜和山野农家菜。" },
    { name: "听泉居", area: "义安区", detail: "山水环境中的本地土菜和休闲用餐体验。" },
    { name: "汀州小院", area: "义安区", detail: "乡村小院氛围，提供家常土菜和多人聚餐。" },
    { name: "顺安老街早点", area: "顺安镇", detail: "大肠小刀面、鸡汤米面、太平烧饼和豆腐脑。" },
    { name: "钟鸣杀猪汤", area: "钟鸣镇", detail: "鲜香浓郁的地方民俗菜，适合搭配乡土小炒。" },
  ],
  "住宿": [
    { name: "永泉松云山居", area: "钟鸣镇", detail: "融入山林园景的度假住宿，适合康养与慢旅行。" },
    { name: "永泉竹塰人家", area: "钟鸣镇", detail: "竹林环境中的主题住宿，可联动温泉与园林游览。" },
    { name: "犁桥耕心堂", area: "西联镇", detail: "水镇古建氛围中的特色民宿，适合体验水乡夜色。" },
    { name: "铜雀台金陵大酒店", area: "五松镇周边", detail: "综合服务设施较完整，适合商务和家庭出行。" },
    { name: "临津悦豪国际大酒店", area: "顺安镇", detail: "靠近东部城区和主要交通节点的综合型住宿。" },
    { name: "顺安镇区商务住宿", area: "顺安镇", detail: "餐饮交通便利，适合作为凤凰山及周边游览中转。" },
    { name: "凤凰山乡村民宿", area: "顺安镇", detail: "靠近山野和村落，适合赏花季及自驾游客。" },
  ],
  "购物": [
    { name: "犁桥水镇文创区", area: "西联镇", detail: "水镇冰箱贴、布包挂件、非遗手作和主题纪念品。" },
    { name: "永泉小镇特产店", area: "钟鸣镇", detail: "白姜、凤丹、铜钱文创及义安地方风味产品。" },
    { name: "义安特色农产品展销点", area: "义安区", detail: "集中选购白姜、凤丹、山芋粉丝和生态农产品。" },
    { name: "顺安老街特产铺", area: "顺安镇", detail: "顺安酥糖、太平烧饼和传统糕点等地方手信。" },
    { name: "凤凰山农特优市集", area: "顺安镇", detail: "花期及活动期间展售凤丹、白姜、非遗文创等好物。" },
  ],
} as const;

const yianGoods = [
  { name: "铜陵白姜", type: "全球农遗", detail: "块大皮薄、汁多渣少，可制成糖醋姜、姜片和姜膏。", specification: "嫩姜礼盒 / 糖醋姜 / 姜膏", service: "支持产地直发，具体规格与配送范围以购买页为准。", scene: "premium fresh white ginger and elegant preserved ginger gift box, Anhui specialty product photography" },
  { name: "顺安酥糖", type: "传统风味", detail: "芝麻、桂花与麦芽糖交织，入口松柔酥香，是顺安经典手信。", specification: "经典袋装 / 节庆礼盒", service: "建议密封避光保存，过敏原等信息请查看商品包装。", scene: "traditional Chinese sesame flaky candy in elegant paper gift packaging, food photography" },
  { name: "凤丹系列", type: "农遗好物", detail: "源自凤凰山凤丹产业，可延伸为牡丹籽油、花茶和护肤产品。", specification: "牡丹籽油 / 凤丹花茶 / 护肤礼盒", service: "不同品类适用方式不同，下单前请核对产品说明。", scene: "white peony flowers, peony seed oil and refined botanical skincare gift set" },
  { name: "铜拓本画", type: "非遗文创", detail: "从青铜纹饰中提取文化符号，以拓印方式留下古铜都记忆。", specification: "装裱画 / 手作体验套装", service: "手工产品纹理略有差异，装裱尺寸以商品详情为准。", scene: "Chinese bronze rubbing artwork, ancient bronze patterns, refined cultural souvenir display" },
  { name: "铜艺文创", type: "铜都手作", detail: "铜制摆件、书签和生活器物，以现代设计讲述青铜文化。", specification: "铜书签 / 桌面摆件 / 茶器", service: "铜器会随使用形成自然氧化色泽，请按说明进行养护。", scene: "refined handcrafted copper ornaments bookmarks and cultural creative products" },
  { name: "太平烧饼", type: "地方糕点", detail: "层次丰富、现烤酥香，适合作为旅途小食和地方伴手礼。", specification: "现烤散装 / 便携礼袋", service: "糕点建议尽快食用，保质期和储存方式以包装为准。", scene: "freshly baked layered Chinese sesame flatbread, rustic bakery food photography" },
  { name: "顺安山芋粉丝", type: "乡村物产", detail: "以山芋淀粉加工，口感柔韧，适合炖煮、火锅和家常烹饪。", specification: "家庭装 / 农产礼盒", service: "干燥阴凉处保存，烹饪前可根据口感需求浸泡。", scene: "traditional sweet potato glass noodles in natural woven basket, rural product photography" },
  { name: "西联故事礼盒", type: "水乡礼物", detail: "集合水镇文创与地方风物，把西联水乡印象装进一份礼盒。", specification: "文创组合 / 节庆定制礼盒", service: "礼盒内容会随季节调整，实际组合以购买页面为准。", scene: "elegant Jiangnan water town souvenir gift box with cultural creative products" },
] as const;

type YianGood = (typeof yianGoods)[number];

const catalogScene = (category: TravelCategory, item: string) => `realistic premium travel photography for ${item} in Yian District Tongling Anhui China, ${category}, natural light, no text, no watermark`;
type TouristSection = "智慧导览" | "魅力义安" | "商旅食宿" | "义安好物" | "我的";
type VillagerSection = "村民首页" | "村务服务" | "积分服务" | "我要发布" | "我的";
type MainSection = TouristSection | VillagerSection;
type UserRole = "游客" | "村民" | "政务";
type GovernmentSection = "政务首页" | "监控中心" | "镇村数据" | "业务办理" | "我的";
type GovernmentBusiness = "全部" | "农产品审核" | "农房需求" | "民情诉求" | "惠农补贴" | "就业岗位" | "村务内容" | "议事投票" | "课程培训" | "游客内容";
type GovernmentReviewStatus = "待审核" | "已通过" | "已驳回" | "办理中";

const governmentScenics = [
  { id: "liqiao", name: "犁桥水镇", visitors: 3862, trend: "+12.6%", parkingFree: 126, parkingTotal: 380, cameras: 46, regions: ["主入口", "水岸街区", "圆楼广场"] },
  { id: "yongquan", name: "永泉小镇", visitors: 2418, trend: "+8.3%", parkingFree: 82, parkingTotal: 260, cameras: 38, regions: ["游客中心", "温泉入口", "江南味道"] },
  { id: "fenghuang", name: "凤凰山景区", visitors: 1296, trend: "-3.2%", parkingFree: 94, parkingTotal: 180, cameras: 29, regions: ["山门广场", "牡丹园", "登山步道"] },
] as const;

const monitorPoints = [
  { id: "M-001", name: "犁桥水镇主入口", area: "西联镇", scenic: "犁桥水镇", status: "在线", scene: "gate", targets: ["人", "车"] },
  { id: "M-017", name: "水岸街区东侧", area: "西联镇", scenic: "犁桥水镇", status: "在线", scene: "water", targets: ["人", "溺水"] },
  { id: "M-032", name: "永泉游客中心", area: "钟鸣镇", scenic: "永泉小镇", status: "在线", scene: "square", targets: ["人", "车", "异常聚集"] },
  { id: "M-048", name: "凤凰山登山步道", area: "顺安镇", scenic: "凤凰山景区", status: "在线", scene: "mountain", targets: ["人", "动物", "危险行为"] },
  { id: "M-063", name: "东湖湿地观景台", area: "顺安镇", scenic: "全区点位", status: "维护", scene: "wetland", targets: ["动物", "人"] },
  { id: "M-079", name: "胥坝渡口堤岸", area: "胥坝乡", scenic: "全区点位", status: "在线", scene: "river", targets: ["车", "人", "溺水"] },
] as const;

const governmentWarnings = [
  { level: "紧急", type: "溺水风险", point: "胥坝渡口堤岸", time: "10:42:18", detail: "识别到人员长时间靠近深水区警戒线" },
  { level: "较高", type: "异常聚集", point: "永泉游客中心", time: "10:36:05", detail: "入口区域人群密度超过预警阈值" },
  { level: "一般", type: "危险行为", point: "凤凰山登山步道", time: "10:28:44", detail: "游客翻越步道安全护栏" },
  { level: "提示", type: "动物出现", point: "东湖湿地观景台", time: "09:58:21", detail: "识别到野生动物进入游客步道" },
] as const;

const townStatistics = [
  { name: "五松镇", population: 68400, ages: [14, 63, 23], income: 46800, tourists: 162000, villages: 8 },
  { name: "顺安镇", population: 52900, ages: [17, 60, 23], income: 42100, tourists: 386000, villages: 12 },
  { name: "钟鸣镇", population: 38700, ages: [16, 61, 23], income: 39800, tourists: 512000, villages: 10 },
  { name: "天门镇", population: 31400, ages: [18, 59, 23], income: 37600, tourists: 126000, villages: 9 },
  { name: "东联镇", population: 35500, ages: [16, 62, 22], income: 40500, tourists: 84000, villages: 11 },
  { name: "西联镇", population: 29800, ages: [17, 60, 23], income: 38900, tourists: 448000, villages: 8 },
  { name: "胥坝乡", population: 18600, ages: [15, 58, 27], income: 35100, tourists: 93000, villages: 7 },
  { name: "老洲乡", population: 16400, ages: [14, 57, 29], income: 34600, tourists: 76000, villages: 6 },
] as const;

const governmentBusinessSeed = [
  { id: "B-26072801", type: "惠农补贴", title: "高标准农田建设补助申请", source: "顺安镇 · 王师傅", time: "今天 09:18", status: "待审核" as GovernmentReviewStatus },
  { id: "B-26072802", type: "就业岗位", title: "农产品直播运营岗位发布", source: "义安乡创中心", time: "今天 08:45", status: "待审核" as GovernmentReviewStatus },
  { id: "B-26072716", type: "村务内容", title: "东垅村七月财务公开文章", source: "顺安镇东垅村", time: "昨天 16:30", status: "待审核" as GovernmentReviewStatus },
  { id: "B-26072709", type: "议事投票", title: "村口闲置地改造方案票选", source: "顺安镇村委会", time: "昨天 14:12", status: "办理中" as GovernmentReviewStatus },
  { id: "B-26072621", type: "课程培训", title: "短视频助农直播实操课", source: "区农业农村局", time: "07月26日", status: "已通过" as GovernmentReviewStatus },
  { id: "B-26072608", type: "游客内容", title: "犁桥水镇游记与好物推荐", source: "游客内容平台", time: "07月26日", status: "待审核" as GovernmentReviewStatus },
] as const;

const villagerServices = [
  { name: "村务公开", detail: "查看村务公开信息、通知公告与政策文章", icon: HomeIcon, group: "村务服务", accent: "公开透明" },
  { name: "积分超市", detail: "使用参与乡村事务获得的积分兑换商品", icon: ShoppingBag, group: "积分服务", accent: "积分兑换" },
  { name: "议事投票", detail: "参与村务投票和公共决策，完成后获得积分", icon: UserRound, group: "积分服务", accent: "共商共议" },
  { name: "我的货摊", detail: "发布自家农产品，审核通过后展示至义安好物", icon: Store, group: "我要发布", accent: "村民发布" },
  { name: "农房盘活", detail: "发布农房出租、改造需求，参与乡村资源盘活", icon: HomeIcon, group: "我要发布", accent: "资源盘活" },
  { name: "课程培训", detail: "参与农业、电商等培训课程，学习并获得积分", icon: Compass, group: "积分服务", accent: "学习得分" },
  { name: "补贴申领", detail: "查看政府补贴政策并在线提交申领信息", icon: Heart, group: "村务服务", accent: "惠农政策" },
  { name: "就业岗位", detail: "查看政府发布的本地岗位并提交岗位申请", icon: Store, group: "村务服务", accent: "家门口就业" },
  { name: "民情诉求", detail: "提交意见建议和待解决事项，采纳解决可获积分", icon: UserRound, group: "我要发布", accent: "有事我来办" },
  { name: "先锋案例", detail: "展示党员活动、先锋事迹与基层服务风采", icon: MapIcon, group: "村务服务", accent: "先锋风采" },
] as const;

type VillagerPublication = {
  id: string;
  type: "农产品" | "农房" | "民情诉求";
  title: string;
  detail: string;
  status: string;
  createdAt: string;
  images: string[];
};

const VILLAGER_PUBLICATIONS_KEY = "yian-villager-publications";

const imageUrl = (prompt: string) => `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`;

const villagePublicArticles = [
  { type: "村务公开", title: "顺安镇六月村级财务收支公示", date: "2026-07-25", summary: "公开村集体经营收入、公益支出及重点项目资金使用情况。", image: imageUrl("Documentary photography of a clean Chinese village service center public information board, villagers reading financial disclosure notices, Anhui countryside, warm daylight, realistic, no text, no watermark") },
  { type: "通知公告", title: "关于开展人居环境集中整治的通知", date: "2026-07-22", summary: "本周六开展村庄清洁志愿行动，参与村民可获得共建积分。", image: imageUrl("Chinese rural villagers and volunteers cleaning a beautiful village lane together, green trees and white houses, community participation, realistic documentary photography, no text, no watermark") },
  { type: "项目进展", title: "村口闲置地改造项目进入方案票选", date: "2026-07-19", summary: "三套改造方案已完成公示，邀请全体村民参与线上表决。", image: imageUrl("Renovated village public garden in Anhui China, walking path, benches, native trees, villagers discussing community planning, realistic architectural documentary photography, no text, no watermark") },
];
const villageSubsidies = [
  { title: "2026年高标准农田建设补助", deadline: "08月20日截止", amount: "最高 2万元", status: "可申领" },
  { title: "农村电商创业扶持补贴", deadline: "长期受理", amount: "最高 1万元", status: "可申领" },
  { title: "特色种养产业奖补", deadline: "09月15日截止", amount: "按规模核定", status: "材料准备" },
];
const villageJobs = [
  { title: "农产品直播运营", company: "义安乡创中心", salary: "4000—6000元/月", tag: "本地就业", image: imageUrl("Young Chinese rural ecommerce presenter livestreaming local farm products in a modern village studio, rice and tea products on table, realistic photography, no text, no watermark") },
  { title: "民宿管家", company: "犁桥水镇民宿", salary: "3500—5000元/月", tag: "提供培训", image: imageUrl("Friendly Chinese homestay manager preparing an elegant guest room in a Jiangnan water town boutique inn, warm natural light, realistic hospitality photography, no text, no watermark") },
  { title: "农业技术员", company: "铜勤生态农业", salary: "5000—7000元/月", tag: "五险", image: imageUrl("Chinese agricultural technician inspecting healthy rice plants in a green paddy field with a tablet, Anhui countryside, realistic professional photography, no text, no watermark") },
];
const pointsGoods = [
  { name: "义安大米 5kg", points: 680, stock: 24, icon: "米", image: imageUrl("Premium bag of Anhui Yian rice with a wooden bowl of polished rice on a rustic table, green rice fields softly blurred behind, commercial product photography, no visible brand text, no watermark") },
  { name: "家用洗护套装", points: 520, stock: 36, icon: "惠", image: imageUrl("Neatly arranged eco friendly household cleaning and personal care gift set on a warm cream background with green leaves, realistic commercial product photography, no text, no watermark") },
  { name: "永泉温泉体验券", points: 1200, stock: 8, icon: "泉", image: imageUrl("Peaceful outdoor hot spring pool surrounded by bamboo and traditional Chinese garden architecture at dusk, warm steam, premium travel photography, no text, no watermark") },
];
const villageVotes = [
  { title: "村口闲置地改造方案票选", joined: 186, total: 260, reward: 30, deadline: "还剩2天", image: imageUrl("Chinese villagers gathered around a community planning table reviewing three landscape design proposals for village public space, realistic documentary photography, no text, no watermark") },
  { title: "2026年村民文化节主题征集", joined: 98, total: 180, reward: 20, deadline: "还剩5天", image: imageUrl("Joyful Chinese rural cultural festival in an Anhui village square, folk performance, lanterns, families participating, realistic documentary photography, no text, no watermark") },
];
const villageCourses = [
  { title: "短视频助农直播实操课", time: "周六 09:00", teacher: "乡村电商讲师 王老师", seats: 12, reward: 50, image: imageUrl("Chinese instructor teaching rural villagers smartphone video and livestream ecommerce skills in a bright modern classroom, hands-on workshop, realistic photography, no text, no watermark") },
  { title: "水稻病虫害绿色防控", time: "下周三 14:00", teacher: "区农技中心 李老师", seats: 28, reward: 30, image: imageUrl("Chinese agricultural expert teaching farmers green pest control in a lush rice field, group learning outdoors, realistic documentary photography, no text, no watermark") },
];

const tourPoints = [
  { x: 0.27, y: 0.24, zoom: 1.9, offset: 0 },
  { x: 0.55, y: 0.28, zoom: 2.05, offset: 0.2 },
  { x: 0.76, y: 0.48, zoom: 1.85, offset: 0.4 },
  { x: 0.58, y: 0.72, zoom: 1.95, offset: 0.61 },
  { x: 0.3, y: 0.7, zoom: 1.75, offset: 0.79 },
  { x: 0.5, y: 0.5, zoom: 1, offset: 1 },
];

type ViewTransform = { x: number; y: number; scale: number };
type Point = { x: number; y: number };
type Gesture = {
  x: number;
  y: number;
  scale: number;
  startPoint?: Point;
  startDistance?: number;
  anchor?: Point;
};

export default function Home() {
  const previewMapSrc = `${import.meta.env.BASE_URL}map-preview.jpg`;
  const highResolutionMapSrc = `${import.meta.env.BASE_URL}map-4096.jpg`;
  const stageRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const overlayAnimationRef = useRef<Animation | null>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const viewRef = useRef<ViewTransform>({ x: 0, y: 0, scale: 1 });
  const gestureRef = useRef<Gesture>({ x: 0, y: 0, scale: 1 });
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isHighResolution, setIsHighResolution] = useState(false);
  const [, setIsManual] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<ScenicSpot | null>(null);
  const [activeSection, setActiveSection] = useState<MainSection>("智慧导览");
  const [selectedCharmTown, setSelectedCharmTown] = useState<CharmTown | null>(null);
  const [activeCharmCategory, setActiveCharmCategory] = useState<CharmGuideCategory>("美食");
  const [activeTravelCategory, setActiveTravelCategory] = useState<TravelCategory>("景点");
  const [selectedGood, setSelectedGood] = useState<YianGood | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("游客");
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [governmentSection, setGovernmentSection] = useState<GovernmentSection>("政务首页");
  const [governmentScenicId, setGovernmentScenicId] = useState<(typeof governmentScenics)[number]["id"]>(governmentScenics[0].id);
  const [selectedMonitorId, setSelectedMonitorId] = useState<string>(monitorPoints[0].id);
  const [monitorFilter, setMonitorFilter] = useState("全区点位");
  const [selectedTown, setSelectedTown] = useState<string>(townStatistics[1].name);
  const [governmentBusiness, setGovernmentBusiness] = useState<GovernmentBusiness>("全部");
  const [businessStatuses, setBusinessStatuses] = useState<Record<string, GovernmentReviewStatus>>({});
  const [governmentNotice, setGovernmentNotice] = useState("");
  const [governmentModal, setGovernmentModal] = useState<"dispatch" | "notice" | "emergency" | null>(null);
  const [villagerSection, setVillagerSection] = useState<VillagerSection>("村民首页");
  const [activeVillagerService, setActiveVillagerService] = useState("村务公开");
  const [villagerNotice, setVillagerNotice] = useState("");
  const [likedVillageStory, setLikedVillageStory] = useState(false);
  const [villagerDetail, setVillagerDetail] = useState<{ type: string; title: string; data?: string } | null>(null);
  const [villagerPublications, setVillagerPublications] = useState<VillagerPublication[]>(() => {
    try { return JSON.parse(localStorage.getItem(VILLAGER_PUBLICATIONS_KEY) || "[]") as VillagerPublication[]; } catch { return []; }
  });
  const [publicationImages, setPublicationImages] = useState<string[]>([]);
  const [isTownOpen, setIsTownOpen] = useState(false);
  const [activeTownCategory, setActiveTownCategory] = useState<TownCategory>("美食");
  const [activeTab, setActiveTab] = useState<DetailTab>("介绍");

  const getMinimumScale = useCallback(() => {
    const stage = stageRef.current;
    const map = mapRef.current;
    if (!stage || !map) return 1;

    const widthScale = stage.clientWidth / MAP_WIDTH;
    const heightScale = stage.clientHeight / MAP_HEIGHT;
    return Math.max(widthScale, heightScale) * 1.01;
  }, []);

  const constrainView = useCallback((view: ViewTransform) => {
    const stage = stageRef.current;
    const map = mapRef.current;
    if (!stage || !map) return view;

    const minScale = getMinimumScale();
    const scale = Math.min(Math.max(view.scale, minScale), minScale * MAX_ZOOM);
    const renderedWidth = MAP_WIDTH * scale;
    const renderedHeight = MAP_HEIGHT * scale;
    const minX = Math.min(0, stage.clientWidth - renderedWidth);
    const maxX = Math.max(0, (stage.clientWidth - renderedWidth) / 2);
    const minY = Math.min(0, stage.clientHeight - renderedHeight);
    const maxY = Math.max(0, (stage.clientHeight - renderedHeight) / 2);

    return {
      scale,
      x: Math.min(maxX, Math.max(minX, view.x)),
      y: Math.min(maxY, Math.max(minY, view.y)),
    };
  }, [getMinimumScale]);

  const applyView = useCallback((view: ViewTransform) => {
    const map = mapRef.current;
    if (!map) return;
    const next = constrainView(view);
    viewRef.current = next;
    map.style.transform = `translate3d(${next.x}px, ${next.y}px, 0) scale(${next.scale})`;
    if (overlayRef.current) {
      overlayRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0) scale(${next.scale})`;
    }
  }, [constrainView]);

  const takeOverAnimation = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const matrix = new DOMMatrixReadOnly(getComputedStyle(map).transform);
    const current = { x: matrix.m41, y: matrix.m42, scale: Math.hypot(matrix.m11, matrix.m12) };
    animationRef.current?.cancel();
    overlayAnimationRef.current?.cancel();
    animationRef.current = null;
    overlayAnimationRef.current = null;
    applyView(current);
    setIsPaused(true);
    setIsManual(true);
  }, [applyView]);

  const buildTour = useCallback(() => {
    const stage = stageRef.current;
    const map = mapRef.current;
    if (!stage || !map) return;

    animationRef.current?.cancel();
    overlayAnimationRef.current?.cancel();
    map.style.transform = "";
    if (overlayRef.current) overlayRef.current.style.transform = "";
    const viewportWidth = stage.clientWidth;
    const viewportHeight = stage.clientHeight;
    const mapWidth = MAP_WIDTH;
    const mapHeight = MAP_HEIGHT;
    const coverScale = getMinimumScale();
    const fittedWidth = mapWidth * coverScale;
    const fittedHeight = mapHeight * coverScale;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finalScale = coverScale;
    const finalX = (viewportWidth - mapWidth * finalScale) / 2;
    const finalY = (viewportHeight - mapHeight * finalScale) / 2;
    const keyframes = tourPoints.map(({ x, y, zoom, offset }, index) => {
      if (index === tourPoints.length - 1) {
        return {
          transform: `translate3d(${finalX}px, ${finalY}px, 0) scale(${finalScale})`,
          offset,
          easing: "cubic-bezier(.42, 0, .22, 1)",
        };
      }

      return {
        transform: `translate3d(${viewportWidth / 2 - fittedWidth * x * zoom}px, ${viewportHeight / 2 - fittedHeight * y * zoom}px, 0) scale(${coverScale * zoom})`,
        offset,
        easing: "cubic-bezier(.42, 0, .22, 1)",
      };
    });

    setIsManual(false);
    if (reduceMotion) {
      map.style.transform = keyframes[keyframes.length - 1].transform;
      setIsPaused(true);
      return;
    }

    const animation = map.animate(keyframes, { duration: TOUR_DURATION, fill: "forwards", iterations: 1 });
    if (overlayRef.current) {
      overlayAnimationRef.current = overlayRef.current.animate(keyframes, { duration: TOUR_DURATION, fill: "forwards", iterations: 1 });
    }
    animation.onfinish = () => setIsPaused(true);
    animationRef.current = animation;
    setIsPaused(false);
  }, [getMinimumScale]);

  useEffect(() => {
    if (!isReady) return;

    const highResolutionImage = new Image();
    highResolutionImage.decoding = "async";
    highResolutionImage.src = highResolutionMapSrc;
    highResolutionImage.onload = async () => {
      try {
        await highResolutionImage.decode();
      } catch {
        // 图片已加载时仍可直接替换。
      }
      setIsHighResolution(true);
    };
  }, [highResolutionMapSrc, isReady]);

  useEffect(() => {
    const updateOrientation = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);
    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
      animationRef.current?.cancel();
      overlayAnimationRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const frame = requestAnimationFrame(buildTour);
    return () => cancelAnimationFrame(frame);
  }, [buildTour, isLandscape, isReady]);

  const beginGesture = (points: Point[]) => {
    const view = viewRef.current;
    if (points.length === 1) {
      gestureRef.current = { ...view, startPoint: points[0] };
      return;
    }

    const midpoint = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
    gestureRef.current = {
      ...view,
      startDistance: Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
      anchor: { x: (midpoint.x - view.x) / view.scale, y: (midpoint.y - view.y) / view.scale },
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isReady) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (pointersRef.current.size === 0) takeOverAnimation();
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    beginGesture([...pointersRef.current.values()].slice(0, 2));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointersRef.current.values()].slice(0, 2);
    const gesture = gestureRef.current;

    if (points.length === 1 && gesture.startPoint) {
      applyView({
        x: gesture.x + points[0].x - gesture.startPoint.x,
        y: gesture.y + points[0].y - gesture.startPoint.y,
        scale: gesture.scale,
      });
      return;
    }

    if (points.length === 2 && gesture.startDistance && gesture.anchor) {
      const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      const midpoint = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      const minScale = getMinimumScale();
      const scale = Math.min(Math.max(gesture.scale * distance / gesture.startDistance, minScale), minScale * MAX_ZOOM);
      applyView({ x: midpoint.x - gesture.anchor.x * scale, y: midpoint.y - gesture.anchor.y * scale, scale });
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size > 0) beginGesture([...pointersRef.current.values()].slice(0, 2));
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isReady) return;
    event.preventDefault();
    takeOverAnimation();
    const view = viewRef.current;
    const minScale = getMinimumScale();
    const nextScale = Math.min(Math.max(view.scale * Math.exp(-event.deltaY * 0.0015), minScale), minScale * MAX_ZOOM);
    const imageX = (event.clientX - view.x) / view.scale;
    const imageY = (event.clientY - view.y) / view.scale;
    applyView({ x: event.clientX - imageX * nextScale, y: event.clientY - imageY * nextScale, scale: nextScale });
  };

  const openSpot = (spot: ScenicSpot) => {
    takeOverAnimation();
    setSelectedSpot(spot);
    setIsTownOpen(false);
    setActiveTab("介绍");
  };

  const openTown = () => {
    takeOverAnimation();
    setSelectedSpot(null);
    setIsTownOpen(true);
    setActiveTownCategory("美食");
  };

  const renderDetail = () => {
    if (!selectedSpot) return null;
    if (activeTab === "介绍") {
      return (
        <div className="intro-detail">
          <div className="spot-tags">{selectedSpot.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <p>{selectedSpot.intro}</p>
          <dl className="visit-facts">
            <div><dt>开放参考</dt><dd>{selectedSpot.hours}</dd></div>
            <div><dt>游玩时长</dt><dd>{selectedSpot.duration}</dd></div>
            <div><dt>推荐时节</dt><dd>{selectedSpot.bestTime}</dd></div>
          </dl>
          <small className="detail-disclaimer">以上为导览参考信息，开放时间及运营安排请以景区当天公告为准。</small>
        </div>
      );
    }
    if (activeTab === "服务") {
      return (
        <div className="service-detail">
          <div className="facility-map" aria-label={`${selectedSpot.name}服务设施示意图`}>
            <span className="facility-road road-a" />
            <span className="facility-road road-b" />
            <strong>{selectedSpot.name} · 设施示意</strong>
            {selectedSpot.facilities.map((facility, index) => (
              <button
                key={`${facility.label}-${index}`}
                type="button"
                className={`facility-pin is-${facility.type}`}
                style={{ left: `${facility.x}%`, top: `${facility.y}%` }}
                title={`${facility.label}：${facility.note}`}
              >
                <span>{facility.type === "parking" ? "P" : facility.type === "toilet" ? "卫" : "服"}</span>
                <small>{facility.label}</small>
              </button>
            ))}
          </div>
          <ul className="detail-list">{selectedSpot.services.map((item: string) => <li key={item}>{item}</li>)}</ul>
          <small className="detail-disclaimer">设施点位为导览示意，具体位置请以景区现场标识为准。</small>
        </div>
      );
    }
    if (activeTab === "交通") {
      return (
        <div className="transit-detail">
          {selectedSpot.transitRoutes.map((route) => (
            <article className="transit-route" key={route.from}>
              <header><span>起点</span><strong>{route.from}</strong></header>
              <div className="route-steps">{route.steps.map((step, index) => <span key={`${step}-${index}`}>{step}</span>)}</div>
            </article>
          ))}
          <p>{selectedSpot.traffic}</p>
          <small className="detail-disclaimer">公交线路与班次可能临时调整，出发前请通过实时公交或地图应用复核。</small>
        </div>
      );
    }
    return <ul className="show-list">{selectedSpot.shows.map((item: string) => <li key={item}>{item}</li>)}</ul>;
  };

  const showVillagerNotice = (message: string) => {
    setVillagerNotice(message);
    window.setTimeout(() => setVillagerNotice(""), 2400);
  };

  const openVillagerDetail = (type: string, title: string, data?: string) => setVillagerDetail({ type, title, data });

  const handlePublicationImages = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 6 - publicationImages.length);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPublicationImages((images) => [...images, String(reader.result)].slice(0, 6));
      reader.readAsDataURL(file);
    });
  };

  const saveVillagerPublication = (type: VillagerPublication["type"], title: string, detail: string) => {
    const publication: VillagerPublication = { id: `${Date.now()}`, type, title, detail, status: type === "农产品" ? "政务审核中" : "已受理", createdAt: new Date().toLocaleString("zh-CN"), images: publicationImages };
    setVillagerPublications((items) => {
      const next = [publication, ...items];
      localStorage.setItem(VILLAGER_PUBLICATIONS_KEY, JSON.stringify(next));
      return next;
    });
    setPublicationImages([]);
    showVillagerNotice(`${type}发布成功，可在“我的发布”查看`);
  };

  const publicationUploader = () => <div className="publication-uploader"><label><input type="file" accept="image/*" multiple onChange={(event) => handlePublicationImages(event.target.files)} /><span>＋ 上传图片</span><small>最多6张，建议展示实景和细节</small></label>{publicationImages.length > 0 && <div>{publicationImages.map((image, index) => <figure key={`${image.slice(0, 24)}-${index}`}><img src={image} alt={`待发布图片${index + 1}`} /><button type="button" onClick={() => setPublicationImages((images) => images.filter((_, imageIndex) => imageIndex !== index))}>删除</button></figure>)}</div>}</div>;

  const getVillagerDetailImage = (type: string, title: string) => {
    if (type === "article") return villagePublicArticles.find((item) => item.title === title)?.image || imageUrl("Chinese village public affairs meeting in a clean community service hall, realistic documentary photography, no text, no watermark");
    if (type === "case") return title.includes("水稻") ? imageUrl("Chinese Communist Party volunteer members helping farmers inspect a green rice field, rural Anhui, realistic documentary photography, no text, no watermark") : imageUrl("Chinese villagers and local officials holding an outdoor bench discussion meeting under a large tree, warm community atmosphere, realistic photography, no text, no watermark");
    if (type === "story") return imageUrl("New solar street lights illuminating a peaceful Chinese village road at dusk, villagers walking home safely, realistic documentary photography, no text, no watermark");
    if (type === "course") return villageCourses.find((item) => item.title === title)?.image || villageCourses[0].image;
    if (type === "goods") return pointsGoods.find((item) => item.name === title)?.image || pointsGoods[0].image;
    return "";
  };

  const renderVillagerDetail = () => {
    if (!villagerDetail) return null;
    const { type, title, data } = villagerDetail;
    const detailImage = getVillagerDetailImage(type, title);
    const close = () => setVillagerDetail(null);
    const detailHero = (eyebrow: string, description: string, showCover = true) => <><div className="villager-detail-hero"><small>{eyebrow}</small><h2>{title}</h2><p>{description}</p></div>{showCover && detailImage && <img className="villager-detail-cover" src={detailImage} alt={`${title}相关图片`} />}</>;
    if (type === "article" || type === "case" || type === "story") return <>{detailHero(type === "case" ? "先锋案例" : type === "story" ? "乡亲动态" : "村务公开", type === "story" ? "民情有回应，办理有结果，共建成果由全体村民共同见证。" : "信息公开透明，邀请每一位村民共同监督、共同参与。")}<article className="villager-article-detail"><p>{data || "本事项已按照村务公开程序完成整理与公示。相关内容经村务监督委员会审核，现向全体村民公开。"}</p><h3>详细内容</h3><p>本次工作坚持村民知情、村民参与、村民监督原则，事项进度、资金使用和办理结果将持续更新。如有疑问，可通过民情诉求提交意见，也可在村务公开日到村服务中心现场咨询。</p><div><span>发布单位：顺安镇村民委员会</span><span>发布日期：2026-07-28</span></div></article></>;
    if (type === "vote") return <>{detailHero("议事投票 · 参与得30积分", "请选择您支持的改造方案，每位认证村民仅可提交一次。")}<form className="villager-choice-form" onSubmit={(event) => { event.preventDefault(); showVillagerNotice("投票提交成功，感谢参与家乡建设"); close(); }}><label><input type="radio" name="vote" required /><span><strong>A方案 · 乡村共享花园</strong><small>保留原有树木，增加休闲步道、儿童活动区和公共座椅。</small></span></label><label><input type="radio" name="vote" /><span><strong>B方案 · 农产品周末集市</strong><small>建设可移动摊位，为村民农产品销售和节庆活动提供空间。</small></span></label><label><input type="radio" name="vote" /><span><strong>C方案 · 停车与便民服务点</strong><small>增加停车位、充电设施和便民服务驿站。</small></span></label><button type="submit">确认提交投票</button></form></>;
    if (type === "course") return <>{detailHero("在线课程 · 学完得50积分", "课程支持手机在线观看视频，完成全部章节学习后自动发放积分。", false)}<div className="villager-online-course"><div className="villager-video-player"><img src={detailImage} alt={`${title}课程封面`} /><span><Play /></span><div><small>在线课程 · 共 6 节</small><strong>点击播放课程</strong></div></div><div className="villager-detail-info"><dl><div><dt>学习方式</dt><dd>手机在线观看，支持随时暂停</dd></div><div><dt>课程时长</dt><dd>共 95 分钟</dd></div><div><dt>授课老师</dt><dd>乡村电商讲师 王老师</dd></div><div><dt>学习奖励</dt><dd>完成课程获得 50 积分</dd></div></dl><h3>课程内容</h3><p>账号定位、短视频拍摄、直播间搭建、农产品讲解、订单与售后处理。</p><button type="button" onClick={() => showVillagerNotice("课程已开始播放")}>开始在线观看</button></div></div></>;
    if (type === "goods") return <>{detailHero("积分商品", "使用共建积分兑换，兑换成功后可选择到村服务中心领取或配送到家。")}<div className="villager-exchange-detail"><dl><div><dt>所需积分</dt><dd>{title.includes("大米") ? "680" : title.includes("洗护") ? "520" : "1200"}积分</dd></div><div><dt>领取方式</dt><dd>服务中心自提 / 村内配送</dd></div><div><dt>兑换说明</dt><dd>兑换后不支持退换，商品以实际领取为准。</dd></div></dl><button type="button" onClick={() => { showVillagerNotice(`已成功兑换${title}`); close(); }}>确认兑换</button></div></>;
    if (type === "subsidy" || type === "job") return <>{detailHero(type === "subsidy" ? "惠农补贴" : "本地就业", type === "subsidy" ? "请核对申领条件并填写申请信息，提交后可在个人中心查询进度。" : "查看岗位要求并完善申请信息，用工单位将在审核后联系您。")}<form className="village-form-page villager-detail-form" onSubmit={(event) => { event.preventDefault(); showVillagerNotice(type === "subsidy" ? "补贴申请已提交" : "岗位申请已提交"); close(); }}><label>申请人姓名<input required placeholder="请输入姓名" /></label><label>联系电话<input required placeholder="请输入联系电话" /></label><label>{type === "subsidy" ? "申请说明" : "个人经历"}<textarea required placeholder={type === "subsidy" ? "填写经营规模、申请理由等" : "简要填写相关工作经历和技能"} /></label><button type="submit">提交申请</button></form></>;
    if (type === "publications") return <><div className="villager-detail-hero"><small>我的发布</small><h2>发布记录</h2><p>农产品、农房和民情诉求均保存在当前浏览器，可在这里查看审核与受理状态。</p></div><div className="villager-publication-list">{villagerPublications.length ? villagerPublications.map((item) => <article key={item.id}>{item.images.length > 0 && <div>{item.images.map((image, index) => <img key={`${item.id}-${index}`} src={image} alt={`${item.title}图片${index + 1}`} />)}</div>}<header><span>{item.type}</span><small>{item.status}</small></header><h3>{item.title}</h3><p>{item.detail}</p><time>{item.createdAt}</time></article>) : <div className="villager-publication-empty"><strong>暂无发布内容</strong><p>前往“我要发布”，可发布农产品、农房需求或民情诉求。</p></div>}</div></>;
    if (type === "record") return <><div className="villager-detail-hero"><small>办理进度</small><h2>{title}</h2><p>事项进度实时更新，如需补充材料，工作人员会通过消息通知联系您。</p></div><div className="villager-timeline"><article className="is-done"><span /><div><strong>申请已提交</strong><small>2026-07-26 09:30</small><p>申请材料已成功提交。</p></div></article><article className="is-done"><span /><div><strong>材料初审完成</strong><small>2026-07-27 15:20</small><p>材料完整，已转交相关负责人办理。</p></div></article><article><span /><div><strong>业务办理中</strong><small>预计3个工作日内完成</small><p>您可以在本页面持续查看处理结果。</p></div></article></div></>;
    if (type === "identity") return <><div className="villager-detail-hero"><small>村民认证</small><h2>认证信息</h2><p>认证信息用于参与村务投票、补贴申请和积分发放。</p></div><div className="villager-settings-detail"><dl><div><dt>姓名</dt><dd>王师傅</dd></div><div><dt>所属村镇</dt><dd>顺安镇</dd></div><div><dt>认证状态</dt><dd>已认证</dd></div><div><dt>认证时间</dt><dd>2026-03-18</dd></div></dl><button type="button" onClick={() => showVillagerNotice("认证信息更新申请已提交")}>更新认证信息</button></div></>;
    if (type === "address") return <><div className="villager-detail-hero"><small>账户设置</small><h2>收货地址</h2><p>用于积分商品配送和惠农物资领取。</p></div><div className="villager-address-list"><article><strong>王师傅 138****6688</strong><p>安徽省铜陵市义安区顺安镇东垅村18号</p><span>默认地址</span></article><article><strong>王师傅 138****6688</strong><p>顺安镇村民服务中心代收点</p><button type="button" onClick={() => showVillagerNotice("默认收货地址已更新")}>设为默认</button></article><button type="button" onClick={() => showVillagerNotice("已进入新增地址页面")}>新增收货地址</button></div></>;
    if (type === "messages") return <><div className="villager-detail-hero"><small>消息中心</small><h2>消息通知</h2><p>办理进度、活动提醒和积分变化都会在这里通知您。</p></div><div className="villager-message-list"><article className="is-unread"><span>审核</span><div><strong>您的农产品发布正在审核</strong><p>预计2个工作日内完成审核。</p><small>今天 09:20</small></div></article><article className="is-unread"><span>积分</span><div><strong>30共建积分已到账</strong><p>来源：村口闲置地改造方案投票。</p><small>昨天 16:35</small></div></article><article><span>课程</span><div><strong>直播实操课即将开课</strong><p>请于周六08:50前完成签到。</p><small>07月26日</small></div></article></div></>;
    return <><div className="villager-detail-hero"><small>服务支持</small><h2>帮助与反馈</h2><p>使用过程中遇到问题，可提交反馈或联系村民服务中心。</p></div><form className="villager-feedback-form" onSubmit={(event) => { event.preventDefault(); showVillagerNotice("反馈提交成功，我们会尽快处理"); close(); }}><label>问题类型<select><option>功能使用</option><option>内容纠错</option><option>服务建议</option><option>其他问题</option></select></label><label>问题描述<textarea required placeholder="请详细描述遇到的问题" /></label><button type="submit">提交反馈</button></form></>;
  };

  const renderVillagerService = () => {
    if (activeVillagerService === "村务公开") return <div className="village-content-list">{villagePublicArticles.map((item) => <article className="has-image" key={item.title}><img src={item.image} alt={item.title} /><div><small>{item.type} · {item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><button type="button" onClick={() => openVillagerDetail("article", item.title, item.summary)}>阅读文章</button></div></article>)}</div>;
    if (activeVillagerService === "补贴申领") return <div className="village-policy-list">{villageSubsidies.map((item) => <article key={item.title}><span>{item.status}</span><div><h3>{item.title}</h3><p>{item.deadline} · {item.amount}</p></div><button type="button" onClick={() => openVillagerDetail("subsidy", item.title)}>查看申领</button></article>)}</div>;
    if (activeVillagerService === "就业岗位") return <div className="village-job-list">{villageJobs.map((item) => <article key={item.title}><small>{item.tag}</small><h3>{item.title}</h3><p>{item.company}</p><strong>{item.salary}</strong><button type="button" onClick={() => openVillagerDetail("job", item.title)}>岗位详情</button></article>)}</div>;
    if (activeVillagerService === "先锋案例") return <div className="village-content-list"><article className="has-image"><img src={getVillagerDetailImage("case", "党员志愿队助力水稻夏管")} alt="党员志愿队助力水稻夏管" /><div><small>党员风采 · 7月主题活动</small><h3>党员志愿队助力水稻夏管</h3><p>先锋党员联合农技人员走进田间，为种植户提供病虫害防治与水肥管理指导。</p><button type="button" onClick={() => openVillagerDetail("case", "党员志愿队助力水稻夏管")}>查看风采</button></div></article><article className="has-image"><img src={getVillagerDetailImage("case", "“板凳议事会”让村民意见有回音")} alt="板凳议事会" /><div><small>基层治理 · 先锋案例</small><h3>“板凳议事会”让村民意见有回音</h3><p>每月一次面对面议事，将村民建议转化为可跟踪、可评价的共建项目。</p><button type="button" onClick={() => openVillagerDetail("case", "“板凳议事会”让村民意见有回音")}>查看案例</button></div></article></div>;
    if (activeVillagerService === "积分超市") return <><div className="village-points-balance"><div><small>可用积分</small><strong>1,280</strong></div><span>本月已获得 160 分</span></div><div className="points-goods-grid">{pointsGoods.map((item) => <article key={item.name}><img src={item.image} alt={item.name} /><h3>{item.name}</h3><p>库存 {item.stock} 件</p><strong>{item.points} 积分</strong><button type="button" onClick={() => openVillagerDetail("goods", item.name, item.icon)}>查看兑换</button></article>)}</div></>;
    if (activeVillagerService === "议事投票") return <div className="village-vote-list">{villageVotes.map((item) => <article key={item.title}><small>{item.deadline} · 参与得 {item.reward} 积分</small><h3>{item.title}</h3><p>{item.joined} / {item.total} 位村民已参与</p><i><b style={{ width: `${item.joined / item.total * 100}%` }} /></i><button type="button" onClick={() => openVillagerDetail("vote", item.title)}>查看并投票</button></article>)}</div>;
    if (activeVillagerService === "课程培训") return <div className="village-course-list">{villageCourses.map((item) => <article className="has-image" key={item.title}><img src={item.image} alt={item.title} /><div><small>在线课程 · 学完得 {item.reward} 积分</small><h3>{item.title}</h3><p>{item.teacher}</p><span>支持手机在线观看</span><button type="button" onClick={() => openVillagerDetail("course", item.title)}>在线观看</button></div></article>)}</div>;
    if (activeVillagerService === "我的货摊") return <div className="village-form-page"><div className="village-form-guide"><small>发布后将由政务端审核</small><h3>把家乡好物卖得更远</h3><p>审核通过后，商品将在游客端“义安好物”中展示，并标记“村民发布”。</p></div><form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); saveVillagerPublication("农产品", String(form.get("title")), String(form.get("detail"))); event.currentTarget.reset(); }}><label>农产品名称<input name="title" required placeholder="如：自家种植富硒大米" /></label><label>产品介绍<textarea name="detail" required placeholder="介绍产地、种植方式、规格等" /></label><div><label>参考价格<input required placeholder="如：68元/袋" /></label><label>联系电话<input required placeholder="请输入联系电话" /></label></div>{publicationUploader()}<button type="submit">提交政务审核</button></form></div>;
    if (activeVillagerService === "农房盘活") return <div className="village-form-page"><div className="village-form-guide"><small>农房资源盘活</small><h3>让闲置农房焕发新价值</h3><p>可发布出租、合作改造、民宿经营等需求，也可参与已有盘活项目。</p></div><form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); saveVillagerPublication("农房", String(form.get("type")), String(form.get("detail"))); event.currentTarget.reset(); }}><label>需求类型<select name="type"><option>房屋出租</option><option>合作改造</option><option>寻找运营方</option><option>我想参与项目</option></select></label><label>农房情况<textarea name="detail" required placeholder="填写位置、面积、现状及合作设想" /></label>{publicationUploader()}<button type="submit">发布盘活需求</button></form></div>;
    return <div className="village-form-page"><div className="village-form-guide"><small>民有所呼 · 我有所应</small><h3>您的每条建议都会被跟踪</h3><p>诉求被采纳并解决后可获得共建积分，办理进度将在“我的申请”中更新。</p></div><form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); saveVillagerPublication("民情诉求", String(form.get("type")), String(form.get("detail"))); event.currentTarget.reset(); }}><label>诉求类型<select name="type"><option>意见建议</option><option>环境治理</option><option>公共设施</option><option>邻里协调</option><option>其他事项</option></select></label><label>具体内容<textarea name="detail" required placeholder="请详细描述需要解决的事情或建议" /></label><label>期望结果<input placeholder="希望如何解决" /></label>{publicationUploader()}<button type="submit">提交民情诉求</button></form></div>;
  };

  const showGovernmentNotice = (message: string) => {
    setGovernmentNotice(message);
    window.setTimeout(() => setGovernmentNotice(""), 2400);
  };

  const activeGovernmentScenic = governmentScenics.find((item) => item.id === governmentScenicId) || governmentScenics[0];
  const activeMonitor = monitorPoints.find((item) => item.id === selectedMonitorId) || monitorPoints[0];
  const activeTownStats = townStatistics.find((item) => item.name === selectedTown) || townStatistics[0];
  const publicationBusiness = villagerPublications.map((item) => ({
    id: item.id,
    type: item.type === "农产品" ? "农产品审核" : item.type === "农房" ? "农房需求" : "民情诉求",
    title: item.title,
    source: `村民端发布 · ${item.createdAt}`,
    time: item.createdAt,
    status: (businessStatuses[item.id] || (item.status.includes("审核") ? "待审核" : "办理中")) as GovernmentReviewStatus,
    detail: item.detail,
    images: item.images,
  }));
  const governmentBusinesses = [
    ...publicationBusiness,
    ...governmentBusinessSeed.map((item) => ({ ...item, status: businessStatuses[item.id] || item.status, detail: "请核验提交内容、主体信息与相关材料，处理结果将同步至对应用户端。", images: [] as string[] })),
  ];
  const visibleGovernmentBusinesses = governmentBusiness === "全部" ? governmentBusinesses : governmentBusinesses.filter((item) => item.type === governmentBusiness);

  const updateGovernmentBusiness = (id: string, status: GovernmentReviewStatus) => {
    setBusinessStatuses((items) => ({ ...items, [id]: status }));
    const publication = villagerPublications.find((item) => item.id === id);
    if (publication) {
      const next = villagerPublications.map((item) => item.id === id ? { ...item, status: status === "已通过" ? "审核通过" : status === "已驳回" ? "审核未通过" : "办理中" } : item);
      setVillagerPublications(next);
      localStorage.setItem(VILLAGER_PUBLICATIONS_KEY, JSON.stringify(next));
    }
    showGovernmentNotice(status === "已通过" ? "审核已通过，结果已同步至用户端" : status === "已驳回" ? "已退回并通知提交人补充材料" : "事项已转入办理流程");
  };

  const exportGovernmentData = () => {
    const rows = ["模块,指标,数值", `景区客流,${activeGovernmentScenic.name},${activeGovernmentScenic.visitors}`, `剩余车位,${activeGovernmentScenic.name},${activeGovernmentScenic.parkingFree}`, `镇村人口,${activeTownStats.name},${activeTownStats.population}`, `人均收入,${activeTownStats.name},${activeTownStats.income}`, `游客量,${activeTownStats.name},${activeTownStats.tourists}`];
    const blob = new Blob([`\ufeff${rows.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `义安政务数据-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showGovernmentNotice("数据报表已导出");
  };

  const renderGovernmentHome = () => <>
    <section className="gov-section-heading"><div><small>今日概览</small><h2>政务工作台</h2></div><span><i /> 数据已更新</span></section>
    <section className="gov-kpi-grid">
      <article><span><Users /></span><div><small>全区实时客流</small><strong>7,576</strong><em>较昨日 +9.8%</em></div></article>
      <article><span><Car /></span><div><small>景区剩余车位</small><strong>302</strong><em>总容量 820</em></div></article>
      <article><span><Camera /></span><div><small>在线监控点位</small><strong>148</strong><em>在线率 98.7%</em></div></article>
      <article className="is-warning"><span><ShieldAlert /></span><div><small>今日智能预警</small><strong>12</strong><em>2 条待处置</em></div></article>
    </section>
    <section className="gov-panel gov-scenic-panel">
      <header><div><small>景区运行</small><h2>运行数据概览</h2></div><span>{activeGovernmentScenic.name}</span></header>
      <nav className="gov-scenic-tabs" aria-label="选择景区">{governmentScenics.map((item) => <button type="button" key={item.id} className={governmentScenicId === item.id ? "is-active" : ""} onClick={() => setGovernmentScenicId(item.id)}>{item.name}</button>)}</nav>
      <div className="gov-scenic-summary"><div><small>实时入园</small><strong>{activeGovernmentScenic.visitors.toLocaleString()}</strong><span className={activeGovernmentScenic.trend.startsWith("-") ? "is-down" : ""}>{activeGovernmentScenic.trend}</span></div><div><small>剩余停车位</small><strong>{activeGovernmentScenic.parkingFree}<em> / {activeGovernmentScenic.parkingTotal}</em></strong><i><b style={{ width: `${activeGovernmentScenic.parkingFree / activeGovernmentScenic.parkingTotal * 100}%` }} /></i></div><div><small>监控在线</small><strong>{activeGovernmentScenic.cameras}<em> 路</em></strong><span>运行正常</span></div></div>
      <div className="gov-mini-monitor-grid">{activeGovernmentScenic.regions.map((region, index) => <button type="button" key={region} onClick={() => { const target = monitorPoints.find((point) => point.scenic === activeGovernmentScenic.name) || monitorPoints[index]; setSelectedMonitorId(target.id); setGovernmentSection("监控中心"); }}><span className={`gov-video gov-video--${["gate", "water", "square"][index]}`}><i className="scan-line" /><b>实时</b><em>{String(index + 1).padStart(2, "0")}</em></span><strong>{region}</strong><small>点击查看实时画面</small></button>)}</div>
    </section>
    <section className="gov-home-grid">
      <article className="gov-panel gov-warning-panel"><header><div><small>风险预警</small><h2>待处置预警</h2></div><button type="button" onClick={() => setGovernmentSection("监控中心")}>查看全部</button></header><div>{governmentWarnings.slice(0, 3).map((warning) => <button type="button" key={`${warning.type}-${warning.time}`} onClick={() => setGovernmentSection("监控中心")}><span className={`level-${warning.level}`}>{warning.level}</span><div><strong>{warning.type} · {warning.point}</strong><small>{warning.detail}</small></div><time>{warning.time}</time></button>)}</div></article>
      <section className="gov-panel gov-command-panel"><header><div><small>快捷办事</small><h2>常用政务操作</h2></div><span>今日值班：张主任</span></header><div>{[{ title: "值班调度", detail: "人员与巡查任务", icon: Radio, action: "dispatch" as const }, { title: "通知发布", detail: "镇村景区通知", icon: Megaphone, action: "notice" as const }, { title: "应急处置", detail: "启动联动预案", icon: Siren, action: "emergency" as const }, { title: "数据导出", detail: "导出统计报表", icon: Download, action: "export" as const }].map((item) => { const Icon = item.icon; return <button type="button" key={item.title} onClick={() => item.action === "export" ? exportGovernmentData() : setGovernmentModal(item.action)}><span><Icon /></span><strong>{item.title}</strong><small>{item.detail}</small></button>; })}</div></section>
    </section>
  </>;

  const renderGovernmentMonitor = () => {
    const filtered = monitorFilter === "全区点位" ? monitorPoints : monitorPoints.filter((point) => point.scenic === monitorFilter || point.area === monitorFilter);
    return <section className="gov-monitor-layout"><aside className="gov-panel gov-monitor-list"><header><div><small>DISTRIBUTION</small><h2>监控点位分布</h2></div><span>{filtered.length} 个点位</span></header><nav>{["全区点位", ...governmentScenics.map((item) => item.name), "顺安镇", "胥坝乡"].map((item) => <button type="button" key={item} className={monitorFilter === item ? "is-active" : ""} onClick={() => setMonitorFilter(item)}>{item}</button>)}</nav><div className="gov-monitor-map"><i className="road road-one" /><i className="road road-two" />{filtered.map((point, index) => <button type="button" key={point.id} className={`${selectedMonitorId === point.id ? "is-active" : ""} ${point.status === "维护" ? "is-offline" : ""}`} style={{ left: `${18 + index % 3 * 31}%`, top: `${21 + Math.floor(index / 3) * 45 + index % 2 * 7}%` }} onClick={() => setSelectedMonitorId(point.id)}><Camera /><small>{point.id}</small></button>)}</div><div className="gov-point-list">{filtered.map((point) => <button type="button" key={point.id} className={selectedMonitorId === point.id ? "is-active" : ""} onClick={() => setSelectedMonitorId(point.id)}><span className={point.status === "在线" ? "is-online" : ""} /><div><strong>{point.name}</strong><small>{point.id} · {point.area}</small></div><em>{point.status}</em></button>)}</div></aside><div className="gov-monitor-main"><article className="gov-panel gov-live-panel"><header><div><small>REAL-TIME VIDEO</small><h2>{activeMonitor.name}</h2></div><span><i /> {activeMonitor.status === "在线" ? "实时画面" : "设备维护中"}</span></header><div className={`gov-live-video gov-video--${activeMonitor.scene}`}><div className="video-hud"><span>{activeMonitor.id} / 1080P</span><time>{new Date().toLocaleDateString("zh-CN")} 10:48:32</time></div><i className="scan-line" /><div className="detection-box box-person"><span>人员 98%</span></div><div className="detection-box box-car"><span>车辆 96%</span></div><div className="video-crosshair" /><footer><span>AI识别：{activeMonitor.targets.join(" · ")}</span><strong>REC ●</strong></footer></div><div className="gov-monitor-actions"><button type="button" onClick={() => showGovernmentNotice("已抓拍当前画面并存入事件中心")}><Camera />手动抓拍</button><button type="button" onClick={() => setGovernmentModal("dispatch")}><Radio />调度人员</button><button type="button" onClick={() => setGovernmentModal("emergency")}><Siren />上报事件</button></div></article><article className="gov-panel gov-capture-panel"><header><div><small>SMART CAPTURE</small><h2>智能抓拍记录</h2></div><span>车 · 人 · 动物 · 行为</span></header><div>{governmentWarnings.map((warning, index) => <article key={`${warning.type}-${warning.time}`}><span className={`capture-thumb capture-${index}`}><AlertTriangle /></span><div><small>{warning.point} · {warning.time}</small><strong>{warning.type}</strong><p>{warning.detail}</p></div><button type="button" onClick={() => showGovernmentNotice("预警已确认并加入处置记录")}>确认</button></article>)}</div></article></div></section>;
  };

  const renderGovernmentTown = () => <section className="gov-town-layout"><nav className="gov-town-selector">{townStatistics.map((town) => <button type="button" key={town.name} className={selectedTown === town.name ? "is-active" : ""} onClick={() => setSelectedTown(town.name)}><strong>{town.name}</strong><small>{town.villages} 个行政村</small></button>)}</nav><section className="gov-town-kpis"><article><small>常住人口</small><strong>{activeTownStats.population.toLocaleString()}</strong><span>人</span></article><article><small>村级单元</small><strong>{activeTownStats.villages}</strong><span>个</span></article><article><small>人均可支配收入</small><strong>{activeTownStats.income.toLocaleString()}</strong><span>元 / 年</span></article><article><small>年度游客量</small><strong>{(activeTownStats.tourists / 10000).toFixed(1)}</strong><span>万人次</span></article></section><section className="gov-town-charts"><article className="gov-panel"><header><div><small>AGE STRUCTURE</small><h2>年龄结构</h2></div><span>{activeTownStats.name}</span></header><div className="gov-age-chart"><div className="age-ring" style={{ background: `conic-gradient(#25b7ff 0 ${activeTownStats.ages[0]}%, #3378ff ${activeTownStats.ages[0]}% ${activeTownStats.ages[0] + activeTownStats.ages[1]}%, #f6b84a ${activeTownStats.ages[0] + activeTownStats.ages[1]}% 100%)` }}><span><strong>{activeTownStats.population.toLocaleString()}</strong><small>总人口</small></span></div><ul><li><i className="age-young" /><span>0—17岁</span><strong>{activeTownStats.ages[0]}%</strong></li><li><i className="age-working" /><span>18—59岁</span><strong>{activeTownStats.ages[1]}%</strong></li><li><i className="age-old" /><span>60岁以上</span><strong>{activeTownStats.ages[2]}%</strong></li></ul></div></article><article className="gov-panel"><header><div><small>DATA TREND</small><h2>收入与游客趋势</h2></div><button type="button" onClick={exportGovernmentData}><Download />导出</button></header><div className="gov-bar-chart">{[72, 78, 83, 88, 94].map((height, index) => <div key={height}><span style={{ height: `${height}%` }} /><small>{2022 + index}</small></div>)}</div><div className="gov-chart-legend"><span><i />人均收入连续增长</span><strong>较2022年 +22.4%</strong></div></article></section><section className="gov-panel gov-village-ranking"><header><div><small>VILLAGE OVERVIEW</small><h2>重点村数据概览</h2></div><span>数据更新于 10:30</span></header><div className="gov-table"><div className="gov-table-row is-head"><span>村庄</span><span>人口</span><span>集体收入</span><span>游客量</span><span>治理指数</span></div>{["东垅村", "犁桥村", "凤凰村", "龙潭肖村"].map((name, index) => <div className="gov-table-row" key={name}><strong>{name}</strong><span>{(4820 - index * 570).toLocaleString()}人</span><span>{128 - index * 13}万元</span><span>{38.6 - index * 5.2}万人</span><span><i><b style={{ width: `${92 - index * 4}%` }} /></i>{92 - index * 4}</span></div>)}</div></section></section>;

  const renderGovernmentBusiness = () => <section className="gov-business-layout"><nav className="gov-business-tabs">{(["全部", "农产品审核", "农房需求", "民情诉求", "惠农补贴", "就业岗位", "村务内容", "议事投票", "课程培训", "游客内容"] as GovernmentBusiness[]).map((item) => <button type="button" key={item} className={governmentBusiness === item ? "is-active" : ""} onClick={() => setGovernmentBusiness(item)}>{item}<small>{item === "全部" ? governmentBusinesses.length : governmentBusinesses.filter((business) => business.type === item).length}</small></button>)}</nav><section className="gov-panel gov-business-panel"><header><div><small>SERVICE CENTER</small><h2>{governmentBusiness === "全部" ? "全量业务事项" : governmentBusiness}</h2></div><span>{visibleGovernmentBusinesses.filter((item) => item.status === "待审核").length} 项待审核</span></header><div className="gov-business-list">{visibleGovernmentBusinesses.length ? visibleGovernmentBusinesses.map((item) => <article key={item.id}>{item.images.length > 0 ? <div className="gov-business-images">{item.images.slice(0, 3).map((image, index) => <img src={image} alt={`${item.title}材料${index + 1}`} key={`${item.id}-${index}`} />)}</div> : <span className="gov-business-icon">{item.type.includes("农产品") ? <Store /> : item.type.includes("农房") ? <HomeIcon /> : item.type.includes("诉求") ? <Bell /> : item.type.includes("补贴") ? <ClipboardCheck /> : item.type.includes("岗位") ? <Briefcase /> : item.type.includes("投票") ? <Vote /> : item.type.includes("课程") ? <GraduationCap /> : <FileText />}</span>}<div className="gov-business-copy"><small>{item.id} · {item.type}</small><h3>{item.title}</h3><p>{item.detail}</p><span>{item.source} · {item.time}</span></div><div className="gov-business-status"><span className={`status-${item.status}`}>{item.status}</span>{item.status === "待审核" && <><button type="button" onClick={() => updateGovernmentBusiness(item.id, "已通过")}>通过</button><button type="button" className="is-reject" onClick={() => updateGovernmentBusiness(item.id, "已驳回")}>退回</button></>}{item.status === "办理中" && <button type="button" onClick={() => updateGovernmentBusiness(item.id, "已通过")}>办结</button>}</div></article>) : <div className="gov-empty"><CheckCircle2 /><strong>当前分类暂无待办</strong><p>新的用户端发布和业务申请会实时汇入此处。</p></div>}</div></section></section>;

  const renderGovernmentProfile = () => <section className="gov-profile-layout"><article className="gov-profile-card"><span><UserRound /></span><div><small>义安区政务协同平台</small><h2>张主任，上午好</h2><p>区文旅与乡村治理综合值班 · 今日值守至 18:00</p></div><button type="button" onClick={() => setIsRoleSelectorOpen(true)}>切换角色</button></article><section className="gov-profile-stats"><article><small>今日已办结</small><strong>18</strong></article><article><small>本周调度</small><strong>32</strong></article><article><small>发布通知</small><strong>6</strong></article><article><small>平均响应</small><strong>8.6<em>分钟</em></strong></article></section><section className="gov-panel gov-duty-card"><header><div><small>DUTY SCHEDULE</small><h2>今日值班与联络</h2></div><span>在线 6 人</span></header><div>{["综合值守 · 张主任", "文旅调度 · 李晨", "应急联络 · 王海", "镇村协同 · 陈敏"].map((name, index) => <article key={name}><span>{name.slice(-1)}</span><div><strong>{name}</strong><small>{index === 0 ? "总值班 · 138****6018" : `分机 80${index + 6} · 当前在线`}</small></div><i /></article>)}</div></section><section className="gov-panel gov-system-menu"><button type="button" onClick={() => setGovernmentModal("notice")}><Megaphone /><span><strong>通知发布记录</strong><small>查看已发布与定时通知</small></span><em>›</em></button><button type="button" onClick={() => setGovernmentSection("业务办理")}><ClipboardCheck /><span><strong>我的办理记录</strong><small>查看审核、退回与办结事项</small></span><em>›</em></button><button type="button" onClick={exportGovernmentData}><Database /><span><strong>数据导出中心</strong><small>生成景区、镇村与治理报表</small></span><em>›</em></button><button type="button" onClick={() => showGovernmentNotice("系统运行正常，数据同步完成")}><Activity /><span><strong>系统运行状态</strong><small>数据更新时间 10:48:32</small></span><em>正常</em></button></section></section>;

  const renderGovernmentView = () => <section className="government-view" onPointerDown={(event) => event.stopPropagation()}><header className="government-header"><div className="government-brand"><span><Database /></span><div><small>义安区数字政务</small><h1>义安智治</h1><p>文旅监测 · 镇村治理 · 协同办理</p></div></div><div className="government-header-status"><span><i />今日值班中</span><time>7月28日 周二</time><button type="button" aria-label="打开政务人员中心" onClick={() => setIsRoleSelectorOpen(true)}><UserRound /><b>张主任</b></button></div></header><main>{governmentSection === "政务首页" ? renderGovernmentHome() : governmentSection === "监控中心" ? renderGovernmentMonitor() : governmentSection === "镇村数据" ? renderGovernmentTown() : governmentSection === "业务办理" ? renderGovernmentBusiness() : renderGovernmentProfile()}</main></section>;

  return (
    <main className="panorama-shell">
      <div
          ref={stageRef}
        className="map-stage"
        aria-label="铜陵市乡村旅游全景地图"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onWheel={handleWheel}
      >
        <img
          ref={mapRef}
          className={`map-image ${isReady ? "is-ready" : ""}`}
          src={isHighResolution ? highResolutionMapSrc : previewMapSrc}
          alt="铜陵市乡村旅游景区导览地图"
          draggable={false}
          decoding="async"
          onLoad={() => setIsReady(true)}
        />
        {activeSection === "我的" && userRole !== "政务" && (
          <section className="profile-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="profile-hero">
              <div className="profile-hero__icon"><UserRound aria-hidden="true" /></div>
              <div><span>MY YI'AN</span><h1>我的义安</h1><p>当前角色：{userRole}端</p></div>
              <button className="role-change-button" type="button" onClick={() => setIsRoleSelectorOpen(true)}>切换角色</button>
            </header>
            {userRole === "村民" ? <>
              <section className="villager-profile-card"><div className="villager-profile-card__avatar">村</div><div><small>已认证村民 · 顺安镇</small><h2>王师傅，欢迎回家</h2><p>共建等级：银杏村民 3级</p></div></section>
              <section className="villager-profile-stats"><div><strong>1,280</strong><small>可用积分</small></div><div><strong>8</strong><small>参与村务</small></div><button type="button" onClick={() => openVillagerDetail("publications", "我的发布")}><strong>{villagerPublications.length}</strong><small>我的发布</small></button><div><strong>2</strong><small>办理中</small></div></section>
              <section className="villager-profile-section"><header><small>我的事项</small><h3>办理进度</h3></header><div className="villager-record-list"><article><span className="is-review">审核中</span><div><h4>自家富硒大米上架申请</h4><p>我的货摊 · 2026-07-26提交</p></div><button type="button" onClick={() => openVillagerDetail("record", "自家富硒大米上架申请")}>查看</button></article><article><span className="is-progress">处理中</span><div><h4>村东路口增设反光标识建议</h4><p>民情诉求 · 预计08月02日前反馈</p></div><button type="button" onClick={() => openVillagerDetail("record", "村东路口增设反光标识建议")}>查看</button></article><article><span className="is-done">已通过</span><div><h4>农村电商创业扶持补贴</h4><p>补贴申领 · 等待资金拨付</p></div><button type="button" onClick={() => openVillagerDetail("record", "农村电商创业扶持补贴")}>查看</button></article></div></section>
              <section className="villager-profile-section"><header><small>积分足迹</small><h3>最近获得</h3></header><div className="villager-points-history"><div><span>参与闲置地改造投票</span><strong>+30</strong><small>07月25日</small></div><div><span>完成电商基础课程</span><strong>+50</strong><small>07月20日</small></div><div><span>民情建议被采纳</span><strong>+100</strong><small>07月16日</small></div></div></section>
              <section className="villager-profile-menu"><button type="button" onClick={() => openVillagerDetail("identity", "村民认证信息")}>村民认证信息<span>已认证 ›</span></button><button type="button" onClick={() => openVillagerDetail("address", "收货地址")}>收货地址<span>2个地址 ›</span></button><button type="button" onClick={() => openVillagerDetail("messages", "消息通知")}>消息通知<span>3条未读 ›</span></button><button type="button" onClick={() => openVillagerDetail("feedback", "帮助与反馈")}>帮助与反馈<span>›</span></button></section>
            </> : <>
              <article className="role-summary">
                <small>{userRole === "游客" ? "游客服务" : "政务服务"}</small>
                <h2>{userRole === "游客" ? "游客，欢迎来到义安" : "政务端 · 乡村治理服务"}</h2>
                <p>{userRole === "游客" ? "收藏心仪地点、查看好物订单，记录每一次义安旅程。" : "管理村务信息、审核村民发布内容，响应民情诉求与公共事务。"}</p>
              </article>
              <div className="profile-action-grid">
                {(userRole === "游客" ? [
                  { title: "我的收藏", detail: "保存心仪地点", icon: Heart },
                  { title: "购买订单", detail: "查看好物订单", icon: ShoppingBag },
                  { title: "游览足迹", detail: "记录义安旅程", icon: Compass },
                ] : [
                  { title: "待办事项", detail: "处理村务申请", icon: UserRound },
                  { title: "内容审核", detail: "审核村民发布", icon: Store },
                  { title: "数据概览", detail: "查看治理数据", icon: MapIcon },
                ]).map((action) => {
                  const Icon = action.icon;
                  return <button type="button" key={action.title}><span><Icon aria-hidden="true" /></span><strong>{action.title}</strong><small>{action.detail}</small></button>;
                })}
              </div>
              <section className="profile-service-card"><div><small>账户服务</small><h3>{userRole === "游客" ? "登录后同步个人数据" : "完成政务人员认证"}</h3><p>{userRole === "游客" ? "收藏、订单和足迹将在登录后跨设备同步。" : "认证后可进入政务工作台处理审核和治理事项。"}</p></div><a href={MEITUAN_MINI_PROGRAM}>{userRole === "游客" ? "微信授权登录" : "前往政务认证"}</a></section>
            </>}
          </section>
        )}

        {isReady && activeSection === "智慧导览" && (
          <div
            ref={overlayRef}
            className="hotspot-layer"
            style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
          >
            {scenicSpots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                className={`scenic-hotspot scenic-hotspot--${spot.id}`}
                style={{
                  left: `${spot.x * 100}%`,
                  top: `${spot.y * 100}%`,
                  width: spot.width,
                  height: spot.height,
                }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => openSpot(spot)}
                aria-label={`查看${spot.name}`}
              />
            ))}
            <button
              type="button"
              className="scenic-hotspot scenic-hotspot--shunan town-hotspot"
              style={{
                left: `${shunanTown.x * 100}%`,
                top: `${shunanTown.y * 100}%`,
                width: shunanTown.width,
                height: shunanTown.height,
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={openTown}
              aria-label="查看顺安镇吃住游购"
            />
          </div>
        )}
        {!isReady && (
          <div className="map-loading" role="status" aria-live="polite">
            <span />
            <p>地图加载中</p>
          </div>
        )}
        <div className="vignette" aria-hidden="true" />
        <div className="film-grain" aria-hidden="true" />

        {userRole === "政务" && renderGovernmentView()}

        {userRole === "村民" && activeSection !== "我的" && (
          <section className="villager-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="villager-hero">
              <div><span>BEAUTIFUL VILLAGE</span><h1>{villagerSection === "村民首页" ? "村民服务中心" : villagerSection}</h1><p>{villagerSection === "村民首页" ? "村务共商、积分共享、资源共建，让每一位村民都成为家乡发展的参与者。" : "汇集与当前栏目相关的村民服务，点击功能进入办理。"}</p></div>
            </header>
            {villagerSection === "村民首页" ? <>
              <section className="village-action-section">
                <header><div><small>一起建设家乡</small><h2>本周共建任务</h2></div><button type="button" onClick={() => { setVillagerSection("积分服务"); setActiveSection("积分服务"); }}>全部任务</button></header>
                <div className="village-task-list">
                  <article><span><UserRound /></span><div><small>议事投票 · 还剩2天</small><h3>村口闲置地改造方案，由你决定</h3><p>已有 186 位村民参与讨论</p></div><button type="button" onClick={() => openVillagerDetail("vote", "村口闲置地改造方案票选")}>去投票 <em>+30</em></button></article>
                  <article><span><Play /></span><div><small>线上课程 · 随时观看</small><h3>短视频助农直播实操课</h3><p>手机即可在线观看学习</p></div><button type="button" onClick={() => openVillagerDetail("course", "短视频助农直播实操课")}>在线观看 <em>+50</em></button></article>
                </div>
              </section>

              <section className="village-community-section">
                <header><div><small>家乡正在发生</small><h2>乡亲动态</h2></div><span>共建有回应</span></header>
                <article className="village-story-card"><div className="village-story-card__badge"><Heart /></div><div><small>民情诉求 · 已解决</small><h3>张大姐提出的夜间照明建议已完成</h3><p>新增太阳能路灯 6 盏，照亮村民回家路。该建议获得 100 共建积分。</p><footer><span>{likedVillageStory ? "29" : "28"} 位乡亲点赞</span><div><button type="button" onClick={() => openVillagerDetail("story", "夜间照明建议办理结果", "张大姐提出村东道路夜间照明不足后，村委会完成现场勘查、方案公示和施工安装，共新增太阳能路灯6盏。")}>查看详情</button><button type="button" className={likedVillageStory ? "is-liked" : ""} onClick={() => setLikedVillageStory((liked) => !liked)}>{likedVillageStory ? "已点赞" : "点赞"}</button></div></footer></div></article>
              </section>

              <section className="village-quick-section">
                <header><div><small>常用服务</small><h2>我也要参与</h2></div></header>
                <div className="village-quick-grid">
                  {[
                    { title: "我要建议", detail: "村里事，一起商量", icon: UserRound, section: "我要发布" as VillagerSection },
                    { title: "分享好物", detail: "让家乡特产被看见", icon: Store, section: "我要发布" as VillagerSection },
                    { title: "积分兑换", detail: "参与越多，收获越多", icon: ShoppingBag, section: "积分服务" as VillagerSection },
                    { title: "惠农服务", detail: "政策岗位及时掌握", icon: HomeIcon, section: "村务服务" as VillagerSection },
                  ].map((item) => { const Icon = item.icon; return <button type="button" key={item.title} onClick={() => { setVillagerSection(item.section); setActiveVillagerService(item.title === "我要建议" ? "民情诉求" : item.title === "分享好物" ? "我的货摊" : item.title === "积分兑换" ? "积分超市" : "补贴申领"); setActiveSection(item.section); }}><span><Icon /></span><strong>{item.title}</strong><small>{item.detail}</small></button>; })}
                </div>
              </section>

              <section className="villager-notice"><span>村务速递</span><strong>顺安镇本月村务公开信息已更新</strong><button type="button" onClick={() => openVillagerDetail("article", "顺安镇本月村务公开信息", "本月村务公开包含村级财务收支、公益项目进展、惠农政策落实和村民议事结果等内容。")}>查看详情</button></section>
            </> : <>
              <section className="villager-category-intro"><small>{villagerSection === "村务服务" ? "信息公开 · 惠农服务" : villagerSection === "积分服务" ? "参与有分 · 成长有礼" : "我的资源 · 我来建设"}</small><h2>{villagerSection}</h2><p>{villagerSection === "村务服务" ? "村务信息看得见，惠农政策找得到，就业服务送到家。" : villagerSection === "积分服务" ? "参与议事、学习培训、共建家乡，点滴行动都能积累成长。" : "发布好物、盘活农房、反映诉求，让每份家乡资源都产生价值。"}</p></section>
              <nav className="villager-service-tabs" aria-label={`${villagerSection}功能`}>
                {villagerServices.filter((service) => service.group === villagerSection).map((service) => { const Icon = service.icon; return <button type="button" key={service.name} className={activeVillagerService === service.name ? "is-active" : ""} onClick={() => setActiveVillagerService(service.name)}><Icon /><span>{service.name}</span></button>; })}
              </nav>
              <section className="villager-service-content">{renderVillagerService()}</section>
            </>}
          </section>
        )}

        {activeSection === "魅力义安" && userRole === "游客" && (
          <section className="charm-view" onPointerDown={(event) => event.stopPropagation()}>
            <div className="charm-view__wash" aria-hidden="true" />
            <header className="charm-hero">
              <span>CHARMING YI'AN</span>
              <h1>一镇一韵，遇见义安</h1>
              <p>从长江洲岛到山谷园林，从千年古镇到水乡田园，选择一座乡镇，开启属于它的地方故事。</p>
            </header>
            <div className="charm-grid">
              {charmTowns.map((town, index) => (
                <button type="button" className="charm-card" key={town.id} onClick={() => { setSelectedCharmTown(town); setActiveCharmCategory("美食"); }} style={{ animationDelay: `${index * 55}ms` }}>
                  <img src={imageUrl(town.scene)} alt={`${town.name}风光`} loading={index > 2 ? "lazy" : "eager"} decoding="async" />
                  <span className="charm-card__shade" />
                  <span className="charm-card__copy"><small>{town.subtitle}</small><strong>{town.name}</strong><em>走进乡镇</em></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeSection === "商旅食宿" && userRole === "游客" && (
          <section className="catalog-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="catalog-hero">
              <span>TRAVEL & STAY</span>
              <h1>商旅食宿，一站尽览</h1>
              <p>汇集义安代表性景区、地方餐饮、品质住宿与购物点位，点击导航即可前往。</p>
            </header>
            <nav className="catalog-tabs" aria-label="商旅食宿分类">
              {travelCategories.map((category) => <button type="button" key={category} className={activeTravelCategory === category ? "is-active" : ""} onClick={() => setActiveTravelCategory(category)}><strong>{category}</strong><small>{travelCatalog[category].length}处</small></button>)}
            </nav>
            <div className="catalog-grid">
              {travelCatalog[activeTravelCategory].map((item, index) => (
                <article className="catalog-card" key={item.name}>
                  <img src={imageUrl(catalogScene(activeTravelCategory, item.name))} alt={item.name} loading={index > 3 ? "lazy" : "eager"} decoding="async" />
                  <div><span>{item.area} · {activeTravelCategory}</span><h2>{item.name}</h2><p>{item.detail}</p><a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(`铜陵义安区${item.name}`)}&callnative=1`} target="_blank" rel="noreferrer">地图导航</a></div>
                </article>
              ))}
            </div>
            <small className="catalog-note">营业时间、开放信息和服务内容可能调整，出行前请通过官方渠道或地图平台确认。</small>
          </section>
        )}

        {activeSection === "义安好物" && userRole === "游客" && (
          <section className="goods-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="goods-hero"><span>GIFTS FROM YI'AN</span><h1>义安好物</h1><p>把白姜的清脆、酥糖的香甜、凤丹的芬芳与千年铜韵带回家。</p></header>
            <div className="goods-grid">
              {yianGoods.map((item, index) => (
                <article className="goods-card" key={item.name} onClick={() => setSelectedGood(item)}>
                  <div className="goods-card__image"><img src={imageUrl(`${item.scene}, realistic, natural light, no text, no watermark`)} alt={item.name} loading={index > 3 ? "lazy" : "eager"} decoding="async" /></div>
                  <div className="goods-card__body"><small>{item.type}</small><h2>{item.name}</h2><p>{item.detail}</p><button type="button" onClick={(event) => { event.stopPropagation(); setSelectedGood(item); }}>去购买</button></div>
                </article>
              ))}
            </div>
            <small className="catalog-note">产品图片为主题视觉展示，实际包装、规格和售价以正规销售渠道为准。</small>
          </section>
        )}

        {isReady && (
          <nav className="map-menu" aria-label={userRole === "游客" ? "义安旅游服务" : "义安村民服务"} onPointerDown={(event) => event.stopPropagation()}>
            {userRole === "游客" ? <>
              <button type="button" className={activeSection === "智慧导览" ? "is-active" : ""} onClick={() => setActiveSection("智慧导览")}><MapIcon aria-hidden="true" /><span>导览</span></button>
              <button type="button" className={activeSection === "魅力义安" ? "is-active" : ""} onClick={() => setActiveSection("魅力义安")}><Compass aria-hidden="true" /><span>魅力义安</span></button>
              <button type="button" className={activeSection === "商旅食宿" ? "is-active" : ""} onClick={() => setActiveSection("商旅食宿")}><Store aria-hidden="true" /><span>商旅食宿</span></button>
              <button type="button" className={activeSection === "义安好物" ? "is-active" : ""} onClick={() => setActiveSection("义安好物")}><ShoppingBag aria-hidden="true" /><span>义安好物</span></button>
              <button type="button" className={activeSection === "我的" ? "is-active" : ""} onClick={() => setActiveSection("我的")}><UserRound aria-hidden="true" /><span>我的</span></button>
            </> : userRole === "村民" ? <>
              <button type="button" className={villagerSection === "村民首页" && activeSection !== "我的" ? "is-active" : ""} onClick={() => { setVillagerSection("村民首页"); setActiveSection("村民首页"); }}><HomeIcon aria-hidden="true" /><span>首页</span></button>
              <button type="button" className={villagerSection === "村务服务" && activeSection !== "我的" ? "is-active" : ""} onClick={() => { setVillagerSection("村务服务"); setActiveVillagerService("村务公开"); setActiveSection("村务服务"); }}><MapIcon aria-hidden="true" /><span>村务服务</span></button>
              <button type="button" className={villagerSection === "积分服务" && activeSection !== "我的" ? "is-active" : ""} onClick={() => { setVillagerSection("积分服务"); setActiveVillagerService("积分超市"); setActiveSection("积分服务"); }}><Heart aria-hidden="true" /><span>积分服务</span></button>
              <button type="button" className={villagerSection === "我要发布" && activeSection !== "我的" ? "is-active" : ""} onClick={() => { setVillagerSection("我要发布"); setActiveVillagerService("我的货摊"); setActiveSection("我要发布"); }}><Store aria-hidden="true" /><span>我要发布</span></button>
              <button type="button" className={activeSection === "我的" ? "is-active" : ""} onClick={() => setActiveSection("我的")}><UserRound aria-hidden="true" /><span>我的</span></button>
            </> : <>
              <button type="button" className={governmentSection === "政务首页" ? "is-active" : ""} onClick={() => setGovernmentSection("政务首页")}><HomeIcon aria-hidden="true" /><span>政务首页</span></button>
              <button type="button" className={governmentSection === "监控中心" ? "is-active" : ""} onClick={() => setGovernmentSection("监控中心")}><Camera aria-hidden="true" /><span>监控中心</span></button>
              <button type="button" className={governmentSection === "镇村数据" ? "is-active" : ""} onClick={() => setGovernmentSection("镇村数据")}><Database aria-hidden="true" /><span>镇村数据</span></button>
              <button type="button" className={governmentSection === "业务办理" ? "is-active" : ""} onClick={() => setGovernmentSection("业务办理")}><ClipboardCheck aria-hidden="true" /><span>业务办理</span></button>
              <button type="button" className={governmentSection === "我的" ? "is-active" : ""} onClick={() => setGovernmentSection("我的")}><UserRound aria-hidden="true" /><span>我的</span></button>
            </>}
          </nav>
        )}

        {governmentModal && (
          <div className="gov-modal-backdrop" onPointerDown={(event) => event.stopPropagation()} onClick={() => setGovernmentModal(null)}>
            <section className="gov-action-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <header><div><small>政务协同操作</small><h2>{governmentModal === "dispatch" ? "值班调度" : governmentModal === "notice" ? "通知发布" : "应急处置"}</h2></div><button type="button" onClick={() => setGovernmentModal(null)}>×</button></header>
              <form onSubmit={(event) => { event.preventDefault(); showGovernmentNotice(governmentModal === "dispatch" ? "调度任务已下发，相关人员已收到提醒" : governmentModal === "notice" ? "通知发布成功，送达情况可在记录中查看" : "应急事件已建档并启动联动处置"); setGovernmentModal(null); }}>
                <label>{governmentModal === "notice" ? "通知范围" : "任务区域"}<select><option>全区镇村与景区</option><option>顺安镇</option><option>西联镇</option><option>钟鸣镇</option><option>相关景区</option></select></label>
                {governmentModal === "dispatch" && <label>调度力量<select><option>综合巡查组</option><option>景区安保组</option><option>应急救援组</option><option>镇村联络员</option></select></label>}
                {governmentModal === "emergency" && <label>事件等级<select><option>一般事件（Ⅳ级）</option><option>较大事件（Ⅲ级）</option><option>重大事件（Ⅱ级）</option></select></label>}
                <label>{governmentModal === "notice" ? "通知标题" : "事项标题"}<input required placeholder="请输入标题" /></label>
                <label>{governmentModal === "notice" ? "通知内容" : "任务说明"}<textarea required placeholder="请填写详细内容、位置与处置要求" /></label>
                <button type="submit"><Send />确认{governmentModal === "notice" ? "发布" : governmentModal === "dispatch" ? "下发" : "启动处置"}</button>
              </form>
            </section>
          </div>
        )}

        {governmentNotice && <div className="government-toast" role="status">{governmentNotice}</div>}

        {villagerDetail && (
          <section className="villager-detail-page" onPointerDown={(event) => event.stopPropagation()}>
            <header className="villager-detail-page__header"><button type="button" onClick={() => setVillagerDetail(null)}>‹ 返回</button><span>义安村民服务</span></header>
            <div className="villager-detail-page__body">{renderVillagerDetail()}</div>
          </section>
        )}

        {villagerNotice && <div className="villager-toast" role="status">{villagerNotice}</div>}

        {isRoleSelectorOpen && (
          <div className="role-selector-backdrop" role="presentation" onClick={() => setIsRoleSelectorOpen(false)} onPointerDown={(event) => event.stopPropagation()}>
            <section className="role-selector-modal" role="dialog" aria-modal="true" aria-labelledby="role-selector-title" onClick={(event) => event.stopPropagation()}>
              <header><div><small>角色切换</small><h2 id="role-selector-title">请选择服务端</h2><p>切换后将刷新首页内容与底部导航。</p></div><button type="button" onClick={() => setIsRoleSelectorOpen(false)} aria-label="关闭角色选择">×</button></header>
              <div className="role-selector-list">
                {([
                  { role: "游客" as UserRole, title: "游客端", detail: "智慧导览、魅力义安、商旅食宿与义安好物", icon: Compass },
                  { role: "村民" as UserRole, title: "村民端", detail: "村务服务、积分服务、资源发布与惠农服务", icon: HomeIcon },
                  { role: "政务" as UserRole, title: "政务端", detail: "村务管理、内容审核、民情处理与运营数据", icon: UserRound },
                ]).map((item) => {
                  const Icon = item.icon;
                  return <button type="button" key={item.role} className={userRole === item.role ? "is-current" : ""} onClick={() => {
                    setUserRole(item.role);
                    setIsRoleSelectorOpen(false);
                    if (item.role === "游客") setActiveSection("智慧导览");
                    if (item.role === "村民") { setVillagerSection("村民首页"); setActiveSection("村民首页"); }
                    if (item.role === "政务") { setGovernmentSection("政务首页"); setActiveSection("智慧导览"); }
                  }}><span><Icon aria-hidden="true" /></span><div><strong>{item.title}</strong><small>{item.detail}</small></div>{userRole === item.role && <em>当前</em>}</button>;
                })}
              </div>
            </section>
          </div>
        )}

        {selectedGood && (
          <div className="spot-modal-backdrop goods-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelectedGood(null)}>
            <section className="goods-detail-modal" role="dialog" aria-modal="true" aria-labelledby="goods-detail-title" onClick={(event) => event.stopPropagation()}>
              <button className="goods-detail-modal__close" type="button" onClick={() => setSelectedGood(null)} aria-label="关闭好物详情">×</button>
              <img src={imageUrl(`${selectedGood.scene}, realistic, natural light, no text, no watermark`)} alt={selectedGood.name} />
              <div className="goods-detail-modal__body">
                <small>{selectedGood.type} · 义安甄选</small>
                <h2 id="goods-detail-title">{selectedGood.name}</h2>
                <p>{selectedGood.detail}</p>
                <dl><div><dt>可选规格</dt><dd>{selectedGood.specification}</dd></div><div><dt>购买说明</dt><dd>{selectedGood.service}</dd></div></dl>
                <div className="goods-detail-modal__actions"><button type="button"><Heart aria-hidden="true" />收藏好物</button><a href={MEITUAN_MINI_PROGRAM}><ShoppingBag aria-hidden="true" />立即购买</a></div>
                <small className="detail-disclaimer">点击“立即购买”将跳转第三方平台，实际商品、价格及售后服务以购买页面为准。</small>
              </div>
            </section>
          </div>
        )}

        {selectedCharmTown && (
          <div className="spot-modal-backdrop charm-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelectedCharmTown(null)}>
            <section className="spot-modal charm-modal" role="dialog" aria-modal="true" aria-labelledby="charm-town-title" onClick={(event) => event.stopPropagation()}>
              <div className="charm-modal__image">
                <img src={imageUrl(selectedCharmTown.scene)} alt={`${selectedCharmTown.name}风光`} />
                <span />
                <a className="charm-modal__navigate" href={`https://uri.amap.com/search?keyword=${encodeURIComponent(`安徽铜陵义安区${selectedCharmTown.name}`)}&callnative=1`} target="_blank" rel="noreferrer" aria-label={`导航到${selectedCharmTown.name}`}><Compass aria-hidden="true" />导航</a>
                <button type="button" onClick={() => setSelectedCharmTown(null)} aria-label="关闭乡镇介绍">×</button>
                <div><small>{selectedCharmTown.subtitle}</small><h2 id="charm-town-title">{selectedCharmTown.name}</h2></div>
              </div>
              <div className="charm-modal__body">
                <span className="charm-modal__eyebrow">魅力义安 · 乡镇印象</span>
                <p>{selectedCharmTown.intro}</p>
                <div className="charm-highlights">{selectedCharmTown.highlights.map((item) => <span key={item}>{item}</span>)}</div>
                <nav className="charm-guide-tabs" aria-label={`${selectedCharmTown.name}吃住游购`}>
                  {charmGuideCategories.map((category) => (
                    <button type="button" key={category} className={activeCharmCategory === category ? "is-active" : ""} onClick={() => setActiveCharmCategory(category)}>{category}</button>
                  ))}
                </nav>
                <div className="charm-guide-list">
                  {charmTownGuides[selectedCharmTown.id][activeCharmCategory].map((item, index) => (
                    <article key={item} className="charm-guide-card">
                      <img src={imageUrl(guideScene(selectedCharmTown, activeCharmCategory, item))} alt={`${selectedCharmTown.name}${item}`} loading="lazy" decoding="async" />
                      <div>
                        <span>{activeCharmCategory}</span>
                        <strong>{item}</strong>
                        <p>{charmGuideDetails[activeCharmCategory][index]}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <small className="detail-disclaimer">图像为乡镇主题视觉展示，具体景观和开放信息以当地实际情况为准。</small>
              </div>
            </section>
          </div>
        )}

        {isTownOpen && (
          <div className="spot-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setIsTownOpen(false)}>
            <section className="spot-modal town-modal" role="dialog" aria-modal="true" aria-labelledby="town-title" onClick={(event) => event.stopPropagation()}>
              <header>
                <div className="spot-heading">
                  <span>顺安镇 · 在地生活指南</span>
                  <div className="title-row">
                    <h2 id="town-title">吃住游购，一镇慢享</h2>
                    <div className="title-actions">
                      <a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(shunanTown.mapKeyword)}&callnative=1`} target="_blank" rel="noreferrer" aria-label="导航到顺安镇">导航</a>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => setIsTownOpen(false)} aria-label="关闭顺安镇详情">×</button>
              </header>
              <div className="spot-modal__image town-modal__image">
                <img src={imageUrl(shunanTown.scene)} alt="顺安镇古镇风光" decoding="async" />
              </div>
              <nav className="detail-tabs town-tabs" aria-label="顺安镇生活栏目">
                {(Object.keys(shunanTown.categories) as TownCategory[]).map((category) => (
                  <button key={category} type="button" className={activeTownCategory === category ? "is-active" : ""} onClick={() => setActiveTownCategory(category)}>{category}</button>
                ))}
              </nav>
              <div className="spot-detail town-detail">
                <div className="town-intro">
                  <strong>{activeTownCategory === "美食" ? "从老街早餐开始，尝一口顺安烟火" : activeTownCategory === "游玩" ? "古镇、铜矿与山水，一天串联顺安故事" : activeTownCategory === "住宿" ? "按行程选择镇区便利或山野度假" : "把酥糖、白姜和铜都记忆带回家"}</strong>
                  <span>内容为旅行推荐，具体营业、开放和价格信息以商户及景区实时公示为准。</span>
                </div>
                <div className="town-card-grid">
                  {shunanTown.categories[activeTownCategory].map((item) => (
                    <article className="town-card" key={item.name}>
                      <div>
                        <small>{item.meta}</small>
                        <h3>{item.name}</h3>
                        <p>{item.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {selectedSpot && (
          <div className="spot-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelectedSpot(null)}>
            <section className="spot-modal" role="dialog" aria-modal="true" aria-labelledby="spot-title" onClick={(event) => event.stopPropagation()}>
              <header>
                <div className="spot-heading">
                  <span>义安智慧导览</span>
                  <div className="title-row">
                    <h2 id="spot-title">{selectedSpot.name}</h2>
                    <div className="title-actions">
                      <a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(selectedSpot.mapKeyword)}&callnative=1`} target="_blank" rel="noreferrer" aria-label={`导航到${selectedSpot.name}`}>导航</a>
                      <a href={MEITUAN_MINI_PROGRAM} aria-label={`购买${selectedSpot.name}门票`}>购票</a>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedSpot(null)} aria-label="关闭景区详情">×</button>
              </header>
              <div className="spot-modal__image">
                <img src={imageUrl(selectedSpot.scene)} alt={`${selectedSpot.name}景区风光`} decoding="async" />
              </div>
              <nav className="detail-tabs" aria-label="景区详情栏目">
                {detailTabs.map((tab) => (
                  <button key={tab} type="button" className={activeTab === tab ? "is-active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
              </nav>
              <div className="spot-detail">{renderDetail()}</div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
