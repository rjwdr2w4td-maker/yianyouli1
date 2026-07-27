import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, Heart, Home as HomeIcon, Map as MapIcon, ShoppingBag, Store, UserRound } from "lucide-react";

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
type MainSection = "智慧导览" | "魅力义安" | "商旅食宿" | "义安好物";
const imageUrl = (prompt: string) => `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`;

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
        {isReady && (
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

        {activeSection === "魅力义安" && (
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

        {activeSection === "商旅食宿" && (
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

        {activeSection === "义安好物" && (
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
          <nav className="map-menu" aria-label="义安旅游服务" onPointerDown={(event) => event.stopPropagation()}>
            <button type="button" className={activeSection === "智慧导览" ? "is-active" : ""} onClick={() => setActiveSection("智慧导览")}><MapIcon aria-hidden="true" /><span>导览</span></button>
            <button type="button" className={activeSection === "魅力义安" ? "is-active" : ""} onClick={() => setActiveSection("魅力义安")}><Compass aria-hidden="true" /><span>魅力义安</span></button>
            <button type="button" className={activeSection === "商旅食宿" ? "is-active" : ""} onClick={() => setActiveSection("商旅食宿")}><Store aria-hidden="true" /><span>商旅食宿</span></button>
            <button type="button" className={activeSection === "义安好物" ? "is-active" : ""} onClick={() => setActiveSection("义安好物")}><ShoppingBag aria-hidden="true" /><span>义安好物</span></button>
            <button type="button" className={isProfileOpen ? "is-active" : ""} onClick={() => setIsProfileOpen(true)}><UserRound aria-hidden="true" /><span>我的</span></button>
          </nav>
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

        {isProfileOpen && (
          <div className="spot-modal-backdrop profile-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setIsProfileOpen(false)}>
            <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(event) => event.stopPropagation()}>
              <button className="profile-modal__close" type="button" onClick={() => setIsProfileOpen(false)} aria-label="关闭个人中心">×</button>
              <header><span><UserRound aria-hidden="true" /></span><div><small>个人中心</small><h2 id="profile-title">游客，欢迎来到义安</h2><p>登录后可同步收藏、订单与游览足迹</p></div></header>
              <div className="profile-stats"><button type="button"><Heart /><strong>我的收藏</strong><small>保存心仪地点</small></button><button type="button"><ShoppingBag /><strong>购买订单</strong><small>查看好物订单</small></button><button type="button"><HomeIcon /><strong>游览足迹</strong><small>记录义安旅程</small></button></div>
              <a className="profile-login" href={MEITUAN_MINI_PROGRAM}>微信授权登录</a>
              <small className="detail-disclaimer">当前为导览展示入口，账户及订单数据将在接入正式用户服务后同步。</small>
            </section>
          </div>
        )}

        {selectedCharmTown && (
          <div className="spot-modal-backdrop charm-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelectedCharmTown(null)}>
            <section className="spot-modal charm-modal" role="dialog" aria-modal="true" aria-labelledby="charm-town-title" onClick={(event) => event.stopPropagation()}>
              <div className="charm-modal__image">
                <img src={imageUrl(selectedCharmTown.scene)} alt={`${selectedCharmTown.name}风光`} />
                <span />
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
                <a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(`安徽铜陵义安区${selectedCharmTown.name}`)}&callnative=1`} target="_blank" rel="noreferrer">在地图中查看 {selectedCharmTown.name}</a>
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
