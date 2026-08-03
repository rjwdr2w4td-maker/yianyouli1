import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  Activity, AlertTriangle, Bell, Briefcase, Camera, Car, CheckCircle2, ChevronLeft, ClipboardCheck,
  Compass, Database, Download, FileText, GraduationCap, Heart, Home as HomeIcon,
  Map as MapIcon, Megaphone, Phone, Play, Radio, Search, Send, ShieldAlert, ShoppingBag, Siren, Store,
  UserRound, Users, Vote, X,
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
    vrUrl: "https://eeez047k2ro.720yun.com/vr/7e2jerkvsv3",
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
    vrUrl: "https://eeez047k2ro.720yun.com/vr/167jerhmta3",
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
    vrUrl: "https://eeez047k2ro.720yun.com/vr/0abjtOwu5v8",
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

type ScenicSpot = (typeof scenicSpots)[number];
type DetailTab = "介绍" | "攻略" | "路线" | "服务" | "打卡" | "周边" | "交通" | "节目单";
const detailTabs: DetailTab[] = ["介绍", "攻略", "路线", "服务", "打卡", "周边", "交通", "节目单"];
const MEITUAN_MINI_PROGRAM = "weixin://dl/business/?t=IYgDT21eme4SAJA";

type TownGuideCategory = "美食" | "游玩" | "住宿" | "特产" | "文化活动";
type TownDetailTab = "镇情概览" | TownGuideCategory | "下属村庄";
type TownGuideItem = { name: string; detail: string };
type TownVillage = { name: string; intro: string; resource: string; representative: string; mapKeyword: string };
type TownDetail = {
  id: string;
  name: string;
  subtitle: string;
  intro: string;
  highlights: string[];
  scene: string;
  mapKeyword: string;
  representativeAttractions: string[];
  industries: string[];
  bestSeason: string;
  duration: string;
  guides: Record<TownGuideCategory, TownGuideItem[]>;
  villages: TownVillage[];
  mapHotspot?: { x: number; y: number; width: number; height: number };
};

const townDetailTabs: TownDetailTab[] = ["镇情概览", "美食", "游玩", "住宿", "特产", "文化活动", "下属村庄"];
const townItem = (name: string, detail: string): TownGuideItem => ({ name, detail });
const village = (townName: string, name: string, intro: string, resource: string, representative: string): TownVillage => ({ name, intro, resource, representative, mapKeyword: `安徽铜陵义安区${townName}${name}` });

const townDetails: TownDetail[] = [
  {
    id: "wusong", name: "五松镇", subtitle: "滨江城韵 · 宜居五松", intro: "五松镇承载着义安城区的生活记忆，城市服务、滨水空间与老城烟火在这里交融。适合沿滨河公园散步，在街巷中感受义安城区从容而便利的日常。", highlights: ["滨河休闲", "城区烟火", "便捷生活"], scene: "aerial view of a refined riverside Chinese town, green waterfront park, modern low rise neighborhoods, morning mist, Anhui travel photography, realistic, no text", mapKeyword: "安徽铜陵义安区五松镇", representativeAttractions: ["义安滨河公园", "笠帽山周边", "城区文化街巷"], industries: ["现代商贸服务", "城市文旅", "特色餐饮"], bestSeason: "四季皆宜，春秋滨江漫步更舒适", duration: "建议半日，可与义安城区行程组合",
    guides: {
      美食: [townItem("城区徽菜与铜陵土菜", "在城区餐馆品尝河鲜、土鸡和时令家常菜，感受义安日常餐桌。"), townItem("白姜炒肉与地方小吃", "铜陵白姜入菜清香爽脆，可搭配街巷早点和传统糕点体验。")],
      游玩: [townItem("义安滨河公园慢行", "沿滨水绿道散步、骑行或看夕阳，适合亲子与城市休闲。"), townItem("城区街巷与笠帽山周边", "串联生活街区、公共文化空间与城市山景，感受新老城区交融。")],
      住宿: [townItem("城区商务酒店", "交通和餐饮配套便利，适合短途停留及商务出行。"), townItem("滨河及商业配套周边住宿", "靠近休闲空间与商业服务，方便夜间散步和次日出发。")],
      特产: [townItem("铜陵白姜礼盒", "选择正规渠道购买糖醋姜、嫩姜等便携产品。"), townItem("铜工艺文创与顺安酥糖", "以古铜都文化和地方糕点为主题的旅行手信。")],
      文化活动: [townItem("周末滨江音乐会", "滨水公共空间不定期举办群众音乐与休闲活动。"), townItem("义安城市文化市集", "汇集非遗、文创、农特产品和城市生活体验。")],
    },
    villages: [village("五松镇", "城东村", "连接城区与近郊田园的宜居村落。", "城郊农业、社区服务", "田园采摘与时令蔬果"), village("五松镇", "新江村", "临近长江水系，保留沿江生产生活风貌。", "滨江生态、特色种植", "江堤风光与生态稻米"), village("五松镇", "惠泉社区村", "城市生活与乡村治理融合的社区型村落。", "社区服务、文体活动", "便民文化广场")],
  },
  {
    id: "shunan", name: "顺安镇", subtitle: "千年古镇 · 凤丹之乡", intro: "顺安是铜陵历史悠久的古镇之一，也是义安东部城区的重要节点。这里既有老街酥糖的烟火气，也有凤凰山牡丹、金牛洞古采矿遗址所串联的自然与青铜文化。", highlights: ["顺安老街", "凤凰山", "青铜文化"], scene: "historic Anhui market town street at sunrise, traditional Chinese shops, local pastry stalls, distant green mountains and peony flowers, realistic travel photography, no text", mapKeyword: "安徽铜陵义安区顺安镇", representativeAttractions: ["顺安老街", "凤凰山景区", "金牛洞古采矿遗址"], industries: ["凤丹种植", "古镇文旅", "特色食品"], bestSeason: "春季赏凤丹牡丹，秋季适合古镇与山野游", duration: "建议一日，深度体验可安排两日", mapHotspot: { x: 0.493, y: 0.443, width: 120, height: 48 },
    guides: {
      美食: [townItem("大肠小刀面与老街早点", "从热乎面食、鸡汤米面和太平烧饼开始，感受顺安老街烟火。"), townItem("顺安酥糖与乡土菜", "品尝芝麻桂花香的传统酥糖，并搭配土鸡、河鲜等地方菜。")],
      游玩: [townItem("顺安老街", "沿老街寻找传统商铺、糕点和日常生活场景，适合清晨慢游。"), townItem("凤凰山与金牛洞遗址", "串联牡丹山景和古采矿遗存，了解自然生态与青铜文明。")],
      住宿: [townItem("顺安镇区便捷住宿", "餐饮交通便利，适合作为凤凰山及周边游览中转。"), townItem("凤凰山周边乡村民宿", "贴近山野村落，适合赏花季、亲子和自驾游客。")],
      特产: [townItem("顺安酥糖", "酥而不散、甜香柔润，是顺安最具识别度的伴手礼。"), townItem("凤丹产品与铜陵白姜", "可选凤丹主题农产品、糖醋白姜及地方农副产品。")],
      文化活动: [townItem("顺安老街非遗展演", "以传统糕点、民俗技艺和古镇故事为主题的文化展示。"), townItem("凤凰山凤丹文化节", "春季结合牡丹花期开展赏花、摄影与乡村市集活动。")],
    },
    villages: [village("顺安镇", "凤凰山村", "依托凤凰山生态与凤丹文化发展的山村。", "凤丹种植、乡村旅游", "凤凰山牡丹与凤丹产品"), village("顺安镇", "东垅村", "靠近古镇生活圈，田园与社区服务相互融合。", "特色种植、村级服务", "田园景观与时令果蔬"), village("顺安镇", "盛瑶村", "水田、湿地与村庄共同形成舒展的近郊景观。", "生态农业、水环境资源", "东湖湿地周边风光与优质稻米")],
  },
  {
    id: "zhongming", name: "钟鸣镇", subtitle: "山谷秘境 · 度假钟鸣", intro: "钟鸣镇山林资源丰厚，是义安东部颇具吸引力的生态旅游目的地。永泉小镇的江南园林、温泉度假和特色餐饮，让这里适合安排一场慢节奏的周末旅行。", highlights: ["永泉小镇", "山林温泉", "江南园林"], scene: "lush Anhui mountain valley resort with traditional Jiangnan gardens, stone bridges, streams, hot spring atmosphere, cinematic realistic travel photography, no text", mapKeyword: "安徽铜陵义安区钟鸣镇", representativeAttractions: ["永泉小镇", "梧桐花谷", "龙潭肖古村落"], industries: ["文旅度假", "生态农业", "乡村民宿"], bestSeason: "四季皆宜，秋冬温泉与山林体验更佳", duration: "建议一至两日",
    guides: { 美食: [townItem("江南味道街区", "集中体验柴火饼、鱼丸和地方小吃。"), townItem("柴火土鸡与葛根圆子", "山乡餐桌常见的暖胃土菜组合。")], 游玩: [townItem("永泉小镇忆江南园林", "漫步园林、街区并体验温泉度假。"), townItem("梧桐花谷与龙潭肖", "串联花海、山林与传统古村。")], 住宿: [townItem("永泉度假酒店", "适合温泉、餐饮与游园一站式度假。"), townItem("山林主题民宿", "适合安静休闲和周末慢旅行。")], 特产: [townItem("白姜制品", "地方风味鲜明，适合作为便携手信。"), townItem("凤丹花茶及山乡农品", "可选当地规范包装的特色农产品。")], 文化活动: [townItem("永泉江南民俗夜游", "以灯影、街景互动和民俗表演营造夜游体验。"), townItem("钟鸣山谷国风雅集", "结合山林场景开展国风展示与文化市集。") ] },
    villages: [village("钟鸣镇", "龙潭肖村", "古宅、溪流与山林相依的传统村落。", "古村保护、乡村旅游", "龙潭肖古村落与山货"), village("钟鸣镇", "水村村", "山谷水系滋养的生态村落。", "生态种植、休闲农业", "山泉景观与葛根产品"), village("钟鸣镇", "金山村", "依托山地资源发展户外休闲的新乡村。", "山地农业、文旅体验", "金山户外休闲与土鸡")],
  },
  {
    id: "tianmen", name: "天门镇", subtitle: "山水田园 · 白姜故里", intro: "天门镇以生态山水、乡村田园和铜陵白姜等特色物产见长。山林、水库与村落共同构成清新的乡野图景，适合自驾、亲子和近郊休闲。", highlights: ["天门山水", "铜陵白姜", "乡村自驾"], scene: "Anhui countryside landscape, terraced vegetable fields with white ginger crops, reservoir and forested hills, bright natural daylight, realistic tourism photography, no text", mapKeyword: "安徽铜陵义安区天门镇", representativeAttractions: ["天门山水", "印象河边", "乡村田园风景道"], industries: ["铜陵白姜", "特色种植", "生态休闲"], bestSeason: "春秋自驾舒适，夏秋可体验农事与采摘", duration: "建议半日至一日",
    guides: { 美食: [townItem("白姜风味菜", "鲜姜炒肉与糖醋姜体现脆嫩微辛的地方味。"), townItem("农家土鸡与山野菜", "结合时令食材品尝乡村家常菜。")], 游玩: [townItem("天门山水与乡村公路", "适合自驾、骑行与沿途观景。"), townItem("印象河边与亲子采摘", "体验森林休闲、户外活动和农事乐趣。")], 住宿: [townItem("镇区便捷住宿", "适合短途停留及周边村落中转。"), townItem("生态农庄与乡村民宿", "贴近田园，预订时可确认餐饮和停车。")], 特产: [townItem("铜陵白姜", "天门代表物产，可选嫩姜或糖醋姜产品。"), townItem("时令果蔬", "来自田园种植基地的新鲜农副产品。")], 文化活动: [townItem("铜陵白姜文化体验季", "结合采收、制作和品鉴认识白姜文化。"), townItem("天门乡村丰收节", "展示农产品、农事体验与乡村文艺。") ] },
    villages: [village("天门镇", "板桥村", "田园连片、农事体验丰富的白姜产区村落。", "白姜种植、农事研学", "铜陵白姜与田园景观"), village("天门镇", "金塔村", "山林与农田交错的生态村落。", "林下经济、特色果蔬", "山林步道与时令水果"), village("天门镇", "朱村村", "保留乡村肌理并发展近郊休闲。", "乡村旅游、生态农业", "传统村景与农家土菜")],
  },
  {
    id: "donglian", name: "东联镇", subtitle: "江畔沃野 · 活力东联", intro: "东联镇位于沿江区域，产业活力与广阔圩田相互映衬。这里能看到平坦田野、乡村道路与江畔生产生活共同组成的现代乡镇风貌。", highlights: ["沿江风光", "现代农业", "产业活力"], scene: "vast riverside farmland in Anhui China, geometric green fields, country roads, distant modern industrial skyline, golden hour, realistic aerial photography, no text", mapKeyword: "安徽铜陵义安区东联镇", representativeAttractions: ["沿江堤岸", "圩田农业景观", "现代产业风貌带"], industries: ["现代农业", "沿江产业", "优质稻米"], bestSeason: "春秋观田园，秋季适合丰收体验", duration: "建议半日",
    guides: { 美食: [townItem("沿江河鲜与家常土菜", "以新鲜水产和地方家常做法为主。"), townItem("圩区时令蔬菜", "品尝当季田园蔬菜与农家菜。")], 游玩: [townItem("沿江堤岸观景", "看长江、田野和村庄构成的开阔风景。"), townItem("现代农业体验", "了解规模种植和现代乡村生产场景。")], 住宿: [townItem("镇区商务住宿", "满足短途停留和产业出行需求。"), townItem("义安城区酒店联动", "可结合五松城区住宿和餐饮配套。")], 特产: [townItem("优质稻米", "圩区水土孕育的日常优质农产品。"), townItem("沿江农副产品", "可关注时令蔬果、水产和加工农品。")], 文化活动: [townItem("沿江农耕文化节", "围绕丰收、农事和农产品展示开展活动。"), townItem("东联乡村文艺汇演", "村民参与的群众文化与节庆演出。") ] },
    villages: [village("东联镇", "毛桥村", "圩田连片、道路通达的农业村落。", "优质稻米、规模种植", "稻田景观与新米"), village("东联镇", "复兴村", "沿江生产生活与美丽乡村建设相融合。", "沿江农业、水产", "江堤风光与河鲜"), village("东联镇", "永丰村", "以丰收田园和村级产业为特色。", "粮油种植、农产品加工", "油菜花田与粮油产品")],
  },
  {
    id: "xilian", name: "西联镇", subtitle: "艺术水乡 · 梦里西联", intro: "西联镇拥有丰沛水系与典型圩区田园风光，犁桥水镇让徽派建筑、民俗体验和水乡夜游成为当地鲜明名片。适合傍晚抵达，慢赏水岸灯影。", highlights: ["犁桥水镇", "圩区田园", "水乡夜游"], scene: "dreamy Anhui water town at blue hour, Huizhou architecture, canals, stone bridges, warm lantern reflections, realistic premium travel photography, no text", mapKeyword: "安徽铜陵义安区西联镇", representativeAttractions: ["犁桥水镇", "圩区田园", "水岸摄影点"], industries: ["水乡文旅", "优质稻米", "乡村民宿"], bestSeason: "春秋舒适，傍晚至夜间水镇景观更佳", duration: "建议一日或一晚",
    guides: { 美食: [townItem("犁桥水镇特色小吃", "在水镇街区集中体验地方风味。"), townItem("水乡土菜与河鲜", "结合水网资源品尝时令河鲜。")], 游玩: [townItem("犁桥水镇日夜游", "白天看徽派水乡，夜晚赏灯影与民俗互动。"), townItem("圩区田园摄影", "沿乡村道路感受水网、农田和村庄。")], 住宿: [townItem("犁桥水镇度假住宿", "方便体验夜游和清晨水乡。"), townItem("西联乡村民宿", "适合家庭和自驾游客慢住。")], 特产: [townItem("水镇文创", "以水乡建筑、民俗和灯影为灵感。"), townItem("稻米与茶干", "具有圩区和地方饮食特色的手信。")], 文化活动: [townItem("犁桥水镇灯会", "水岸灯组、巡游和互动表演构成夜间体验。"), townItem("西联水乡民俗周", "集中展示地方民俗、手作和乡村市集。") ] },
    villages: [village("西联镇", "犁桥村", "水系环绕、徽派风貌鲜明的文旅村落。", "水乡旅游、文创餐饮", "犁桥水镇与水乡手信"), village("西联镇", "钱湾村", "圩田与沟渠交织的农业村落。", "优质稻米、水产养殖", "田园水网与生态稻米"), village("西联镇", "三义村", "保留水乡生活气息的宜居村落。", "特色种植、乡村休闲", "荷塘景观与时令莲藕")],
  },
  {
    id: "xuba", name: "胥坝乡", subtitle: "江心绿洲 · 洲岛人家", intro: "胥坝乡隔江相望，洲岛、堤岸、田园和村庄形成独特的江心乡野景观。这里节奏舒缓，适合感受长江生态、骑行堤岸与原生乡村生活。", highlights: ["江心洲岛", "堤岸骑行", "生态田园"], scene: "Yangtze river island countryside in Anhui, green embankments, village houses, bicycles on riverside path, expansive river, realistic travel photography, no text", mapKeyword: "安徽铜陵义安区胥坝乡", representativeAttractions: ["江心洲岛", "长江堤岸", "洲岛田园"], industries: ["生态农业", "洲岛蔬果", "乡村休闲"], bestSeason: "春秋适合骑行，夏季注意汛期和天气信息", duration: "建议半日至一日",
    guides: { 美食: [townItem("江鲜与乡村家宴", "以时令水产和农家做法感受洲岛味道。"), townItem("时令洲岛蔬果", "品尝新鲜瓜果、蔬菜和稻米。")], 游玩: [townItem("江心洲岛漫游", "感受村庄、田园和长江共同构成的独特景观。"), townItem("堤岸骑行", "沿堤岸慢行观江，出发前关注天气和渡运信息。")], 住宿: [townItem("乡村民宿与农家体验", "适合体验安静洲岛生活。"), townItem("联动城区住宿", "如需稳定配套可返回五松城区。")], 特产: [townItem("洲岛农产品", "包括生态稻米、蔬菜和时令瓜果。"), townItem("沿江水产", "购买鲜活产品需注意运输和保鲜。")], 文化活动: [townItem("江心洲骑行文化节", "以生态骑行、乡村打卡和公益活动为主。"), townItem("胥坝乡村家宴节", "展示洲岛食材、乡土菜和邻里文化。") ] },
    villages: [village("胥坝乡", "群心村", "洲岛田园与村庄生活保存完整。", "生态稻米、时令蔬菜", "长江堤岸与绿色稻田"), village("胥坝乡", "旭光村", "面向长江、适合骑行观景的村落。", "乡村休闲、瓜果种植", "江景骑行线与时令瓜果"), village("胥坝乡", "龙潭村", "水网和农田相依的安静洲岛村庄。", "水产、生态农业", "乡村水景与特色水产")],
  },
  {
    id: "laozhou", name: "老洲乡", subtitle: "长江湿地 · 生态老洲", intro: "老洲乡依长江而生，洲滩湿地、农田水网与候鸟生态构成开阔自然画卷。这里适合观江、亲近湿地，并体验安静质朴的沿江乡村。", highlights: ["太阳岛", "湿地观鸟", "沿江乡村"], scene: "peaceful Yangtze wetland island in Anhui, reeds, migratory birds, river sunset, rural fields and small village, realistic nature travel photography, no text", mapKeyword: "安徽铜陵义安区老洲乡", representativeAttractions: ["老洲太阳岛", "长江湿地", "江岸日落"], industries: ["生态稻米", "沿江水产", "湿地生态体验"], bestSeason: "秋冬观鸟，春秋适合观江与田园漫步", duration: "建议半日至一日",
    guides: { 美食: [townItem("沿江鱼鲜", "品尝时令鱼鲜与家常烹制风味。"), townItem("农家土菜", "以稻米、蔬菜和乡村食材组成朴实餐桌。")], 游玩: [townItem("老洲太阳岛", "看洲滩、江面和开阔自然风光。"), townItem("湿地观鸟与江岸日落", "文明观鸟并与鸟群保持安全距离。")], 住宿: [townItem("乡村休闲住宿", "适合安静短住，提前确认接待条件。"), townItem("周边镇区酒店", "对配套要求较高可联动城区住宿。")], 特产: [townItem("生态稻米", "来自洲滩农田的代表性农产品。"), townItem("沿江水产与农副产品", "可按季节选购规范包装产品。")], 文化活动: [townItem("长江湿地观鸟季", "开展生态讲解、自然观察与文明观鸟活动。"), townItem("老洲渔歌民俗展演", "展示沿江生产生活记忆和乡土文艺。") ] },
    villages: [village("老洲乡", "太阳岛村", "洲滩湿地和江岸风光突出的生态村落。", "生态旅游、沿江水产", "太阳岛湿地与江鲜"), village("老洲乡", "中心村", "乡域公共服务与农业生产的重要节点。", "生态稻米、村级服务", "田园水网与优质稻米"), village("老洲乡", "成德村", "保留质朴沿江生活和农耕景观。", "粮食种植、传统农耕", "江岸日落与农家土菜")],
  },
  {
    id: "xinqiao", name: "新桥办事处", subtitle: "城乡枢纽 · 活力新桥", intro: "新桥办事处地处义安区城乡接合部，是连接城区与东部乡镇的重要节点，兼具城市服务配套与近郊田园风貌，适合作为中转补给和短途休闲的选择。", highlights: ["城乡接合", "交通便利", "近郊休闲"], scene: "Chinese suburban town at the edge of a small city, mix of modern community buildings and green farmland, roads connecting town and countryside, Anhui travel photography, realistic, no text", mapKeyword: "安徽铜陵义安区新桥办事处", representativeAttractions: ["城乡景观带", "近郊田园", "社区文化广场"], industries: ["现代商贸", "城郊农业", "社区服务"], bestSeason: "四季皆宜，春秋适合近郊漫步", duration: "建议半日，可与周边乡镇行程组合",
    guides: {
      美食: [townItem("城郊家常菜与早点", "融合城区与乡土风味的日常餐饮，方便快捷。"), townItem("社区小吃与便民餐饮", "街道两侧分布各类小吃店和便民餐饮。")],
      游玩: [townItem("城乡景观带漫步", "沿道路感受从城区到田园的渐变风貌。"), townItem("社区文化广场", "适合短时休闲、散步和了解本地生活。")],
      住宿: [townItem("城区周边商务住宿", "交通便利，适合作为全区游览的中转点。"), townItem("近郊便捷住宿", "靠近主要道路，方便前往东部各镇。")],
      特产: [townItem("城郊农副产品", "来自近郊田园的新鲜蔬果和农副产品。"), townItem("便民商超与地方手信", "可就近购买日常用品和地方食品。")],
      文化活动: [townItem("社区文化惠民活动", "面向居民开展文艺演出和群众文化。"), townItem("近郊农事体验", "结合季节开展采摘和农事体验活动。")],
    },
    villages: [village("新桥办事处", "新桥社区", "城乡接合部的核心社区，生活配套完善。", "社区服务、商贸", "社区文化广场与便民集市"), village("新桥办事处", "近郊村", "保留田园风貌的城郊村落。", "城郊农业、蔬菜种植", "近郊田园与时令蔬果"), village("新桥办事处", "沿路村", "依托交通干线发展的便民村落。", "商贸服务、餐饮", "道路沿线商铺与地方小吃")],
  },
];

const guideScene = (town: TownDetail, category: TownGuideCategory, item: string) => {
  const categoryScenes: Record<TownGuideCategory, string> = {
    "美食": "authentic local Anhui Chinese cuisine served in a refined rustic restaurant, appetizing food photography",
    "游玩": "beautiful rural attraction and cultural landscape in Anhui China, premium realistic travel photography",
    "住宿": "welcoming boutique hotel or countryside homestay in Anhui China, warm natural interior and exterior travel photography",
    "特产": "local Anhui specialty products and elegant souvenir packaging on a natural wooden table, commercial lifestyle photography",
    "文化活动": "lively traditional Chinese village cultural festival in Anhui, folk performance, lanterns and community market, realistic event photography",
  };
  return `${categoryScenes[category]}, inspired by ${town.name} and ${item}, natural daylight, realistic, no text, no watermark`;
};

type TravelCategory = "景点" | "美食" | "住宿" | "文创";
type TravelCatalogItem = { name: string; area: string; detail: string; subtype: string; image: string; images?: readonly string[] };
type SelectedTravelItem = { item: TravelCatalogItem; category: TravelCategory };
const publicAssetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const travelCategories: TravelCategory[] = ["景点", "美食", "住宿", "文创"];
const travelCatalog: Record<TravelCategory, readonly TravelCatalogItem[]> = {
  "景点": [
    { name: "永泉小镇", area: "义安区", subtype: "AAAA级景区", detail: "集生态旅游观光、休闲度假、娱乐美食和温泉康养于一身的“无忧度假”小镇，以江南园林为主要风格，有忆江南12景、江南味道、农家小院、九宝温泉等景点和乡愁巡演、打弹珠、儿童乐园等体验项目。", image: "/treasures/scenic/yongquan-town.webp" },
    { name: "凤凰山景区", area: "义安区", subtype: "AAAA级景区", detail: "“在叶山东南，有泉一泓，相传有凤凰翔饮于上”，主要景点有相思树、牡丹园、滴水崖、凤仪湖、凤凰落脚石、金牛洞古采矿遗址、铜陵县首次党代会遗址等。", image: "/treasures/scenic/fenghuangshan-scenic-area.webp" },
    { name: "梧桐花谷", area: "义安区", subtype: "AAAA级景区", detail: "“钟鸣天下，凤栖梧桐”，是一家以生态农业为基，以四季花海为主题，以休闲体验为发展方向，以学生劳动教育与研学旅游为特色的综合性旅游景区。", image: "/treasures/scenic/wutong-flower-valley.webp" },
    { name: "犁桥水镇", area: "义安区", subtype: "AAAA级景区", detail: "江南水乡风貌的徽派建筑集群，含119栋古建民居、8条古建街道，以及临水错落分布的亭台楼榭，拥有灯会、非遗演艺和夜游、夜宴、夜宿等丰富业态。", image: "/treasures/scenic/liqiao-water-town.webp" },
    { name: "天井湖公园", area: "义安区", subtype: "AAAA级景区", detail: "湖中有“上通天、下通海”的天井，园内拥有溢沁园、九曲桥、通天阁、山谷碑林、牡丹园等30多处游憩场所和风景点。", image: "/treasures/scenic/tianjing-lake-park.webp" },
    { name: "梦思康百合庄园", area: "义安区", subtype: "AAA级景区", detail: "以“赏药景、品药膳、购农特”和百合花海为特色主题，打造研学旅游、休闲娱乐、劳动实践等特色板块。", image: "/treasures/scenic/mengsikang-lily-manor.webp" },
    { name: "“江南铜谷”旅游风景道", area: "九凤路示范段", subtype: "省级旅游风景道", detail: "以路为引，将沿线旅游景区、特色田园风光及乡村景点串联成线，使山水资源、乡土文化、生态农耕有机结合。", image: "/treasures/scenic/jiangnan-copper-valley-scenic-road.webp" },
    { name: "荆公书堂", area: "义安区", subtype: "历史文化场馆", detail: "为纪念北宋名相王安石在此讲学而建，现为义安历史文化博览馆，是集史学研究、文化传播、学生研学、文旅融合等功能于一体的城市会客厅。", image: "/treasures/scenic/jinggong-study-hall.webp" },
    { name: "印象河边", area: "天门镇郎坑村", subtype: "休闲农业与露营基地", detail: "现为铜陵市休闲农业和乡村旅游示范点，包含烧烤咖啡、稻田写生、采摘抓鱼等休闲露营与农趣体验项目。", image: "/treasures/scenic/yinxiang-riverside.webp" },
    { name: "太阳岛", area: "老洲乡最南端", subtype: "滨江自然景观", detail: "集小型草原、耕地、树林、蓝天、沙滩与江水于一体，3至5月到访游玩最佳。", image: "/treasures/scenic/sun-island.webp" },
    { name: "金山景区", area: "义安区", subtype: "自然景区及主题体验区", detail: "夏秋晚晴时层层山崖映染得金碧辉煌，脚畔杉木墩被称为“铜陵的阿勒泰”，“淘金小镇”主题体验区有淘金、骑马、游船等活动。", image: "/treasures/scenic/jinshan-view.webp" },
    { name: "金牛洞古采矿遗址", area: "义安区", subtype: "全国重点文物保护单位", detail: "因西部山腰被称为“金牛洞”的古洞而得名，经考古专家论证，是一处春秋到西汉时期的采矿遗址。", image: "/treasures/scenic/jinniudong-ancient-mine.webp" },
    { name: "龙潭肖古村落", area: "龙潭肖村", subtype: "中国传统村落", detail: "中国第三批传统村落，始建于明宪宗年间，距今已有400余年历史，喀斯特地形错落有致、山水交融。", image: "/treasures/scenic/longtanxiao-ancient-village.webp" },
    { name: "渡江第一船", area: "胥坝乡群心村", subtype: "渡江战役纪念地", detail: "雕塑耸立于胥坝乡群心村渡江文化广场，当年“百万雄师过大江”第一船登陆点即胥坝乡文兴洲。", image: "/treasures/scenic/first-river-crossing-boat.webp" },
    { name: "笠帽山烈士陵园", area: "五松镇", subtype: "烈士纪念设施", detail: "位于五松镇笠帽山南侧区域市级自然保护区内，是铜陵市面积最大的、功能最齐全的烈士纪念园。", image: "/treasures/scenic/limaoshan-martyrs-cemetery.webp" },
    { name: "中共铜陵特支展览馆", area: "西联镇钱湾村", subtype: "红色历史展览馆", detail: "1931年初正式成立的中共铜陵特支，是中国共产党在铜陵江南地区建立的第一个党支部。", image: "/treasures/scenic/tongling-special-branch-museum.webp" },
    { name: "铜草花开研学旅游基地", area: "义安区", subtype: "省级研学旅游示范基地", detail: "集观光体验、农业技术研发、互联网推广、研学教育为一体，课程涵盖青铜文化、红色文化、农耕文化、中医药文化等。", image: "/treasures/scenic/tongcaohuakai-study-base.webp" },
    { name: "乡野拾光研学旅游基地", area: "老洲乡成德示范园", subtype: "田园实践研学基地", detail: "科学规划阅读区、乡村记忆馆、24节气展示等室内功能区，以及垂钓、采摘、种植三大室外区域。", image: "/treasures/scenic/xiangye-shiguang-study-base.webp" },
    { name: "金丰元农业发展基地", area: "中华白姜文化园", subtype: "白姜文化研学基地", detail: "课程主要围绕“白姜文化”，可了解白姜从田地到餐桌的制作全过程。", image: "/treasures/scenic/jinfengyuan-study-base.webp" },
  ],
  "美食": [
    { name: "七里书童", area: "西联镇三义村", subtype: "农家乐·餐饮住宿", detail: "主要建设二十四节气民宿、主题包厢餐饮，配备公共休闲区、儿童游泳池、图书阅读点、观景露台、咖啡屋等设施。", image: "/treasures/food/qili-shutong.webp" },
    { name: "兰婷小院", area: "西联镇犁桥村", subtype: "农家乐·土菜餐饮", detail: "坚持选用新鲜优质食材，招牌菜品有特色红烧肉、农家小炒鸡以及河鲜类菜品。", image: "/treasures/food/lanting-courtyard.webp" },
    { name: "山里任家", area: "钟鸣镇金凤村", subtype: "农家乐·乡村休闲", detail: "内含乡村会客厅、民宿休闲、亲子游乐、山林景观、生态鱼趣、农耕体验等功能区。", image: "/treasures/food/shanli-renjia-farmstay.webp" },
    { name: "明塘人家", area: "西联镇犁桥村", subtype: "农家乐·农家菜", detail: "犁桥村首家农家乐，周边有明塘文化艺术村、漫园等景点，以原汁原味的农家菜为主。", image: "/treasures/food/mingtang-renjia.webp" },
    { name: "春风小院", area: "天门镇双龙洞旁", subtype: "农家乐·亲子农耕", detail: "打造徽派园林微缩景观，配套农耕体验田、生态垂钓池和亲子采摘等沉浸式活动。", image: "/treasures/food/chunfeng-courtyard.webp" },
    { name: "汀洲小院", area: "西联镇汀洲村", subtype: "农家乐·非遗美食", detail: "致力于传承太平街烧饼、太平街臭干等非遗，配套民宿、书吧茶吧、中餐厅、书画创作区等。", image: "/treasures/food/tingzhou-courtyard.webp" },
    { name: "江畔林樾", area: "老洲乡光辉村", subtype: "农家乐·江畔休闲", detail: "涵盖包厢餐饮、庭院露营、农事体验等田园风格场地，可静享江畔与林间景致。", image: "/treasures/food/jiangpan-linyue.webp" },
    { name: "东联全蟹宴", area: "东联镇", subtype: "地方特色宴席", detail: "以螃蟹为主题的地方宴席，具体菜品与供应信息以现场为准。", image: "/treasures/food/donglian-crab-feast.webp" },
    { name: "丹皮熏鱼", area: "义安区", subtype: "地方特色菜", detail: "结合本地丹皮与山泉小河鱼熏制，鲜香浓郁。", image: "/treasures/food/danpi-smoked-fish.webp" },
    { name: "太平街烧饼", area: "太平街", subtype: "传统小吃", detail: "茶杯口大小，里外十八层，层层酥透。", image: "/treasures/food/taiping-street-shaobing.webp" },
    { name: "太平街臭干", area: "太平街", subtype: "传统小吃", detail: "采用汀洲优质黄豆手工制作，闻臭吃香。", image: "/treasures/food/taiping-street-stinky-tofu.webp" },
    { name: "小刀面", area: "义安区", subtype: "传统面食", detail: "纯手工擀制，面条爽滑有弹性。", image: "/treasures/food/xiaodao-noodles.webp" },
    { name: "老洲成德卤鹅", area: "老洲乡", subtype: "传统卤味", detail: "严选散养大鹅，以沿用四十多年的秘方卤制。", image: "/treasures/food/chengde-su-braised-goose.webp" },
    { name: "文星猪蹄", area: "义安区", subtype: "传统卤味", detail: "老卤文火慢炖，红润鲜香。", image: "/treasures/food/wenxing-pork-trotter.webp" },
    { name: "梦思康百合宴", area: "梦思康百合庄园", subtype: "主题宴席", detail: "以自种百合入馔的特色宴席。", image: "/treasures/food/mengsikang-lily-feast.webp" },
    { name: "永泉芝麻饼", area: "永泉", subtype: "传统糕点", detail: "以老品种小粒芝麻手工杵粉制作。", image: "/treasures/food/yongquan-sesame-cake.webp" },
    { name: "金榔油没鸭", area: "义安区", subtype: "地方特色菜", detail: "以本鸭制作，外酥里嫩，正式名称为“油没鸭”。", image: "/treasures/food/jinlang-youmo-duck.webp" },
    { name: "钟鸣杀猪汤", area: "钟鸣镇", subtype: "民俗汤菜", detail: "以猪里脊、猪肝、猪腰等制作的民俗汤菜。", image: "/treasures/food/zhongming-pork-soup.webp" },
    { name: "铜陵凤丹（牡丹籽油）", area: "义安区", subtype: "地方特产", detail: "国家地理标志保护产品凤丹的衍生产品。", image: "/treasures/food/tongling-peony-seed-oil.webp" },
    { name: "铜陵白姜", area: "义安区", subtype: "地方特产", detail: "国家地理标志保护产品，块大皮薄、汁多渣少。", image: "/treasures/food/tongling-white-ginger.webp" },
    { name: "雕胡饭", area: "义安区", subtype: "传统米食", detail: "以菰米独煮或与稻米同煮，承载李白诗意。", image: "/treasures/food/diaohu-rice.webp" },
    { name: "顺安酥糖", area: "顺安镇", subtype: "传统糕点", detail: "非遗传统糕点，松柔甜润。", image: "/treasures/food/shunan-crispy-candy.webp" },
  ],
  "住宿": [
    { name: "凤栖民宿", area: "凤凰山景区内", subtype: "景区民宿", detail: "位于凤凰山葱郁环抱之中，拥有得天独厚的地理位置和生态环境。", image: "/treasures/stay/fenghuangshan-fengqi-homestay.webp" },
    { name: "德让堂", area: "犁桥水镇", subtype: "皖美银牌民宿", detail: "依水而建并具徽派建筑元素。", image: "/treasures/stay/derang-hall.webp" },
    { name: "明水居", area: "钟鸣镇水村村", subtype: "皖美银牌民宿", detail: "兼具明清古韵与现代设施。", image: "/treasures/stay/mingshui-residence.webp" },
    { name: "松云山居", area: "永泉小镇", subtype: "国家乙级民宿/皖美金牌民宿", detail: "完整保留江南建筑风貌。", image: "/treasures/stay/songyun-mountain-residence.webp" },
    { name: "百合庄园民宿", area: "梦思康百合庄园", subtype: "皖美银牌民宿", detail: "坐拥花海并提供亲子体验。", image: "/treasures/stay/lily-manor-homestay.webp" },
    { name: "竹海人家", area: "叶山羊形山水库", subtype: "皖美金牌民宿", detail: "门前千亩竹海。", image: "/treasures/stay/zhuhai-renjia.webp" },
    { name: "耕心堂", area: "犁桥水镇", subtype: "皖美金牌民宿", detail: "融入徽派景区并配套活动空间。", image: "/treasures/stay/gengxin-hall.webp" },
    { name: "铁山头民宿", area: "江南铜谷风景道", subtype: "风景道民宿", detail: "位于江南铜谷风景道，距凤凰山约2公里。", image: "/treasures/stay/tieshantou-homestay.webp" },
    { name: "龙潭肖民宿", area: "龙潭肖村", subtype: "传统村落民宿", detail: "新老共生并有庭院泳池。", image: "/treasures/stay/longtanxiao-homestay.webp" },
  ],
  "文创": [
    { name: "东联文创", area: "东联镇", subtype: "乡镇文创", detail: "以东联镇为主题的地方文创。", image: "/treasures/culture/donglian-cultural-creative.webp" },
    { name: "五松滨江书屋冰箱贴", area: "五松镇滨江书屋", subtype: "乡镇文创", detail: "以五松镇滨江书屋为主题的文创。", image: "/treasures/culture/wusong-riverside-bookstore-magnet.webp" },
    { name: "凤凰山瀑布咖啡", area: "凤凰山景区", subtype: "景区文创", detail: "以凤凰山景区瀑布咖啡为主题的景区文创。", image: "/treasures/culture/fenghuangshan-waterfall-coffee-1.webp", images: ["/treasures/culture/fenghuangshan-waterfall-coffee-1.webp", "/treasures/culture/fenghuangshan-waterfall-coffee-2.webp", "/treasures/culture/fenghuangshan-waterfall-coffee-3.webp"] },
    { name: "犁桥水镇文创", area: "犁桥水镇", subtype: "景区文创", detail: "以犁桥水镇为主题的景区文创。", image: "/treasures/culture/liqiao-water-town-creative-1.webp", images: ["/treasures/culture/liqiao-water-town-creative-1.webp", "/treasures/culture/liqiao-water-town-creative-2.webp"] },
    { name: "老洲文创", area: "老洲乡", subtype: "乡镇文创", detail: "以老洲乡为主题的地方文创。", image: "/treasures/culture/laozhou-cultural-creative.webp" },
    { name: "四喜铜娃冰箱贴", area: "义安区", subtype: "铜工艺文创", detail: "以四喜铜娃和铜文化为主题的文创。", image: "/treasures/culture/sixi-copper-doll-magnet.webp" },
    { name: "永泉小镇铜艺坊", area: "永泉小镇", subtype: "铜工艺文创", detail: "以永泉小镇和铜文化为主题的文创。", image: "/treasures/culture/yongquan-copper-workshop.webp" },
    { name: "铜拓版画", area: "义安区", subtype: "铜工艺文创", detail: "以铜文化为主题的文创。", image: "/treasures/culture/copper-rubbing-print.webp" },
  ],
} as const;

const yianGoods = [
  { name: "铜陵白姜", type: "全球农遗", source: "官方甄选", publisher: "义安区文旅推荐", detail: "块大皮薄、汁多渣少，可制成糖醋姜、姜片和姜膏。", specification: "嫩姜礼盒 / 糖醋姜 / 姜膏", service: "支持产地直发，具体规格与配送范围以购买页为准。", scene: "premium fresh white ginger and elegant preserved ginger gift box, Anhui specialty product photography" },
  { name: "顺安酥糖", type: "传统风味", source: "官方甄选", publisher: "顺安镇特色产业推荐", detail: "芝麻、桂花与麦芽糖交织，入口松柔酥香，是顺安经典手信。", specification: "经典袋装 / 节庆礼盒", service: "建议密封避光保存，过敏原等信息请查看商品包装。", scene: "traditional Chinese sesame flaky candy in elegant paper gift packaging, food photography" },
  { name: "凤丹系列", type: "农遗好物", source: "官方甄选", publisher: "义安区文旅推荐", detail: "源自凤凰山凤丹产业，可延伸为牡丹籽油、花茶和护肤产品。", specification: "牡丹籽油 / 凤丹花茶 / 护肤礼盒", service: "不同品类适用方式不同，下单前请核对产品说明。", scene: "white peony flowers, peony seed oil and refined botanical skincare gift set" },
  { name: "铜拓本画", type: "非遗文创", source: "官方甄选", publisher: "义安区非遗保护中心", detail: "从青铜纹饰中提取文化符号，以拓印方式留下古铜都记忆。", specification: "装裱画 / 手作体验套装", service: "手工产品纹理略有差异，装裱尺寸以商品详情为准。", scene: "Chinese bronze rubbing artwork, ancient bronze patterns, refined cultural souvenir display" },
  { name: "铜艺文创", type: "铜都手作", source: "农特商品", publisher: "钟鸣镇村民手作坊", detail: "铜制摆件、书签和生活器物，以现代设计讲述青铜文化。", specification: "铜书签 / 桌面摆件 / 茶器", service: "铜器会随使用形成自然氧化色泽，请按说明进行养护。", scene: "refined handcrafted copper ornaments bookmarks and cultural creative products" },
  { name: "太平烧饼", type: "地方糕点", source: "农特商品", publisher: "顺安镇村民商户", detail: "层次丰富、现烤酥香，适合作为旅途小食和地方伴手礼。", specification: "现烤散装 / 便携礼袋", service: "糕点建议尽快食用，保质期和储存方式以包装为准。", scene: "freshly baked layered Chinese sesame flatbread, rustic bakery food photography" },
  { name: "顺安山芋粉丝", type: "乡村物产", source: "农特商品", publisher: "顺安镇农家合作户", detail: "以山芋淀粉加工，口感柔韧，适合炖煮、火锅和家常烹饪。", specification: "家庭装 / 农产礼盒", service: "干燥阴凉处保存，烹饪前可根据口感需求浸泡。", scene: "traditional sweet potato glass noodles in natural woven basket, rural product photography" },
  { name: "西联故事礼盒", type: "水乡礼物", source: "农特商品", publisher: "西联镇犁桥村文创铺", detail: "集合水镇文创与地方风物，把西联水乡印象装进一份礼盒。", specification: "文创组合 / 节庆定制礼盒", service: "礼盒内容会随季节调整，实际组合以购买页面为准。", scene: "elegant Jiangnan water town souvenir gift box with cultural creative products" },
] as const;

const villagerGoodsPhones: Record<string, string> = {
  "铜艺文创": "13856218831",
  "太平烧饼": "13955910826",
  "顺安山芋粉丝": "13856270918",
  "西联故事礼盒": "13965208716",
};

type YianGood = (typeof yianGoods)[number];
type GoodsSource = YianGood["source"];
type GoodsSourceFilter = "全部" | GoodsSource;
const goodsSourceFilters: GoodsSourceFilter[] = ["全部", "官方甄选", "农特商品"];
const goodsCategories = Array.from(new Set(yianGoods.map((good) => good.type)));

type GoodsDelivery = "快递配送" | "到店自提";
type GoodsOrder = {
  id: string;
  createdAt: string;
  productName: string;
  productType: string;
  productScene: string;
  specification: string;
  unitPrice: number;
  quantity: number;
  goodsAmount: number;
  shippingFee: number;
  totalAmount: number;
  delivery: GoodsDelivery;
  receiver: string;
  phone: string;
  region: string;
  address: string;
  message: string;
};
type GoodsForm = { receiver: string; phone: string; region: string; address: string; message: string };
type GoodsFormErrors = Partial<Record<"receiver" | "phone" | "region" | "address", string>>;
type PersonalRecordPage = "favorites" | "orders" | "order-detail" | "history";
type PersonalRecordView = { page: PersonalRecordPage; orderId?: string } | null;
type BrowsingHistoryItem = { type: "spot" | "town" | "good"; id: string; viewedAt: string };
const GOODS_ORDERS_KEY = "yianyouli:tourist:goods-orders";
const GOODS_FAVORITES_KEY = "yianyouli:tourist:favorite-goods";
const BROWSING_HISTORY_KEY = "yianyouli:tourist:browsing-history";
const goodsPrices: Record<string, number> = { "铜陵白姜": 58, "顺安酥糖": 36, "凤丹系列": 128, "铜拓本画": 168, "铜艺文创": 98, "太平烧饼": 29.9, "顺安山芋粉丝": 42, "西联故事礼盒": 138 };
const pickupPoint = "义安好物游客服务站（义安区顺安镇东城大道）";

const getSpotGuideContent = (spot: ScenicSpot) => {
  const isWaterTown = spot.id === "liqiao";
  const isResort = spot.id === "yongquan";
  const theme = isWaterTown ? "水巷、石桥与灯影" : isResort ? "园林、山谷与温泉" : "山林、牡丹与溪谷";
  const audience = isWaterTown ? "亲子家庭、情侣、夜景摄影爱好者" : isResort ? "家庭度假、情侣、康养慢游人群" : "登山爱好者、亲子研学与自然摄影人群";
  const equipment = isWaterTown ? "舒适步行鞋、轻薄外套；临水区域照看好儿童，夜拍可携小型稳定器。" : isResort ? "舒适步行鞋、替换衣物；体验温泉请提前确认用品与预约规则。" : "防滑运动鞋、防晒与饮水；雨后山路湿滑，量力选择坡度和里程。";
  const offPeak = isWaterTown ? "周末建议 15:00 前抵达，先游街巷再等亮灯；20:00 后离场车流较集中。" : isResort ? "度假旺季建议提前预约，上午先游园、午后错峰用餐，温泉安排在傍晚更从容。" : "花期建议开园后尽早入山，先走牡丹园和核心观景点，午后避开返程高峰。";
  const routeNodes = isWaterTown
    ? ["游客中心", "青砖街巷", "水岸石桥", "非遗街区", "夜游灯影"]
    : isResort
      ? ["游客中心", "忆江南园林", "江南味道街区", "山谷步道", "温泉度假区"]
      : ["景区山门", "牡丹园", "奇石溪谷", "山林观景点", "生态步道"];
  const cultureStories = isWaterTown
    ? [
        { label: "水乡新生", title: "从犁桥村到艺术水镇", detail: `依托村庄水系和田园肌理，${spot.name}把青砖街巷、临水空间与乡村生活重新连接，让传统村落在文旅融合中焕发活力。` },
        { label: "人文民俗", title: "灯影里的水乡烟火", detail: "民俗巡游、地方小吃和节庆市集让水岸不只是风景，也承载着西联圩区的生活记忆与待客之道。" },
        { label: "建筑故事", title: "桥、巷、院落的江南秩序", detail: "石桥串联两岸，窄巷引向院落，白墙黛瓦倒映水面，形成适合慢行、停留和夜游的空间节奏。" },
      ]
    : isResort
      ? [
          { label: "山谷营造", title: "把江南园林藏进山谷", detail: `${spot.name}顺应山势、水系和植被营造园林游线，让亭台、石径、溪流与四季景观自然衔接。` },
          { label: "人文生活", title: "一枚铜钱串起地方味道", detail: "特色街区用铜钱消费与市井摊铺营造旧时江南氛围，也把铜陵土菜、皖南小吃和旅行体验串联起来。" },
          { label: "民俗体验", title: "园林夜游与温泉慢生活", detail: "国风游园、民俗技艺和山谷温泉共同构成度假叙事，让游客从看景延伸到住下来、慢体验。" },
        ]
      : [
          { label: "历史物产", title: "凤凰山与千年凤丹", detail: `${spot.name}以凤丹牡丹闻名，春日花事既是自然景观，也连接着当地长期形成的种植传统和物产记忆。` },
          { label: "山乡人文", title: "花期里的乡野盛会", detail: "赏花、赶集和地方文化活动把山林游览与村落生活相连，形成义安春季极具辨识度的文旅场景。" },
          { label: "自然故事", title: "奇石溪谷中的生态课堂", detail: "山体、溪谷和林木共同塑造凤凰山的游览骨架，适合在行走中观察地貌、植物与季节变化。" },
        ];
  const photoSpots = [
    { name: isWaterTown ? "水岸石桥倒影" : isResort ? "忆江南园林借景" : "牡丹园花径", time: isWaterTown ? "日落前后至蓝调时刻" : "上午 9 点前柔和侧光" , tip: isWaterTown ? "靠近水岸低机位取景，将桥洞、灯笼和倒影组成对称画面。" : isResort ? "利用门洞、廊柱作前景，人物站在曲径或亭台一侧更有层次。" : "使用中长焦压缩花海，人物与花丛保持距离，避免踩踏。" },
    { name: isWaterTown ? "青砖街巷灯笼" : isResort ? "山谷溪流石径" : "奇石溪谷", time: "上午或傍晚游客较少时", tip: isWaterTown ? "沿街巷纵深拍摄，等待行人进入画面，突出水镇生活感。" : isResort ? "降低快门表现流水，注意防滑并避开游览通道架设设备。" : "用广角纳入岩石与林木，人物作为比例参照，表现山谷尺度。" },
    { name: isWaterTown ? "夜游临水街区" : isResort ? "江南味道夜景" : "山林观景平台", time: isWaterTown || isResort ? "亮灯后 20—40 分钟" : "晴日下午或日落前", tip: isWaterTown || isResort ? "适当降低曝光保留灯牌高光，开启夜景模式并固定手机。" : "选择前景枝叶框住远山，逆光时点击天空测光保留云层细节。" },
  ];
  const nearby = isWaterTown
    ? [
        { category: "附近美食", name: "犁桥水镇圆楼", detail: "太白雕胡饭、水乡土菜与非遗风味，适合夜游前后用餐。", keyword: "安徽铜陵犁桥水镇圆楼" },
        { category: "品质住宿", name: "犁桥耕心堂", detail: "水镇古建氛围特色民宿，方便体验清晨与夜晚的水乡。", keyword: "安徽铜陵犁桥耕心堂" },
        { category: "义安好物", name: "西联故事礼盒", detail: "集合水镇文创与地方风物，可在“义安好物”继续查看。", keyword: "安徽铜陵犁桥水镇文创区" },
        { category: "联游景点", name: "东湖湿地公园", detail: "亲水栈道与开阔草坪，适合组合半日亲子休闲。", keyword: "安徽铜陵东湖湿地公园" },
      ]
    : isResort
      ? [
          { category: "附近美食", name: "永泉江南味道小吃街", detail: "集中品尝柴火饼、鱼丸及铜陵地方小吃。", keyword: "安徽铜陵永泉江南味道" },
          { category: "品质住宿", name: "永泉松云山居", detail: "融入山林园景，可联动温泉与慢度假行程。", keyword: "安徽铜陵永泉松云山居" },
          { category: "义安好物", name: "铜陵白姜", detail: "全球农遗风味，可选择嫩姜、糖醋姜等便携产品。", keyword: "安徽铜陵永泉小镇特产店" },
          { category: "联游景点", name: "龙潭肖古村落", detail: "古宅、石桥和溪流交织，可与钟鸣山谷线路串联。", keyword: "安徽铜陵龙潭肖古村落" },
        ]
      : [
          { category: "附近美食", name: "顺安老街早点", detail: "大肠小刀面、太平烧饼等地方早餐，适合登山前补给。", keyword: "安徽铜陵顺安老街" },
          { category: "品质住宿", name: "凤凰山乡村民宿", detail: "靠近山野村落，适合花期、自驾及亲子游客。", keyword: "安徽铜陵凤凰山乡村民宿" },
          { category: "义安好物", name: "凤丹系列", detail: "牡丹籽油、凤丹花茶等产品呼应凤凰山物产文化。", keyword: "安徽铜陵凤凰山农特优市集" },
          { category: "联游景点", name: "金牛洞古采矿遗址", detail: "了解义安古代采冶文明，适合自然与人文联游。", keyword: "安徽铜陵金牛洞古采矿遗址" },
        ];

  return {
    strategy: [
      { label: "建议时长", value: spot.duration },
      { label: "最佳时间", value: spot.bestTime },
      { label: "适合人群", value: audience },
      { label: "装备与注意", value: equipment },
      { label: "错峰提示", value: offPeak },
    ],
    routes: [
      { name: "精华 2 小时", meta: "约 2 小时 · 轻量打卡", steps: routeNodes.slice(0, 4).map((name, index) => ({ name, info: `${index === 0 ? "集合与咨询" : index === 3 ? "核心体验" : "步行约 10—20 分钟"}` })) },
      { name: "半日深度路线", meta: "约 4 小时 · 慢游体验", steps: routeNodes.map((name, index) => ({ name, info: index === routeNodes.length - 1 ? "预留 40—60 分钟" : `第 ${index + 1} 站 · 约 ${20 + index * 10} 分钟` })) },
      { name: isWaterTown ? "亲子夜游路线" : isResort ? "亲子度假路线" : "亲子 / 摄影路线", meta: "约 3 小时 · 低强度", steps: [routeNodes[0], routeNodes[2], routeNodes[4]].map((name, index) => ({ name, info: index === 1 ? `重点观察与拍摄${theme}` : "步行约 300—600 米" })) },
    ],
    cultureStories,
    photoSpots,
    nearby,
  };
};

type TouristSection = "智慧导览" | "魅力义安" | "宝藏义安" | "义安好物" | "我的";
type TouristQuickService = "义安天气" | "投诉建议";
type TouristSideService = TouristQuickService | "投资义安";
type InvestmentCategory = "文旅" | "乡村运营" | "现代农业" | "康养" | "商业配套";
type InvestmentView = "list" | "detail" | "form" | "success";
type InvestmentProject = {
  id: string;
  name: string;
  town: string;
  category: InvestmentCategory;
  status: string;
  scene: string;
  suggestion: string;
  sceneryImage: string;
  contact: string;
  phone: string;
};
type InvestmentLead = {
  id: string;
  name: string;
  phone: string;
  project: string;
  direction: string;
  amount: string;
  remark: string;
  submittedAt: string;
};

const investmentCategories: Array<"全部" | InvestmentCategory> = ["全部", "文旅", "乡村运营", "现代农业", "康养", "商业配套"];
const INVESTMENT_LEADS_KEY = "yian-investment-leads";
const investmentProjects: InvestmentProject[] = [
  { id: "liqiao-night", name: "犁桥水镇夜游业态提升项目", town: "西联镇", category: "文旅", status: "重点招商", scene: "犁桥水镇现有闲置水街商铺 28 间、沿河空置院落 6 处及可利用的水景舞台 1 座，水岸空间约 1200 米，徽派街区保存完好，具备沉浸演艺与夜间消费的场景基础。", suggestion: "建议导入沉浸式光影演艺、夜间市集和精品民宿业态，分期实施水岸亮化提升，引入内容品牌方联合运营，打造长三角周末夜游目的地。", sceneryImage: imageUrl("Beautiful Chinese water town Liqiao at night with illuminated Jiangnan architecture along the canal, traditional Hui-style white walls and dark tiles reflected in calm water, warm lanterns, atmospheric documentary photography, no text, no watermark"), contact: "义安区文化和旅游局招商专员 汪女士", phone: "0562-881****" },
  { id: "longtan-village", name: "龙潭肖古村整村运营项目", town: "钟鸣镇", category: "乡村运营", status: "合作洽谈中", scene: "龙潭肖古村现有闲置院落 24 处、祠堂公共空间 2 座及山谷林地约 300 亩，传统徽派古宅保存较好，溪流穿村而过，具备整村保护性利用的资源基础。", suggestion: "建议引入专业运营团队，盘活闲置院落发展民宿和主理人业态，同步打造非遗工坊、研学课堂和乡村餐厅，建立村集体利益联结机制。", sceneryImage: imageUrl("Ancient Chinese village Longtan Xiao in Anhui with preserved Hui-style architecture, stone bridges over a mountain stream, lush green valley, misty morning light, documentary photography, no text, no watermark"), contact: "钟鸣镇乡村振兴办公室 陈先生", phone: "0562-829****" },
  { id: "white-ginger", name: "铜陵白姜智慧农业产业园", town: "天门镇", category: "现代农业", status: "可立即对接", scene: "天门镇白姜核心种植区现有连片闲置农田约 500 亩、旧有加工厂房 2 栋及可利用仓储用地 30 亩，灌溉条件良好，至义安城区及高速出入口交通便利。", suggestion: "建议建设白姜数字种植示范基地、精深加工中心和冷链仓储设施，配套品牌展示与电商直播空间，推动全球重要农业文化遗产产业化升级。", sceneryImage: imageUrl("Lush green Tongling white ginger fields in Anhui countryside with traditional farming terraces, mountains in background, morning sunlight, agricultural documentary photography, no text, no watermark"), contact: "义安区农业农村局产业科 方先生", phone: "0562-887****" },
  { id: "phoenix-health", name: "凤凰山森林康养度假项目", town: "顺安镇", category: "康养", status: "前期招商", scene: "凤凰山片区有可利用的山林步道 8 公里、闲置村集体用房 5 栋及凤丹种植区约 200 亩，生态环境良好，毗邻城区生活配套，具备康养度假资源条件。", suggestion: "建议布局森林疗愈步道、康养酒店和中医理疗中心，开发凤丹主题养生产品，面向长三角银发与家庭康养市场打造山地康养综合体。", sceneryImage: imageUrl("Phoenix Mountain forest scenery in Anhui with lush green trees, winding mountain trails, peony flowers blooming, soft morning mist, serene natural landscape photography, no text, no watermark"), contact: "顺安镇招商服务中心 刘女士", phone: "0562-889****" },
  { id: "donglian-farm", name: "东联智慧稻渔综合示范基地", town: "东联镇", category: "现代农业", status: "重点招商", scene: "东联镇沿江圩区有连片高标准闲置农田约 800 亩、可用仓储用地 20 亩，地势平坦、灌溉渠道完善，具备机械化作业和智慧稻渔种养基础。", suggestion: "建议发展智慧稻作和生态水产综合种养，配套初加工仓储和农业物联网平台，拓展农事研学及田园体验，建设可复制的数字农业样板。", sceneryImage: imageUrl("Aerial view of rice and fish integrated farming fields in Anhui Yangtze River plain, green rice paddies with water channels, flat farmland under blue sky, agricultural documentary photography, no text, no watermark"), contact: "东联镇农业招商专员 周先生", phone: "0562-823****" },
  { id: "shunan-commercial", name: "顺安城市会客厅商业配套项目", town: "顺安镇", category: "商业配套", status: "规划招商", scene: "顺安镇核心片区现有闲置商业用地约 45 亩、可改造沿街商铺 60 间，周边居住社区和产业园集中，城市道路通达性良好，具备复合商业开发条件。", suggestion: "建议引进品质餐饮、亲子娱乐和生活零售业态，建设城市展厅与共享办公空间，补齐区域消费配套，强化顺安东部综合服务节点功能。", sceneryImage: imageUrl("Modern Chinese town commercial street in Shunan Anhui with clean pedestrian walkway, shops, green trees, urban living room concept, warm afternoon light, architectural documentary photography, no text, no watermark"), contact: "义安区商务局投资服务专员 许女士", phone: "0562-882****" },
];
type VillagerSection = "村民首页" | "村务服务" | "积分超市" | "我要发布" | "我的";
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
  { id: "M-001", name: "义安区政务服务中心广场", area: "五松镇", village: "荷花塘社区", scenic: "全区点位", status: "在线", scene: "square", targets: ["人", "车", "异常聚集"], mapX: 34, mapY: 24 },
  { id: "M-006", name: "五松城区滨河步道", area: "五松镇", village: "惠泉社区", scenic: "全区点位", status: "在线", scene: "river", targets: ["人", "非机动车", "溺水"], mapX: 25, mapY: 34 },
  { id: "M-011", name: "笠帽山公园北入口", area: "五松镇", village: "城东村", scenic: "全区点位", status: "维护", scene: "mountain", targets: ["人", "烟火", "危险行为"], mapX: 42, mapY: 36 },
  { id: "M-016", name: "顺安老街东入口", area: "顺安镇", village: "东垅村", scenic: "全区点位", status: "在线", scene: "gate", targets: ["人", "车", "异常聚集"], mapX: 62, mapY: 46 },
  { id: "M-021", name: "凤凰山登山步道", area: "顺安镇", village: "凤凰山村", scenic: "凤凰山景区", status: "在线", scene: "mountain", targets: ["人", "动物", "危险行为"], mapX: 75, mapY: 64 },
  { id: "M-026", name: "东湖湿地观景台", area: "顺安镇", village: "盛瑶村", scenic: "全区点位", status: "维护", scene: "wetland", targets: ["动物", "人", "烟火"], mapX: 69, mapY: 36 },
  { id: "M-031", name: "永泉小镇游客中心", area: "钟鸣镇", village: "水龙村", scenic: "永泉小镇", status: "在线", scene: "square", targets: ["人", "车", "异常聚集"], mapX: 82, mapY: 31 },
  { id: "M-036", name: "梧桐花谷停车场", area: "钟鸣镇", village: "牡东村", scenic: "全区点位", status: "在线", scene: "gate", targets: ["人", "车", "逆行"], mapX: 88, mapY: 42 },
  { id: "M-041", name: "龙潭肖古村入口", area: "钟鸣镇", village: "龙潭肖村", scenic: "全区点位", status: "维护", scene: "mountain", targets: ["人", "车", "烟火"], mapX: 82, mapY: 53 },
  { id: "M-046", name: "天门镇综合文化广场", area: "天门镇", village: "天门村", scenic: "全区点位", status: "在线", scene: "square", targets: ["人", "车", "异常聚集"], mapX: 57, mapY: 76 },
  { id: "M-051", name: "天门山村道入口", area: "天门镇", village: "五峰村", scenic: "全区点位", status: "在线", scene: "mountain", targets: ["人", "车", "落石"], mapX: 68, mapY: 83 },
  { id: "M-056", name: "白姜种植基地北区", area: "天门镇", village: "高联村", scenic: "全区点位", status: "维护", scene: "wetland", targets: ["人", "车", "烟火"], mapX: 48, mapY: 87 },
  { id: "M-061", name: "东联镇沿江堤防入口", area: "东联镇", village: "毛桥村", scenic: "全区点位", status: "在线", scene: "river", targets: ["人", "车", "越界"], mapX: 60, mapY: 19 },
  { id: "M-066", name: "永丰圩农业示范区", area: "东联镇", village: "永丰村", scenic: "全区点位", status: "在线", scene: "wetland", targets: ["人", "车", "烟火"], mapX: 72, mapY: 23 },
  { id: "M-071", name: "东联客运站路口", area: "东联镇", village: "莲湖村", scenic: "全区点位", status: "维护", scene: "square", targets: ["人", "车", "逆行"], mapX: 67, mapY: 29 },
  { id: "M-076", name: "犁桥水镇主入口", area: "西联镇", village: "犁桥村", scenic: "犁桥水镇", status: "在线", scene: "gate", targets: ["人", "车", "异常聚集"], mapX: 34, mapY: 47 },
  { id: "M-081", name: "犁桥水镇水岸街区", area: "西联镇", village: "钟仓村", scenic: "犁桥水镇", status: "在线", scene: "water", targets: ["人", "溺水", "危险行为"], mapX: 28, mapY: 54 },
  { id: "M-086", name: "西联圩区泵站路口", area: "西联镇", village: "姚汪村", scenic: "全区点位", status: "维护", scene: "river", targets: ["人", "车", "水位"], mapX: 39, mapY: 60 },
  { id: "M-091", name: "胥坝渡口候船区", area: "胥坝乡", village: "胥坝村", scenic: "全区点位", status: "在线", scene: "river", targets: ["人", "车", "溺水"], mapX: 17, mapY: 48 },
  { id: "M-096", name: "胥坝江心洲堤岸", area: "胥坝乡", village: "旭光村", scenic: "全区点位", status: "在线", scene: "water", targets: ["人", "水位", "越界"], mapX: 14, mapY: 61 },
  { id: "M-101", name: "胥坝乡政府广场", area: "胥坝乡", village: "群心村", scenic: "全区点位", status: "维护", scene: "square", targets: ["人", "车", "异常聚集"], mapX: 22, mapY: 70 },
  { id: "M-106", name: "老洲太阳岛入口", area: "老洲乡", village: "太阳村", scenic: "全区点位", status: "在线", scene: "gate", targets: ["人", "车", "异常聚集"], mapX: 30, mapY: 76 },
  { id: "M-111", name: "老洲湿地观鸟台", area: "老洲乡", village: "老洲村", scenic: "全区点位", status: "在线", scene: "wetland", targets: ["人", "动物", "烟火"], mapX: 20, mapY: 84 },
  { id: "M-116", name: "老洲长江堤防巡查点", area: "老洲乡", village: "成德村", scenic: "全区点位", status: "维护", scene: "river", targets: ["人", "水位", "越界"], mapX: 35, mapY: 89 },
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
  { name: "积分超市", detail: "使用参与乡村事务获得的积分兑换商品", icon: ShoppingBag, group: "积分超市", accent: "积分兑换" },
  { name: "议事投票", detail: "参与村务投票和公共决策，完成后获得积分", icon: UserRound, group: "村务服务", accent: "共商共议" },
  { name: "我的货摊", detail: "发布自家农产品，审核通过后展示至义安好物", icon: Store, group: "我要发布", accent: "村民发布" },
  { name: "农房盘活", detail: "发布农房出租、改造需求，参与乡村资源盘活", icon: HomeIcon, group: "我要发布", accent: "资源盘活" },
  { name: "课程培训", detail: "参与农业、电商等培训课程，学习并获得积分", icon: Compass, group: "村务服务", accent: "学习得分" },
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

function imageUrl(prompt: string) {
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`;
}

const villagePublicArticles = [
  { type: "村务公开", title: "顺安镇六月村级财务收支公示", date: "2026-07-25", summary: "公开村集体经营收入、公益支出及重点项目资金使用情况。", image: imageUrl("Documentary photography of a clean Chinese village service center public information board, villagers reading financial disclosure notices, Anhui countryside, warm daylight, realistic, no text, no watermark") },
  { type: "通知公告", title: "关于开展人居环境集中整治的通知", date: "2026-07-22", summary: "本周六开展村庄清洁志愿行动，参与村民可获得共建积分。", image: imageUrl("Chinese rural villagers and volunteers cleaning a beautiful village lane together, green trees and white houses, community participation, realistic documentary photography, no text, no watermark") },
  { type: "项目进展", title: "村口闲置地改造项目进入方案票选", date: "2026-07-19", summary: "三套改造方案已完成公示，邀请全体村民参与线上表决。", image: imageUrl("Renovated village public garden in Anhui China, walking path, benches, native trees, villagers discussing community planning, realistic architectural documentary photography, no text, no watermark") },
];
const villageSubsidies = [
  { title: "2026年高标准农田建设补助", deadline: "08月20日截止", amount: "最高 2万元", status: "可申领", department: "义安区农业农村局", target: "在义安区依法开展粮食种植，且纳入高标准农田建设范围的农户、家庭农场或合作社。", conditions: ["申报主体信用状况良好，无违法违规用地记录", "项目地块权属清晰，具备连续稳定经营条件", "建设内容符合农田水利、土壤改良等补助方向"], materials: ["申请人身份证及村民认证信息", "土地承包或流转证明", "建设内容、预算及地块现状照片", "银行卡或对公账户信息"], process: ["线上填写申请", "村级初审与现场核实", "镇级复核并公示", "区级审核后拨付资金"], phone: "0562-8812365", reviewTime: "材料齐全后15个工作日内完成审核" },
  { title: "农村电商创业扶持补贴", deadline: "长期受理", amount: "最高 1万元", status: "可申领", department: "义安区商务局", target: "在义安区开展农产品电商、直播带货或乡村数字服务的创业个人和经营主体。", conditions: ["经营主体注册地及实际经营场所在义安区", "持续经营满3个月并有真实线上交易记录", "主营业务与本地农产品、文旅或乡村服务相关"], materials: ["营业执照或创业主体证明", "平台店铺及近3个月交易记录", "经营场地照片和项目说明", "费用发票及收款账户信息"], process: ["提交创业信息", "经营数据核验", "现场走访评估", "公示通过后发放补贴"], phone: "0562-8871058", reviewTime: "每月集中审核一次" },
  { title: "特色种养产业奖补", deadline: "09月15日截止", amount: "按规模核定", status: "材料准备", department: "义安区农业农村局", target: "发展白姜、凤丹、稻渔综合种养、特色果蔬等优势产业的农户及新型农业经营主体。", conditions: ["种养项目位于义安区行政区域内", "达到当年度产业奖补最低规模要求", "生产记录完整，质量安全管理符合要求"], materials: ["种养主体身份证明", "土地及养殖水面使用证明", "生产规模台账和现场照片", "村级出具的项目真实性证明"], process: ["准备材料并线上预填", "村镇核验生产规模", "主管部门组织验收", "按核定标准发放奖补"], phone: "0562-8812086", reviewTime: "申报截止后统一验收核定" },
];
const villageJobs = [
  { title: "农产品直播运营", company: "义安乡创中心", salary: "4000—6000元/月", tag: "本地就业", image: imageUrl("Young Chinese rural ecommerce presenter livestreaming local farm products in a modern village studio, rice and tea products on table, realistic photography, no text, no watermark"), location: "顺安镇乡创服务中心", employment: "全职 · 单休", openings: 2, deadline: "2026-08-31", requirements: ["18—40周岁，高中及以上学历", "熟悉短视频或直播平台基础操作", "表达自然，愿意学习本地农产品知识", "有电商运营、拍摄剪辑经验者优先"], duties: ["负责义安农产品直播讲解与日常运营", "策划短视频选题并配合完成拍摄剪辑", "维护线上店铺商品、订单及用户咨询", "整理直播数据并参与营销活动复盘"], benefits: ["缴纳社会保险", "提供岗前培训", "绩效提成", "节日福利"], contact: "义安乡创中心招聘组", phone: "0562-8896016" },
  { title: "民宿管家", company: "犁桥水镇民宿", salary: "3500—5000元/月", tag: "提供培训", image: imageUrl("Friendly Chinese homestay manager preparing an elegant guest room in a Jiangnan water town boutique inn, warm natural light, realistic hospitality photography, no text, no watermark"), location: "西联镇犁桥水镇", employment: "全职 · 排班制", openings: 4, deadline: "2026-08-20", requirements: ["18—45周岁，身体健康", "服务意识良好，普通话表达清晰", "能够适应周末及节假日排班", "有酒店、民宿或餐饮服务经验者优先"], duties: ["办理住客接待、入住和退房服务", "介绍水镇游览路线与周边配套", "检查客房卫生和设施使用情况", "处理住客需求并做好值班交接"], benefits: ["免费岗前培训", "工作餐", "员工住宿补贴", "旺季绩效奖励"], contact: "犁桥水镇人事服务处", phone: "0562-8873168" },
  { title: "农业技术员", company: "铜勤生态农业", salary: "5000—7000元/月", tag: "五险", image: imageUrl("Chinese agricultural technician inspecting healthy rice plants in a green paddy field with a tablet, Anhui countryside, realistic professional photography, no text, no watermark"), location: "东联镇永丰农业示范区", employment: "全职 · 双休轮值", openings: 1, deadline: "2026-09-10", requirements: ["农学、植保、园艺等相关专业大专及以上学历", "掌握常见作物病虫害识别与防治方法", "能够开展田间巡查、数据记录和技术培训", "持农技推广或植保相关证书者优先"], duties: ["制定水稻及特色作物田间管理计划", "开展病虫害监测并提出防治方案", "指导农户规范使用农资和生产设备", "建立生产档案并协助质量追溯"], benefits: ["五险", "交通补贴", "专业培训", "年度体检"], contact: "铜勤生态农业综合部", phone: "0562-8857290" },
];
type PointsCategory = "生活用品" | "农资用品" | "地方好物" | "文创礼品";
type PointsGood = {
  id: string;
  name: string;
  points: number;
  stock: number;
  category: PointsCategory;
  image: string;
  description: string;
  specification: string;
  limit: number;
  validUntil: string;
  listedAt: string;
};
type PointsOrderStatus = "待领取" | "已领取" | "已过期";
type PointsOrder = {
  id: string;
  goodId: string;
  productName: string;
  productImage: string;
  specification: string;
  quantity: number;
  points: number;
  pickupPoint: string;
  pickupAddress: string;
  phone: string;
  pickupDate: string;
  verifyCode: string;
  createdAt: string;
  validUntil: string;
  status: PointsOrderStatus;
};
type PointsTransaction = { id: string; title: string; points: number; createdAt: string };
type VillagerDetail = { type: string; title: string; data?: string; id?: string; orderId?: string };

const POINTS_BALANCE_KEY = "yian-villager-points-balance";
const POINTS_STOCK_KEY = "yian-villager-points-stock";
const POINTS_ORDERS_KEY = "yian-villager-points-orders";
const POINTS_TRANSACTIONS_KEY = "yian-villager-points-transactions";
const pickupPoints = [
  { name: "顺安镇村民服务中心", address: "顺安镇顺凤路16号" },
  { name: "东垅村党群服务中心", address: "顺安镇东垅村中心路8号" },
  { name: "顺安镇便民服务站", address: "顺安镇临津路与东正大道交叉口" },
] as const;
const initialPointsTransactions: PointsTransaction[] = [
  { id: "seed-vote", title: "参与闲置地改造投票", points: 30, createdAt: "2026-07-25T16:35:00+08:00" },
  { id: "seed-course", title: "完成电商基础课程", points: 50, createdAt: "2026-07-20T10:20:00+08:00" },
  { id: "seed-suggestion", title: "民情建议被采纳", points: 100, createdAt: "2026-07-16T09:10:00+08:00" },
];

const pointsGoods: PointsGood[] = [
  { id: "pg-rice-5kg", name: "义安生态大米 5kg", points: 680, stock: 24, category: "地方好物", description: "义安本地生态稻田出产，米粒饱满，适合家庭日常食用。", specification: "5kg / 袋", limit: 2, validUntil: "2026-12-31", listedAt: "2026-07-28", image: imageUrl("Premium bag of Anhui Yian rice with a wooden bowl of polished rice, green rice fields, commercial product photography, no text, no watermark") },
  { id: "pg-clean-set", name: "家用清洁套装", points: 520, stock: 36, category: "生活用品", description: "包含洗衣液、洗洁精和多用途清洁剂，满足家庭日常清洁。", specification: "3件 / 套", limit: 2, validUntil: "2026-11-30", listedAt: "2026-07-26", image: imageUrl("Eco friendly household cleaning set on cream background with green leaves, realistic product photography, no text, no watermark") },
  { id: "pg-towel", name: "纯棉毛巾三件套", points: 260, stock: 48, category: "生活用品", description: "柔软吸水的纯棉毛巾组合，适合全家日常使用。", specification: "面巾 3条 / 盒", limit: 3, validUntil: "2027-01-31", listedAt: "2026-07-24", image: imageUrl("Three folded premium cotton towels in warm cream and green colors, product photography, no text, no watermark") },
  { id: "pg-thermos", name: "便携保温杯", points: 450, stock: 0, category: "生活用品", description: "轻巧便携的不锈钢保温杯，杯盖防漏，适合出行携带。", specification: "500ml / 个", limit: 1, validUntil: "2027-02-28", listedAt: "2026-07-22", image: imageUrl("Elegant green stainless steel thermos bottle on warm beige background, product photography, no text, no watermark") },
  { id: "pg-fertilizer", name: "有机蔬菜肥", points: 380, stock: 30, category: "农资用品", description: "适用于家庭菜园和露地蔬菜的颗粒有机肥，使用方便。", specification: "2kg / 袋", limit: 3, validUntil: "2026-10-31", listedAt: "2026-07-27", image: imageUrl("Bag of organic vegetable fertilizer beside healthy green seedlings, agricultural product photography, no text, no watermark") },
  { id: "pg-gloves", name: "耐磨农事手套", points: 160, stock: 65, category: "农资用品", description: "防滑耐磨，适合田间劳作、园艺修剪和日常搬运。", specification: "2双 / 组", limit: 4, validUntil: "2027-03-31", listedAt: "2026-07-20", image: imageUrl("Durable farming work gloves beside garden tools, clean commercial product photography, no text, no watermark") },
  { id: "pg-shears", name: "园艺修枝剪", points: 420, stock: 18, category: "农资用品", description: "锋利省力的园艺剪，适合果树、花木和庭院枝条修剪。", specification: "标准款 / 把", limit: 1, validUntil: "2027-03-31", listedAt: "2026-07-18", image: imageUrl("Professional pruning shears with fresh garden branches, agricultural tool photography, no text, no watermark") },
  { id: "pg-seed-pack", name: "四季蔬菜种子包", points: 220, stock: 42, category: "农资用品", description: "精选适合本地气候的时令蔬菜种子，附简易播种说明。", specification: "6种 / 盒", limit: 2, validUntil: "2026-09-30", listedAt: "2026-07-25", image: imageUrl("Assorted vegetable seed packets with fresh vegetables and soil, product photography, no text, no watermark") },
  { id: "pg-ginger", name: "铜陵白姜礼盒", points: 760, stock: 15, category: "地方好物", description: "精选铜陵白姜制品，清脆爽口，是具有义安特色的地方礼物。", specification: "糖醋姜 6瓶 / 盒", limit: 2, validUntil: "2026-10-15", listedAt: "2026-07-29", image: imageUrl("Elegant Tongling white ginger gift box with preserved ginger jars, Anhui specialty photography, no text, no watermark") },
  { id: "pg-candy", name: "顺安酥糖礼袋", points: 320, stock: 33, category: "地方好物", description: "芝麻桂花香浓郁，口感酥松，是顺安经典传统风味。", specification: "400g / 袋", limit: 3, validUntil: "2026-09-30", listedAt: "2026-07-23", image: imageUrl("Traditional Shunan sesame flaky candy in elegant paper gift bag, food photography, no text, no watermark") },
  { id: "pg-noodles", name: "山芋粉丝家庭装", points: 360, stock: 27, category: "地方好物", description: "本地山芋淀粉制作，柔韧耐煮，适合炖菜和火锅。", specification: "1.5kg / 袋", limit: 2, validUntil: "2026-12-20", listedAt: "2026-07-19", image: imageUrl("Traditional sweet potato glass noodles in woven basket, Anhui rural product photography, no text, no watermark") },
  { id: "pg-bookmark", name: "铜韵书签礼盒", points: 580, stock: 20, category: "文创礼品", description: "以古铜都青铜纹饰为灵感的精致金属书签，兼具纪念与实用价值。", specification: "书签 2枚 / 盒", limit: 2, validUntil: "2027-06-30", listedAt: "2026-07-29", image: imageUrl("Refined copper bookmarks with ancient Chinese bronze patterns in gift box, cultural product photography, no text, no watermark") },
  { id: "pg-water-town", name: "犁桥水镇帆布袋", points: 300, stock: 38, category: "文创礼品", description: "水乡主题日常帆布袋，容量充足，适合买菜、通勤和旅行。", specification: "米白色 / 个", limit: 2, validUntil: "2027-06-30", listedAt: "2026-07-21", image: imageUrl("Elegant cream canvas tote bag inspired by Jiangnan water town, green line art style without readable text, product photography") },
  { id: "pg-peony", name: "凤丹花香囊", points: 240, stock: 50, category: "文创礼品", description: "以凤凰山凤丹文化为主题，香气淡雅，适合随身或居家悬挂。", specification: "手作香囊 / 个", limit: 3, validUntil: "2026-12-31", listedAt: "2026-07-17", image: imageUrl("Handmade Chinese peony scented sachet with elegant embroidery, cultural gift photography, no text, no watermark") },
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
  const [touristQuickService, setTouristQuickService] = useState<TouristQuickService | null>(null);
  const [investmentView, setInvestmentView] = useState<InvestmentView | null>(null);
  const [investmentCategory, setInvestmentCategory] = useState<"全部" | InvestmentCategory>("全部");
  const [selectedInvestmentProject, setSelectedInvestmentProject] = useState<InvestmentProject | null>(null);
  const [investmentLeads, setInvestmentLeads] = useState<InvestmentLead[]>(() => {
    try { return JSON.parse(localStorage.getItem(INVESTMENT_LEADS_KEY) || "[]") as InvestmentLead[]; } catch { return []; }
  });
  const [activeSection, setActiveSection] = useState<MainSection>("智慧导览");
  const [selectedCharmTown, setSelectedCharmTown] = useState<TownDetail | null>(null);
  const [activeCharmCategory, setActiveCharmCategory] = useState<TownDetailTab>("镇情概览");
  const [activeTravelCategory, setActiveTravelCategory] = useState<TravelCategory>("景点");
  const [selectedTravelItem, setSelectedTravelItem] = useState<SelectedTravelItem | null>(null);
  const [selectedGood, setSelectedGood] = useState<YianGood | null>(null);
  const [goodsSearch, setGoodsSearch] = useState("");
  const [goodsSourceFilter, setGoodsSourceFilter] = useState<GoodsSourceFilter>("全部");
  const [goodsCategoryFilter, setGoodsCategoryFilter] = useState("全部");
  const [checkoutGood, setCheckoutGood] = useState<YianGood | null>(null);
  const [goodsQuantity, setGoodsQuantity] = useState(1);
  const [goodsDelivery, setGoodsDelivery] = useState<GoodsDelivery>("快递配送");
  const [goodsForm, setGoodsForm] = useState<GoodsForm>({ receiver: "", phone: "", region: "", address: "", message: "" });
  const [goodsErrors, setGoodsErrors] = useState<GoodsFormErrors>({});
  const [goodsOrders, setGoodsOrders] = useState<GoodsOrder[]>(() => {
    try { return JSON.parse(localStorage.getItem(GOODS_ORDERS_KEY) || "[]") as GoodsOrder[]; } catch { return []; }
  });
  const [activeGoodsOrder, setActiveGoodsOrder] = useState<GoodsOrder | null>(() => {
    try { return (JSON.parse(localStorage.getItem(GOODS_ORDERS_KEY) || "[]") as GoodsOrder[])[0] || null; } catch { return null; }
  });
  const [goodsOrderView, setGoodsOrderView] = useState<"checkout" | "success" | null>(null);
  const [personalRecordView, setPersonalRecordView] = useState<PersonalRecordView>(null);
  const [favoriteGoods, setFavoriteGoods] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(GOODS_FAVORITES_KEY) || "[]") as string[]; } catch { return []; }
  });
  const [browsingHistory, setBrowsingHistory] = useState<BrowsingHistoryItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(BROWSING_HISTORY_KEY) || "[]") as BrowsingHistoryItem[]; } catch { return []; }
  });
  const [userRole, setUserRole] = useState<UserRole>("游客");
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [governmentSection, setGovernmentSection] = useState<GovernmentSection>("政务首页");
  const [governmentScenicId, setGovernmentScenicId] = useState<(typeof governmentScenics)[number]["id"]>(governmentScenics[0].id);
  const [selectedMonitorId, setSelectedMonitorId] = useState<string>(monitorPoints[0].id);
  const [selectedMonitorRegion, setSelectedMonitorRegion] = useState<string>(`town::${monitorPoints[0].area}`);
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
  const [villagerDetail, setVillagerDetail] = useState<VillagerDetail | null>(null);
  const [pointsBalance, setPointsBalance] = useState(() => Number(localStorage.getItem(POINTS_BALANCE_KEY) || 1280));
  const [pointsStocks, setPointsStocks] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem(POINTS_STOCK_KEY) || "{}") as Record<string, number>; } catch { return {}; }
  });
  const [pointsOrders, setPointsOrders] = useState<PointsOrder[]>(() => {
    try { return JSON.parse(localStorage.getItem(POINTS_ORDERS_KEY) || "[]") as PointsOrder[]; } catch { return []; }
  });
  const [pointsTransactions, setPointsTransactions] = useState<PointsTransaction[]>(() => {
    try { const saved = JSON.parse(localStorage.getItem(POINTS_TRANSACTIONS_KEY) || "null") as PointsTransaction[] | null; return saved || initialPointsTransactions; } catch { return initialPointsTransactions; }
  });
  const [pointsSearch, setPointsSearch] = useState("");
  const [pointsCategory, setPointsCategory] = useState<"全部" | PointsCategory>("全部");
  const [pointsRange, setPointsRange] = useState("全部积分");
  const [pointsSort, setPointsSort] = useState("综合");
  const [exchangeQuantity, setExchangeQuantity] = useState(1);
  const [exchangeForm, setExchangeForm] = useState<{ pickupPoint: string; pickupDate: string; phone: string; agreed: boolean }>({ pickupPoint: pickupPoints[0].name, pickupDate: "", phone: "", agreed: false });
  const [exchangeErrors, setExchangeErrors] = useState<string[]>([]);
  const [exchangeConfirming, setExchangeConfirming] = useState(false);
  const [pointsOrderFilter, setPointsOrderFilter] = useState<"全部" | PointsOrderStatus>("全部");
  const [villagerPublications, setVillagerPublications] = useState<VillagerPublication[]>(() => {
    try { return JSON.parse(localStorage.getItem(VILLAGER_PUBLICATIONS_KEY) || "[]") as VillagerPublication[]; } catch { return []; }
  });
  const [publicationImages, setPublicationImages] = useState<string[]>([]);
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

  const recordBrowsingHistory = (type: BrowsingHistoryItem["type"], id: string) => {
    setBrowsingHistory((current) => {
      const next = [{ type, id, viewedAt: new Date().toISOString() }, ...current.filter((item) => !(item.type === type && item.id === id))].slice(0, 100);
      localStorage.setItem(BROWSING_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const openGood = (good: YianGood) => {
    setSelectedGood(good);
    recordBrowsingHistory("good", good.name);
  };

  const openSpot = (spot: ScenicSpot) => {
    takeOverAnimation();
    setSelectedSpot(spot);
    setSelectedCharmTown(null);
    setActiveTab("介绍");
    recordBrowsingHistory("spot", spot.id);
  };

  const openTown = (town: TownDetail) => {
    takeOverAnimation();
    setSelectedSpot(null);
    setSelectedCharmTown(town);
    setActiveCharmCategory("镇情概览");
    recordBrowsingHistory("town", town.id);
  };

  const renderDetail = () => {
    if (!selectedSpot) return null;
    const guide = getSpotGuideContent(selectedSpot);
    const navigationUrl = (keyword: string) => `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}&callnative=1`;
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
    if (activeTab === "攻略") {
      return (
        <div className="guide-story-list">
          {guide.strategy.map((item, index) => (
            <article className="guide-story-card" key={item.label}>
              <img src={imageUrl(`${selectedSpot.name} travel guide scene in Yian District Anhui China, ${item.label}, ${index === 0 ? "tourists walking through the main scenic route" : index === 1 ? "beautiful landscape in the best visiting season" : index === 2 ? "family and senior friendly leisure travel" : index === 3 ? "practical outdoor travel equipment and comfortable clothing" : "calm off peak scenic area with clear visitor guidance"}, realistic premium travel photography, natural light, no text, no watermark`)} alt={`${selectedSpot.name}${item.label}`} loading="lazy" decoding="async" />
              <div><small>{item.label}</small><strong>{item.value}</strong><p>{index === 0 ? "合理安排停留时间，预留拍照、休息和体验项目的时间，让游览节奏更加从容。" : index === 1 ? "结合季节、光线和景区特色选择出发时段，更容易欣赏到理想景色。" : index === 2 ? "可根据同行人员的体力与兴趣调整路线，优先选择舒适、安全的游览区域。" : index === 3 ? "建议准备轻便鞋履、防晒用品和饮水，出发前关注当天温度及降雨变化。" : "节假日建议提前到达并避开集中入园时段，现场请服从停车和客流引导。"}</p></div>
            </article>
          ))}
        </div>
      );
    }
    if (activeTab === "路线") {
      return (
        <div className="tour-route-list">
          {guide.routes.map((route) => (
            <article className="tour-route-card" key={route.name}>
              <header><div><small>推荐路线</small><h3>{route.name}</h3></div><span>{route.meta}</span></header>
              <ol>{route.steps.map((step, index) => <li key={`${route.name}-${step.name}`}><i>{index + 1}</i><div><strong>{step.name}</strong><small>{step.info}</small></div></li>)}</ol>
            </article>
          ))}
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
    if (activeTab === "打卡") {
      return (
        <div className="photo-spot-list">
          {guide.photoSpots.map((item) => (
            <article className="photo-spot-card" key={item.name}>
              <div><small>推荐机位</small><h3>{item.name}</h3><dl><div><dt>最佳时间</dt><dd>{item.time}</dd></div><div><dt>拍摄建议</dt><dd>{item.tip}</dd></div></dl></div>
              <a href={navigationUrl(`${selectedSpot.mapKeyword} ${item.name}`)} target="_blank" rel="noreferrer">导航到机位</a>
            </article>
          ))}
        </div>
      );
    }
    if (activeTab === "周边") {
      return (
        <div className="nearby-grid">
          {guide.nearby.map((item) => (
            <article className="nearby-card" key={item.category}>
              <small>{item.category}</small><h3>{item.name}</h3><p>{item.detail}</p>
              <a href={navigationUrl(item.keyword)} target="_blank" rel="noreferrer">地图导航</a>
            </article>
          ))}
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

  const openVillagerDetail = (type: string, title: string, data?: string, extra?: Partial<VillagerDetail>) => setVillagerDetail({ type, title, data, ...extra });
  const stockFor = (good: PointsGood) => pointsStocks[good.id] ?? good.stock;
  const openPointsGood = (good: PointsGood) => {
    setExchangeQuantity(1);
    setExchangeErrors([]);
    setExchangeConfirming(false);
    setVillagerDetail({ type: "points-good", title: good.name, id: good.id });
  };
  const openPointsOrders = () => {
    setPointsOrderFilter("全部");
    setVillagerDetail({ type: "points-orders", title: "我的兑换" });
  };
  const beginPointsCheckout = (good: PointsGood) => {
    setExchangeErrors([]);
    setExchangeConfirming(false);
    setVillagerDetail({ type: "points-checkout", title: "确认兑换", id: good.id });
  };
  const validatePointsExchange = (good: PointsGood) => {
    const errors: string[] = [];
    const stock = stockFor(good);
    const priorQuantity = pointsOrders.filter((order) => order.goodId === good.id).reduce((sum, order) => sum + order.quantity, 0);
    if (exchangeQuantity < 1 || exchangeQuantity > stock) errors.push("兑换数量超过当前库存");
    if (priorQuantity + exchangeQuantity > good.limit) errors.push(`每人累计限兑 ${good.limit} 件，您已兑换 ${priorQuantity} 件`);
    if (good.points * exchangeQuantity > pointsBalance) errors.push("可用积分不足，请调整兑换数量");
    if (!exchangeForm.pickupPoint) errors.push("请选择自提点");
    if (!exchangeForm.pickupDate) errors.push("请选择领取日期");
    if (!/^1[3-9]\d{9}$/.test(exchangeForm.phone)) errors.push("请输入正确的11位联系电话");
    if (!exchangeForm.agreed) errors.push("请阅读并同意兑换规则");
    setExchangeErrors(errors);
    return errors.length === 0;
  };
  const submitPointsExchange = (good: PointsGood) => {
    if (!validatePointsExchange(good)) { setExchangeConfirming(false); return; }
    const pickup = pickupPoints.find((item) => item.name === exchangeForm.pickupPoint) || pickupPoints[0];
    const total = good.points * exchangeQuantity;
    const createdAt = new Date().toISOString();
    const order: PointsOrder = {
      id: `YD${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}${Math.floor(100 + Math.random() * 900)}`,
      goodId: good.id, productName: good.name, productImage: good.image, specification: good.specification,
      quantity: exchangeQuantity, points: total, pickupPoint: pickup.name, pickupAddress: pickup.address,
      phone: exchangeForm.phone, pickupDate: exchangeForm.pickupDate, verifyCode: String(Math.floor(100000 + Math.random() * 900000)),
      createdAt, validUntil: good.validUntil, status: "待领取",
    };
    const nextBalance = pointsBalance - total;
    const nextStocks = { ...pointsStocks, [good.id]: stockFor(good) - exchangeQuantity };
    const nextOrders = [order, ...pointsOrders];
    const nextTransactions = [{ id: `exchange-${order.id}`, title: `兑换${good.name} ×${exchangeQuantity}`, points: -total, createdAt }, ...pointsTransactions];
    setPointsBalance(nextBalance); setPointsStocks(nextStocks); setPointsOrders(nextOrders); setPointsTransactions(nextTransactions);
    localStorage.setItem(POINTS_BALANCE_KEY, String(nextBalance));
    localStorage.setItem(POINTS_STOCK_KEY, JSON.stringify(nextStocks));
    localStorage.setItem(POINTS_ORDERS_KEY, JSON.stringify(nextOrders));
    localStorage.setItem(POINTS_TRANSACTIONS_KEY, JSON.stringify(nextTransactions));
    setExchangeConfirming(false);
    setVillagerDetail({ type: "points-success", title: "兑换成功", orderId: order.id });
  };

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
    if (type === "points-good") {
      const good = pointsGoods.find((item) => item.id === villagerDetail.id);
      if (!good) return null;
      const stock = stockFor(good);
      const priorQuantity = pointsOrders.filter((order) => order.goodId === good.id).reduce((sum, order) => sum + order.quantity, 0);
      const maxQuantity = Math.max(0, Math.min(stock, good.limit - priorQuantity));
      const total = good.points * exchangeQuantity;
      return <div className="points-detail-view"><img className="points-detail-image" src={good.image} alt={good.name} /><section className="points-detail-card"><span>{good.category}</span><h1>{good.name}</h1><p>{good.description}</p><strong>{good.points.toLocaleString()} <small>积分 / 件</small></strong><dl><div><dt>商品规格</dt><dd>{good.specification}</dd></div><div><dt>当前库存</dt><dd>{stock} 件</dd></div><div><dt>每人限兑</dt><dd>{good.limit} 件{priorQuantity ? `（已兑${priorQuantity}件）` : ""}</dd></div><div><dt>兑换有效期</dt><dd>{good.validUntil}</dd></div><div><dt>领取方式</dt><dd>仅限所选服务点自提</dd></div></dl><div className="points-quantity-row"><span>兑换数量</span><div><button type="button" disabled={exchangeQuantity <= 1} onClick={() => setExchangeQuantity((value) => Math.max(1, value - 1))}>−</button><b>{exchangeQuantity}</b><button type="button" disabled={exchangeQuantity >= maxQuantity} onClick={() => setExchangeQuantity((value) => Math.min(maxQuantity, value + 1))}>＋</button></div></div><div className={`points-total ${total > pointsBalance ? "is-insufficient" : ""}`}><span>合计</span><strong>{total.toLocaleString()} 积分</strong><small>{total > pointsBalance ? `积分不足，还差 ${(total - pointsBalance).toLocaleString()} 分` : `兑换后剩余 ${(pointsBalance - total).toLocaleString()} 分`}</small></div><button type="button" disabled={!maxQuantity || total > pointsBalance} onClick={() => beginPointsCheckout(good)}>{stock ? "立即兑换" : "已售罄"}</button><p className="points-pickup-note">自提说明：兑换后请按预约日期，携带手机核销码到所选服务点领取。商品不提供配送。</p></section></div>;
    }
    if (type === "points-checkout") {
      const good = pointsGoods.find((item) => item.id === villagerDetail.id);
      if (!good) return null;
      const total = good.points * exchangeQuantity;
      const minDate = new Date().toISOString().slice(0, 10);
      return <div className="points-checkout-view"><section className="points-checkout-product"><img src={good.image} alt={good.name} /><div><small>{good.category}</small><h2>{good.name}</h2><p>{good.specification} · ×{exchangeQuantity}</p></div><strong>{total.toLocaleString()}积分</strong></section><section className="points-checkout-card"><h2>选择服务点自提</h2><div className="points-pickup-options">{pickupPoints.map((point) => <label key={point.name} className={exchangeForm.pickupPoint === point.name ? "is-active" : ""}><input type="radio" name="pickup" checked={exchangeForm.pickupPoint === point.name} onChange={() => setExchangeForm((form) => ({ ...form, pickupPoint: point.name }))} /><span><strong>{point.name}</strong><small>{point.address}</small></span></label>)}</div><label>领取日期<input type="date" min={minDate} max={good.validUntil} value={exchangeForm.pickupDate} onChange={(event) => setExchangeForm((form) => ({ ...form, pickupDate: event.target.value }))} /></label><label>联系电话<input type="tel" inputMode="numeric" maxLength={11} placeholder="用于领取提醒" value={exchangeForm.phone} onChange={(event) => setExchangeForm((form) => ({ ...form, phone: event.target.value.replace(/\D/g, "") }))} /></label><label className="points-rule-check"><input type="checkbox" checked={exchangeForm.agreed} onChange={(event) => setExchangeForm((form) => ({ ...form, agreed: event.target.checked }))} /><span>我已阅读并同意兑换规则：积分商品仅限本人到服务点核销领取，兑换成功后原则上不退换。</span></label>{exchangeErrors.length > 0 && <div className="points-errors">{exchangeErrors.map((error) => <p key={error}>{error}</p>)}</div>}<div className="points-checkout-summary"><span>可用积分 {pointsBalance.toLocaleString()}</span><strong>扣除 {total.toLocaleString()} 积分</strong></div>{exchangeConfirming ? <div className="points-second-confirm"><strong>请再次确认兑换</strong><p>将扣除 {total.toLocaleString()} 积分，并预约到 {exchangeForm.pickupPoint} 自提。</p><div><button type="button" onClick={() => setExchangeConfirming(false)}>再检查一下</button><button type="button" onClick={() => submitPointsExchange(good)}>确认扣分兑换</button></div></div> : <button type="button" onClick={() => { if (validatePointsExchange(good)) setExchangeConfirming(true); }}>提交兑换</button>}</section></div>;
    }
    if (type === "points-success") {
      const order = pointsOrders.find((item) => item.id === villagerDetail.orderId);
      if (!order) return null;
      return <div className="points-success-view"><div className="points-success-icon"><CheckCircle2 /></div><small>兑换订单 {order.id}</small><h1>兑换成功，等待领取</h1><p>请在预约日期前往服务点，向工作人员出示以下核销码。</p><section className="points-code-card"><span>6位核销码</span><strong>{order.verifyCode}</strong><small>请勿提前向他人透露</small></section><section className="points-success-info"><dl><div><dt>自提点</dt><dd>{order.pickupPoint}</dd></div><div><dt>地址</dt><dd>{order.pickupAddress}</dd></div><div><dt>领取日期</dt><dd>{order.pickupDate}</dd></div><div><dt>兑换截止</dt><dd>{order.validUntil}</dd></div></dl><a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(`铜陵义安区${order.pickupPoint}`)}&callnative=1`} target="_blank" rel="noreferrer"><Compass />地图导航</a></section><div className="points-success-actions"><button type="button" onClick={openPointsOrders}>查看兑换订单</button><button type="button" className="is-secondary" onClick={close}>返回积分超市</button></div></div>;
    }
    if (type === "points-orders") {
      const displayOrders = pointsOrders.map((order) => ({ ...order, displayStatus: order.status === "待领取" && order.validUntil < new Date().toISOString().slice(0, 10) ? "已过期" as const : order.status })).filter((order) => pointsOrderFilter === "全部" || order.displayStatus === pointsOrderFilter);
      return <div className="points-orders-view"><div className="villager-detail-hero"><small>积分超市</small><h2>我的兑换订单</h2><p>查看核销码、自提信息与兑换状态。本机订单已持久保存。</p></div><nav className="points-order-tabs">{(["全部", "待领取", "已领取", "已过期"] as const).map((status) => <button type="button" key={status} className={pointsOrderFilter === status ? "is-active" : ""} onClick={() => setPointsOrderFilter(status)}>{status}</button>)}</nav>{displayOrders.length ? <div className="points-order-list">{displayOrders.map((order) => <article key={order.id}><header><span className={`status-${order.displayStatus}`}>{order.displayStatus}</span><small>{new Date(order.createdAt).toLocaleString("zh-CN", { hour12: false })}</small></header><button type="button" onClick={() => setVillagerDetail({ type: "points-order-detail", title: "兑换订单详情", orderId: order.id })}><img src={order.productImage} alt={order.productName} /><div><h3>{order.productName}</h3><p>{order.pickupPoint}</p><small>截止 {order.validUntil} · ×{order.quantity}</small></div><strong>-{order.points}积分</strong></button></article>)}</div> : <div className="points-order-empty"><ShoppingBag /><strong>暂无{pointsOrderFilter === "全部" ? "兑换" : pointsOrderFilter}订单</strong><p>兑换成功的积分商品会显示在这里。</p></div>}</div>;
    }
    if (type === "points-order-detail") {
      const order = pointsOrders.find((item) => item.id === villagerDetail.orderId);
      if (!order) return null;
      const status = order.status === "待领取" && order.validUntil < new Date().toISOString().slice(0, 10) ? "已过期" : order.status;
      return <div className="points-order-detail"><div className="villager-detail-hero"><small>订单状态 · {status}</small><h2>{order.productName}</h2><p>订单号 {order.id}</p></div>{status === "待领取" && <section className="points-code-card"><span>到店核销码</span><strong>{order.verifyCode}</strong><small>请向服务点工作人员出示</small></section>}<section className="points-success-info"><dl><div><dt>商品规格</dt><dd>{order.specification} × {order.quantity}</dd></div><div><dt>扣除积分</dt><dd>{order.points.toLocaleString()} 积分</dd></div><div><dt>自提点</dt><dd>{order.pickupPoint}</dd></div><div><dt>自提地址</dt><dd>{order.pickupAddress}</dd></div><div><dt>联系电话</dt><dd>{order.phone}</dd></div><div><dt>领取日期</dt><dd>{order.pickupDate}</dd></div><div><dt>截止日期</dt><dd>{order.validUntil}</dd></div></dl>{status === "待领取" && <a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(`铜陵义安区${order.pickupPoint}`)}&callnative=1`} target="_blank" rel="noreferrer"><Compass />导航到自提点</a>}</section></div>;
    }
    if (type === "article" || type === "case" || type === "story") return <>{detailHero(type === "case" ? "先锋案例" : type === "story" ? "乡亲动态" : "村务公开", type === "story" ? "民情有回应，办理有结果，共建成果由全体村民共同见证。" : "信息公开透明，邀请每一位村民共同监督、共同参与。")}<article className="villager-article-detail"><p>{data || "本事项已按照村务公开程序完成整理与公示。相关内容经村务监督委员会审核，现向全体村民公开。"}</p><h3>详细内容</h3><p>本次工作坚持村民知情、村民参与、村民监督原则，事项进度、资金使用和办理结果将持续更新。如有疑问，可通过民情诉求提交意见，也可在村务公开日到村服务中心现场咨询。</p><div><span>发布单位：顺安镇村民委员会</span><span>发布日期：2026-07-28</span></div></article></>;
    if (type === "vote") return <>{detailHero("议事投票 · 参与得30积分", "请选择您支持的改造方案，每位认证村民仅可提交一次。")}<form className="villager-choice-form" onSubmit={(event) => { event.preventDefault(); showVillagerNotice("投票提交成功，感谢参与家乡建设"); close(); }}><label><input type="radio" name="vote" required /><span><strong>A方案 · 乡村共享花园</strong><small>保留原有树木，增加休闲步道、儿童活动区和公共座椅。</small></span></label><label><input type="radio" name="vote" /><span><strong>B方案 · 农产品周末集市</strong><small>建设可移动摊位，为村民农产品销售和节庆活动提供空间。</small></span></label><label><input type="radio" name="vote" /><span><strong>C方案 · 停车与便民服务点</strong><small>增加停车位、充电设施和便民服务驿站。</small></span></label><button type="submit">确认提交投票</button></form></>;
    if (type === "course") return <>{detailHero("在线课程 · 学完得50积分", "课程支持手机在线观看视频，完成全部章节学习后自动发放积分。", false)}<div className="villager-online-course"><div className="villager-video-player"><img src={detailImage} alt={`${title}课程封面`} /><span><Play /></span><div><small>在线课程 · 共 6 节</small><strong>点击播放课程</strong></div></div><div className="villager-detail-info"><dl><div><dt>学习方式</dt><dd>手机在线观看，支持随时暂停</dd></div><div><dt>课程时长</dt><dd>共 95 分钟</dd></div><div><dt>授课老师</dt><dd>乡村电商讲师 王老师</dd></div><div><dt>学习奖励</dt><dd>完成课程获得 50 积分</dd></div></dl><h3>课程内容</h3><p>账号定位、短视频拍摄、直播间搭建、农产品讲解、订单与售后处理。</p><button type="button" onClick={() => showVillagerNotice("课程已开始播放")}>开始在线观看</button></div></div></>;
    if (type === "goods") return <>{detailHero("积分商品", "使用共建积分兑换，兑换成功后可选择到村服务中心领取或配送到家。")}<div className="villager-exchange-detail"><dl><div><dt>所需积分</dt><dd>{title.includes("大米") ? "680" : title.includes("洗护") ? "520" : "1200"}积分</dd></div><div><dt>领取方式</dt><dd>服务中心自提 / 村内配送</dd></div><div><dt>兑换说明</dt><dd>兑换后不支持退换，商品以实际领取为准。</dd></div></dl><button type="button" onClick={() => { showVillagerNotice(`已成功兑换${title}`); close(); }}>确认兑换</button></div></>;
    if (type === "subsidy") {
      const subsidy = villageSubsidies.find((item) => item.title === title);
      if (!subsidy) return null;
      return <>{detailHero("惠农补贴 · 在线申领", "查看政策条件、申报材料和办理流程，确认符合要求后可直接提交申请。", false)}<div className="villager-policy-detail"><section className="villager-detail-summary"><div><small>补助标准</small><strong>{subsidy.amount}</strong></div><div><small>申报期限</small><strong>{subsidy.deadline}</strong></div><div><small>当前状态</small><strong>{subsidy.status}</strong></div></section><section className="villager-detail-block"><h3>申领对象</h3><p>{subsidy.target}</p><dl><div><dt>受理部门</dt><dd>{subsidy.department}</dd></div><div><dt>审核时限</dt><dd>{subsidy.reviewTime}</dd></div><div><dt>咨询电话</dt><dd><a href={`tel:${subsidy.phone}`}>{subsidy.phone}</a></dd></div></dl></section><section className="villager-detail-block"><h3>申领条件</h3><ol>{subsidy.conditions.map((item) => <li key={item}>{item}</li>)}</ol></section><section className="villager-detail-block"><h3>所需材料</h3><ul>{subsidy.materials.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="villager-detail-block"><h3>办理流程</h3><div className="villager-process-list">{subsidy.process.map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div></section><form className="village-form-page villager-detail-form" onSubmit={(event) => { event.preventDefault(); showVillagerNotice("补贴申请已提交，可在我的页面查看办理进度"); close(); }}><h3>在线申领</h3><label>申请人姓名<input required placeholder="请输入真实姓名" /></label><label>联系电话<input required type="tel" inputMode="numeric" placeholder="请输入联系电话" /></label><label>所在村镇<input required placeholder="例如：顺安镇东垅村" /></label><label>经营规模及申请说明<textarea required placeholder="请填写种养规模、经营情况、申请理由及已准备材料" /></label><label className="villager-form-agreement"><input type="checkbox" required /><span>本人承诺所填信息真实，并同意工作人员进行材料及现场核验。</span></label><button type="submit">提交补贴申请</button></form></div></>;
    }
    if (type === "job") {
      const job = villageJobs.find((item) => item.title === title);
      if (!job) return null;
      return <>{detailHero("本地就业 · 岗位招聘", "查看岗位职责、任职要求和福利待遇，提交后用工单位将进行审核联系。", false)}<div className="villager-job-detail"><img className="villager-detail-cover" src={job.image} alt={`${job.title}工作场景`} /><section className="villager-job-overview"><small>{job.company}</small><h2>{job.salary}</h2><div><span>{job.location}</span><span>{job.employment}</span><span>招聘 {job.openings} 人</span></div></section><section className="villager-detail-block"><h3>岗位职责</h3><ol>{job.duties.map((item) => <li key={item}>{item}</li>)}</ol></section><section className="villager-detail-block"><h3>任职要求</h3><ul>{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="villager-detail-block"><h3>福利待遇</h3><div className="villager-benefit-tags">{job.benefits.map((item) => <span key={item}>{item}</span>)}</div><dl><div><dt>报名截止</dt><dd>{job.deadline}</dd></div><div><dt>招聘联系人</dt><dd>{job.contact}</dd></div><div><dt>咨询电话</dt><dd><a href={`tel:${job.phone}`}>{job.phone}</a></dd></div></dl></section><form className="village-form-page villager-detail-form" onSubmit={(event) => { event.preventDefault(); showVillagerNotice("岗位申请已提交，用工单位审核后将与您联系"); close(); }}><h3>提交岗位申请</h3><label>申请人姓名<input required placeholder="请输入真实姓名" /></label><label>联系电话<input required type="tel" inputMode="numeric" placeholder="请输入联系电话" /></label><label>年龄及学历<input required placeholder="例如：28岁 / 大专" /></label><label>个人经历与技能<textarea required placeholder="请简要填写相关工作经历、技能证书及可到岗时间" /></label><label className="villager-form-agreement"><input type="checkbox" required /><span>本人同意将以上求职信息提供给招聘单位用于岗位联系。</span></label><button type="submit">提交岗位申请</button></form></div></>;
    }
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
    if (activeVillagerService === "积分超市") {
      const normalized = pointsSearch.trim().toLocaleLowerCase("zh-CN");
      const visibleGoods = pointsGoods.filter((good) => {
        const matchesSearch = !normalized || [good.name, good.category, good.description].some((value) => value.toLocaleLowerCase("zh-CN").includes(normalized));
        const matchesCategory = pointsCategory === "全部" || good.category === pointsCategory;
        const matchesRange = pointsRange === "全部积分" || (pointsRange === "300以下" ? good.points < 300 : pointsRange === "300-599" ? good.points >= 300 && good.points <= 599 : good.points >= 600);
        return matchesSearch && matchesCategory && matchesRange;
      }).sort((a, b) => pointsSort === "积分从低到高" ? a.points - b.points : pointsSort === "最新上架" ? b.listedAt.localeCompare(a.listedAt) : (stockFor(b) > 0 ? 1 : 0) - (stockFor(a) > 0 ? 1 : 0));
      return <div className="points-mall"><section className="points-mall-balance"><div><small>可用积分</small><strong>{pointsBalance.toLocaleString()}</strong><span>兑换后实时扣减</span></div><div><small>即将过期</small><strong>180</strong><span>2026-09-30 到期</span></div><button type="button" onClick={openPointsOrders}><ShoppingBag /><span>我的兑换</span><small>{pointsOrders.length} 笔订单</small></button></section><section className="points-mall-tools"><label className="points-search"><Search /><input value={pointsSearch} onChange={(event) => setPointsSearch(event.target.value)} placeholder="搜索积分商品" />{pointsSearch && <button type="button" onClick={() => setPointsSearch("")}><X /></button>}</label><label><span>分类</span><select value={pointsCategory} onChange={(event) => setPointsCategory(event.target.value as "全部" | PointsCategory)}><option>全部</option><option>生活用品</option><option>农资用品</option><option>地方好物</option><option>文创礼品</option></select></label><label><span>积分</span><select value={pointsRange} onChange={(event) => setPointsRange(event.target.value)}><option>全部积分</option><option>300以下</option><option>300-599</option><option>600以上</option></select></label><label><span>排序</span><select value={pointsSort} onChange={(event) => setPointsSort(event.target.value)}><option>综合</option><option>积分从低到高</option><option>最新上架</option></select></label></section><div className="points-result"><strong>{visibleGoods.length}</strong> 件可兑换商品</div>{visibleGoods.length ? <div className="points-goods-grid">{visibleGoods.map((item, index) => { const stock = stockFor(item); return <article key={item.id} className={stock === 0 ? "is-sold-out" : ""} onClick={() => stock && openPointsGood(item)}><div className="points-good-image"><img src={item.image} alt={item.name} loading={index > 5 ? "lazy" : "eager"} /><span>{item.category}</span>{stock === 0 && <b>已售罄</b>}</div><div className="points-good-body"><h3>{item.name}</h3><p>{item.description}</p><strong>{item.points.toLocaleString()} <small>积分</small></strong><div><span>库存 {stock}</span><span>限兑 {item.limit} 件</span></div><button type="button" disabled={stock === 0} onClick={(event) => { event.stopPropagation(); if (stock) openPointsGood(item); }}>{stock ? "查看兑换" : "已售罄"}</button></div></article>; })}</div> : <div className="points-order-empty"><Search /><strong>没有找到匹配商品</strong><p>请调整搜索词或筛选条件。</p></div>}</div>;
    }
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

  const selectMonitorPoint = (pointId: string) => {
    const point = monitorPoints.find((item) => item.id === pointId);
    if (point) {
      setMonitorFilter(point.area);
      setSelectedMonitorRegion(`village::${point.area}::${point.village}`);
      setSelectedMonitorId(point.id);
    }
  };

  const selectMonitorCamera = (pointId: string) => {
    const point = monitorPoints.find((item) => item.id === pointId);
    if (point) {
      setMonitorFilter(point.area);
      setSelectedMonitorId(point.id);
    }
  };

  const selectMonitorTownVillage = (value: string) => {
    const [level, townName, villageName] = value.split("::");
    const regionPoints = monitorPoints.filter((point) => point.area === townName && (level === "town" || point.village === villageName));
    const nextPoint = regionPoints.find((point) => point.status === "在线") || regionPoints[0];
    if (nextPoint) {
      setMonitorFilter(townName);
      setSelectedMonitorRegion(value);
      setSelectedMonitorId(nextPoint.id);
    }
  };

  const selectMonitorFilter = (filter: string) => {
    const nextPoints = filter === "全区点位"
      ? monitorPoints
      : monitorPoints.filter((point) => point.scenic === filter || point.area === filter);
    setMonitorFilter(filter);
    if (!nextPoints.some((point) => point.id === selectedMonitorId)) {
      const nextPoint = nextPoints.find((point) => point.status === "在线") || nextPoints[0];
      if (nextPoint) setSelectedMonitorId(nextPoint.id);
    }
  };

  const renderGovernmentMonitor = () => {
    const filtered = monitorFilter === "全区点位" ? monitorPoints : monitorPoints.filter((point) => point.scenic === monitorFilter || point.area === monitorFilter);
    const selectedRegionParts = selectedMonitorRegion.split("::");
    const selectedRegionLevel = selectedRegionParts[0];
    const activeTownPoints = monitorPoints.filter((point) => point.area === selectedRegionParts[1]);
    const activeVillagePoints = activeTownPoints.filter((point) => selectedRegionLevel === "town" || point.village === selectedRegionParts[2]);
    const townVillageGroups = townStatistics.map((town) => ({ town: town.name, villages: Array.from(new Set(monitorPoints.filter((point) => point.area === town.name).map((point) => point.village))) }));
    const monitorFilters = ["全区点位", ...governmentScenics.map((item) => item.name), ...townStatistics.map((town) => town.name)];
    return <section className="gov-monitor-layout">
      <aside className="gov-panel gov-monitor-list">
        <header><div><small>DISTRIBUTION</small><h2>监控点位分布</h2></div><span>{filtered.length} 个点位</span></header>
        <nav>{monitorFilters.map((item) => <button type="button" key={item} className={monitorFilter === item ? "is-active" : ""} onClick={() => selectMonitorFilter(item)}>{item}</button>)}</nav>
        <div className="gov-monitor-map"><i className="road road-one" /><i className="road road-two" />{filtered.map((point) => <button type="button" key={point.id} aria-label={`选择${point.name}`} className={`${selectedMonitorId === point.id ? "is-active" : ""} ${point.status === "维护" ? "is-offline" : ""}`} style={{ left: `${point.mapX}%`, top: `${point.mapY}%` }} onClick={() => selectMonitorPoint(point.id)}><Camera /><small>{point.id}</small></button>)}</div>
        <div className="gov-point-list">{filtered.map((point) => <button type="button" key={point.id} className={selectedMonitorId === point.id ? "is-active" : ""} onClick={() => selectMonitorPoint(point.id)}><span className={point.status === "在线" ? "is-online" : ""} /><div><strong>{point.name}</strong><small>{point.id} · {point.area}</small></div><em>{point.status}</em></button>)}</div>
      </aside>
      <div className="gov-monitor-main">
        <article className="gov-panel gov-live-panel">
          <header><div><small>REAL-TIME VIDEO</small><h2>{activeMonitor.area} · {activeMonitor.village} · {activeMonitor.name}</h2></div><span className={activeMonitor.status === "维护" ? "is-maintenance" : ""}><i /> {activeMonitor.status === "在线" ? "实时画面" : "设备维护中"}</span></header>
          <div className="gov-camera-picker" aria-label="选择监控点位">
            <label><span>选择镇村</span><select value={selectedMonitorRegion} onChange={(event) => selectMonitorTownVillage(event.target.value)}>{townVillageGroups.map((group) => <optgroup key={group.town} label={group.town}><option value={`town::${group.town}`}>{group.town}（全部摄像头）</option>{group.villages.map((village) => <option key={`${group.town}-${village}`} value={`village::${group.town}::${village}`}>　└ {village}</option>)}</optgroup>)}</select></label>
            <label><span>选择摄像头</span><select value={activeMonitor.id} onChange={(event) => selectMonitorCamera(event.target.value)}>{activeVillagePoints.map((point) => <option key={point.id} value={point.id}>{point.name}（{point.status}）</option>)}</select></label>
          </div>
          <div className="gov-camera-current"><div><small>当前乡镇</small><strong>{activeMonitor.area}</strong></div><div><small>村/社区</small><strong>{activeMonitor.village}</strong></div><div><small>具体点位</small><strong>{activeMonitor.name}</strong></div><div><small>设备编号</small><strong>{activeMonitor.id}</strong></div><div><small>设备状态</small><strong className={activeMonitor.status === "在线" ? "is-online" : "is-maintenance"}>{activeMonitor.status}</strong></div><div className="is-ai"><small>AI识别能力</small><strong>{activeMonitor.targets.join(" · ")}</strong></div></div>
          <div className={`gov-live-video gov-video--${activeMonitor.scene}`}><div className="video-hud"><span>{activeMonitor.area} / {activeMonitor.village} / {activeMonitor.id} / 1080P</span><time>{new Date().toLocaleDateString("zh-CN")} 10:48:32</time></div><i className="scan-line" /><div className="detection-box box-person"><span>人员 98%</span></div><div className="detection-box box-car"><span>车辆 96%</span></div><div className="video-crosshair" /><footer><span>AI识别：{activeMonitor.targets.join(" · ")}</span><strong>{activeMonitor.status === "在线" ? "REC ●" : "MAINTENANCE"}</strong></footer></div>
          <div className="gov-monitor-actions"><button type="button" onClick={() => showGovernmentNotice("已抓拍当前画面并存入事件中心")}><Camera />手动抓拍</button><button type="button" onClick={() => setGovernmentModal("dispatch")}><Radio />调度人员</button><button type="button" onClick={() => setGovernmentModal("emergency")}><Siren />上报事件</button></div>
        </article>
        <article className="gov-panel gov-capture-panel"><header><div><small>SMART CAPTURE</small><h2>智能抓拍记录</h2></div><span>车 · 人 · 动物 · 行为</span></header><div>{governmentWarnings.map((warning, index) => <article key={`${warning.type}-${warning.time}`}><span className={`capture-thumb capture-${index}`}><AlertTriangle /></span><div><small>{warning.point} · {warning.time}</small><strong>{warning.type}</strong><p>{warning.detail}</p></div><button type="button" onClick={() => showGovernmentNotice("预警已确认并加入处置记录")}>确认</button></article>)}</div></article>
      </div>
    </section>;
  };

  const renderGovernmentTown = () => <section className="gov-town-layout"><nav className="gov-town-selector">{townStatistics.map((town) => <button type="button" key={town.name} className={selectedTown === town.name ? "is-active" : ""} onClick={() => setSelectedTown(town.name)}><strong>{town.name}</strong><small>{town.villages} 个行政村</small></button>)}</nav><section className="gov-town-kpis"><article><small>常住人口</small><strong>{activeTownStats.population.toLocaleString()}</strong><span>人</span></article><article><small>村级单元</small><strong>{activeTownStats.villages}</strong><span>个</span></article><article><small>人均可支配收入</small><strong>{activeTownStats.income.toLocaleString()}</strong><span>元 / 年</span></article><article><small>年度游客量</small><strong>{(activeTownStats.tourists / 10000).toFixed(1)}</strong><span>万人次</span></article></section><section className="gov-town-charts"><article className="gov-panel"><header><div><small>AGE STRUCTURE</small><h2>年龄结构</h2></div><span>{activeTownStats.name}</span></header><div className="gov-age-chart"><div className="age-ring" style={{ background: `conic-gradient(#25b7ff 0 ${activeTownStats.ages[0]}%, #3378ff ${activeTownStats.ages[0]}% ${activeTownStats.ages[0] + activeTownStats.ages[1]}%, #f6b84a ${activeTownStats.ages[0] + activeTownStats.ages[1]}% 100%)` }}><span><strong>{activeTownStats.population.toLocaleString()}</strong><small>总人口</small></span></div><ul><li><i className="age-young" /><span>0—17岁</span><strong>{activeTownStats.ages[0]}%</strong></li><li><i className="age-working" /><span>18—59岁</span><strong>{activeTownStats.ages[1]}%</strong></li><li><i className="age-old" /><span>60岁以上</span><strong>{activeTownStats.ages[2]}%</strong></li></ul></div></article><article className="gov-panel"><header><div><small>DATA TREND</small><h2>收入与游客趋势</h2></div><button type="button" onClick={exportGovernmentData}><Download />导出</button></header><div className="gov-bar-chart">{[72, 78, 83, 88, 94].map((height, index) => <div key={height}><span style={{ height: `${height}%` }} /><small>{2022 + index}</small></div>)}</div><div className="gov-chart-legend"><span><i />人均收入连续增长</span><strong>较2022年 +22.4%</strong></div></article></section><section className="gov-panel gov-village-ranking"><header><div><small>VILLAGE OVERVIEW</small><h2>重点村数据概览</h2></div><span>数据更新于 10:30</span></header><div className="gov-table"><div className="gov-table-row is-head"><span>村庄</span><span>人口</span><span>集体收入</span><span>游客量</span><span>治理指数</span></div>{["东垅村", "犁桥村", "凤凰村", "龙潭肖村"].map((name, index) => <div className="gov-table-row" key={name}><strong>{name}</strong><span>{(4820 - index * 570).toLocaleString()}人</span><span>{128 - index * 13}万元</span><span>{38.6 - index * 5.2}万人</span><span><i><b style={{ width: `${92 - index * 4}%` }} /></i>{92 - index * 4}</span></div>)}</div></section></section>;

  const renderGovernmentBusiness = () => <section className="gov-business-layout"><nav className="gov-business-tabs">{(["全部", "农产品审核", "农房需求", "民情诉求", "惠农补贴", "就业岗位", "村务内容", "议事投票", "课程培训", "游客内容"] as GovernmentBusiness[]).map((item) => <button type="button" key={item} className={governmentBusiness === item ? "is-active" : ""} onClick={() => setGovernmentBusiness(item)}>{item}<small>{item === "全部" ? governmentBusinesses.length : governmentBusinesses.filter((business) => business.type === item).length}</small></button>)}</nav><section className="gov-panel gov-business-panel"><header><div><small>SERVICE CENTER</small><h2>{governmentBusiness === "全部" ? "全量业务事项" : governmentBusiness}</h2></div><span>{visibleGovernmentBusinesses.filter((item) => item.status === "待审核").length} 项待审核</span></header><div className="gov-business-list">{visibleGovernmentBusinesses.length ? visibleGovernmentBusinesses.map((item) => <article key={item.id}>{item.images.length > 0 ? <div className="gov-business-images">{item.images.slice(0, 3).map((image, index) => <img src={image} alt={`${item.title}材料${index + 1}`} key={`${item.id}-${index}`} />)}</div> : <span className="gov-business-icon">{item.type.includes("农产品") ? <Store /> : item.type.includes("农房") ? <HomeIcon /> : item.type.includes("诉求") ? <Bell /> : item.type.includes("补贴") ? <ClipboardCheck /> : item.type.includes("岗位") ? <Briefcase /> : item.type.includes("投票") ? <Vote /> : item.type.includes("课程") ? <GraduationCap /> : <FileText />}</span>}<div className="gov-business-copy"><small>{item.id} · {item.type}</small><h3>{item.title}</h3><p>{item.detail}</p><span>{item.source} · {item.time}</span></div><div className="gov-business-status"><span className={`status-${item.status}`}>{item.status}</span>{item.status === "待审核" && <><button type="button" onClick={() => updateGovernmentBusiness(item.id, "已通过")}>通过</button><button type="button" className="is-reject" onClick={() => updateGovernmentBusiness(item.id, "已驳回")}>退回</button></>}{item.status === "办理中" && <button type="button" onClick={() => updateGovernmentBusiness(item.id, "已通过")}>办结</button>}</div></article>) : <div className="gov-empty"><CheckCircle2 /><strong>当前分类暂无待办</strong><p>新的用户端发布和业务申请会实时汇入此处。</p></div>}</div></section></section>;

  const renderGovernmentProfile = () => <section className="gov-profile-layout"><article className="gov-profile-card"><span><UserRound /></span><div><small>义安区政务协同平台</small><div className="gov-profile-title-row"><h2>张主任，上午好</h2><button type="button" onClick={() => setIsRoleSelectorOpen(true)}>切换角色</button></div><p>区文旅与乡村治理综合值班 · 今日值守至 18:00</p></div></article><section className="gov-profile-stats"><article><small>今日已办结</small><strong>18</strong></article><article><small>本周调度</small><strong>32</strong></article><article><small>发布通知</small><strong>6</strong></article><article><small>平均响应</small><strong>8.6<em>分钟</em></strong></article></section><section className="gov-panel gov-duty-card"><header><div><small>DUTY SCHEDULE</small><h2>今日值班与联络</h2></div><span>在线 6 人</span></header><div>{["综合值守 · 张主任", "文旅调度 · 李晨", "应急联络 · 王海", "镇村协同 · 陈敏"].map((name, index) => <article key={name}><span>{name.slice(-1)}</span><div><strong>{name}</strong><small>{index === 0 ? "总值班 · 138****6018" : `分机 80${index + 6} · 当前在线`}</small></div><i /></article>)}</div></section><section className="gov-panel gov-system-menu"><button type="button" onClick={() => setGovernmentModal("notice")}><Megaphone /><span><strong>通知发布记录</strong><small>查看已发布与定时通知</small></span><em>›</em></button><button type="button" onClick={() => setGovernmentSection("业务办理")}><ClipboardCheck /><span><strong>我的办理记录</strong><small>查看审核、退回与办结事项</small></span><em>›</em></button><button type="button" onClick={exportGovernmentData}><Database /><span><strong>数据导出中心</strong><small>生成景区、镇村与治理报表</small></span><em>›</em></button><button type="button" onClick={() => showGovernmentNotice("系统运行正常，数据同步完成")}><Activity /><span><strong>系统运行状态</strong><small>数据更新时间 10:48:32</small></span><em>正常</em></button></section></section>;

  const renderGovernmentView = () => <section className="government-view" onPointerDown={(event) => event.stopPropagation()}><header className="government-header"><div className="government-brand"><span><Database /></span><div><small>义安区数字政务</small><h1>义安智治</h1><p>文旅监测 · 镇村治理 · 协同办理</p></div></div><div className="government-header-status"><span><i />今日值班中</span><time>7月28日 周二</time></div></header><main>{governmentSection === "政务首页" ? renderGovernmentHome() : governmentSection === "监控中心" ? renderGovernmentMonitor() : governmentSection === "镇村数据" ? renderGovernmentTown() : governmentSection === "业务办理" ? renderGovernmentBusiness() : renderGovernmentProfile()}</main></section>;

  const openInvestmentProject = (project: InvestmentProject) => {
    setSelectedInvestmentProject(project);
    setInvestmentView("detail");
  };

  const closeInvestment = () => {
    setInvestmentView(null);
    setSelectedInvestmentProject(null);
    setInvestmentCategory("全部");
  };

  const handleInvestmentBack = () => {
    if (investmentView === "list") closeInvestment();
    else if (investmentView === "detail") setInvestmentView("list");
    else setInvestmentView("detail");
  };

  const submitInvestmentLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedInvestmentProject) return;
    const formData = new FormData(event.currentTarget);
    const lead: InvestmentLead = {
      id: `INV-${Date.now()}`,
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      project: selectedInvestmentProject.name,
      direction: String(formData.get("direction") || ""),
      amount: String(formData.get("amount") || ""),
      remark: String(formData.get("remark") || ""),
      submittedAt: new Date().toISOString(),
    };
    const nextLeads = [lead, ...investmentLeads];
    setInvestmentLeads(nextLeads);
    localStorage.setItem(INVESTMENT_LEADS_KEY, JSON.stringify(nextLeads));
    setInvestmentView("success");
  };

  const startGoodsCheckout = (good: YianGood) => {
    setCheckoutGood(good);
    setSelectedGood(null);
    setGoodsQuantity(1);
    setGoodsDelivery("快递配送");
    setGoodsErrors({});
    setGoodsOrderView("checkout");
  };

  const updateGoodsForm = (field: keyof GoodsForm, value: string) => {
    setGoodsForm((current) => ({ ...current, [field]: value }));
    if (field !== "message") setGoodsErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submitGoodsOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checkoutGood) return;
    const errors: GoodsFormErrors = {};
    if (!goodsForm.receiver.trim()) errors.receiver = "请填写收货人姓名";
    if (!/^1[3-9]\d{9}$/.test(goodsForm.phone.trim())) errors.phone = "请输入合法的中国大陆手机号";
    if (goodsDelivery === "快递配送" && !goodsForm.region.trim()) errors.region = "请选择或填写所在地区";
    if (goodsDelivery === "快递配送" && !goodsForm.address.trim()) errors.address = "请填写详细收货地址";
    setGoodsErrors(errors);
    if (Object.keys(errors).length) return;

    const unitPrice = goodsPrices[checkoutGood.name] || 58;
    const goodsAmount = Number((unitPrice * goodsQuantity).toFixed(2));
    const shippingFee = goodsDelivery === "到店自提" || goodsAmount >= 99 ? 0 : 8;
    const order: GoodsOrder = {
      id: `YA${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      productName: checkoutGood.name,
      productType: checkoutGood.type,
      productScene: checkoutGood.scene,
      specification: checkoutGood.specification.split(" / ")[0],
      unitPrice,
      quantity: goodsQuantity,
      goodsAmount,
      shippingFee,
      totalAmount: Number((goodsAmount + shippingFee).toFixed(2)),
      delivery: goodsDelivery,
      receiver: goodsForm.receiver.trim(),
      phone: goodsForm.phone.trim(),
      region: goodsDelivery === "快递配送" ? goodsForm.region.trim() : "",
      address: goodsDelivery === "快递配送" ? goodsForm.address.trim() : pickupPoint,
      message: goodsForm.message.trim(),
    };
    const nextOrders = [order, ...goodsOrders];
    setGoodsOrders(nextOrders);
    setActiveGoodsOrder(order);
    localStorage.setItem(GOODS_ORDERS_KEY, JSON.stringify(nextOrders));
    setGoodsOrderView("success");
  };

  const toggleFavoriteGood = (good: YianGood) => {
    setFavoriteGoods((current) => {
      const next = current.includes(good.name) ? current.filter((name) => name !== good.name) : [good.name, ...current];
      localStorage.setItem(GOODS_FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeHistoryItem = (target: BrowsingHistoryItem) => {
    setBrowsingHistory((current) => {
      const next = current.filter((item) => !(item.type === target.type && item.id === target.id));
      localStorage.setItem(BROWSING_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearBrowsingHistory = () => {
    setBrowsingHistory([]);
    localStorage.setItem(BROWSING_HISTORY_KEY, "[]");
  };

  const formatRecordTime = (value: string) => new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));

  const renderPersonalRecordView = () => {
    if (!personalRecordView) return null;
    const activeOrder = personalRecordView.orderId ? goodsOrders.find((order) => order.id === personalRecordView.orderId) : null;
    const titles: Record<PersonalRecordPage, string> = { favorites: "我的收藏", orders: "购买订单", "order-detail": "订单详情", history: "浏览足迹" };
    const back = () => personalRecordView.page === "order-detail" ? setPersonalRecordView({ page: "orders" }) : setPersonalRecordView(null);
    const empty = (icon: "favorite" | "order" | "history", title: string, detail: string) => <div className="personal-record-empty">{icon === "favorite" ? <Heart /> : icon === "order" ? <ShoppingBag /> : <Compass />}<h2>{title}</h2><p>{detail}</p></div>;
    return <section className="personal-record-view" onPointerDown={(event) => event.stopPropagation()}>
      <header className="personal-record-topbar"><button type="button" onClick={back} aria-label="返回游客我的"><ChevronLeft aria-hidden="true" /></button><div><small>MY YI'AN</small><strong>{titles[personalRecordView.page]}</strong></div>{personalRecordView.page === "history" && browsingHistory.length ? <button type="button" className="personal-record-clear" onClick={clearBrowsingHistory}>清空</button> : <span>{personalRecordView.page === "favorites" ? `${favoriteGoods.length} 件` : personalRecordView.page === "orders" ? `${goodsOrders.length} 笔` : "本机记录"}</span>}</header>
      <div className="personal-record-body">
        {personalRecordView.page === "favorites" && (favoriteGoods.length ? <div className="favorite-good-list">{favoriteGoods.map((name) => yianGoods.find((good) => good.name === name)).filter((good): good is YianGood => Boolean(good)).map((good) => <article className="personal-good-card" key={good.name}><button type="button" className="personal-record-main" onClick={() => { setPersonalRecordView(null); openGood(good); }}><img src={imageUrl(`${good.scene}, realistic, natural light, no text, no watermark`)} alt={good.name} /><div><small>{good.type}</small><h2>{good.name}</h2><p>{good.detail}</p><strong>¥{(goodsPrices[good.name] || 58).toFixed(2)} 起</strong></div></button><button type="button" className="personal-record-remove" onClick={() => toggleFavoriteGood(good)}>取消收藏</button></article>)}</div> : empty("favorite", "还没有收藏好物", "在义安好物详情中点击“收藏好物”，心仪好物会保存在这里。"))}
        {personalRecordView.page === "orders" && (goodsOrders.length ? <div className="personal-order-list">{goodsOrders.map((order) => <article className="personal-order-card" key={order.id}><header><span>已提交</span><small>{formatRecordTime(order.createdAt)}</small></header><button type="button" onClick={() => setPersonalRecordView({ page: "order-detail", orderId: order.id })}><img src={imageUrl(`${order.productScene}, realistic, natural light, no text, no watermark`)} alt={order.productName} /><div><h2>{order.productName}</h2><p>{order.specification} · ×{order.quantity}</p><small>订单编号 {order.id}</small></div><strong>¥{order.totalAmount.toFixed(2)}</strong></button><footer><span>{order.delivery}</span><button type="button" onClick={() => setPersonalRecordView({ page: "order-detail", orderId: order.id })}>查看订单详情</button></footer></article>)}</div> : empty("order", "暂无购买订单", "从义安好物提交的订单会保存在本机，并按下单时间倒序展示。"))}
        {personalRecordView.page === "order-detail" && (activeOrder ? <div className="personal-order-detail"><section className="personal-order-status"><CheckCircle2 /><div><small>订单状态</small><h1>订单已提交</h1><p>{activeOrder.delivery === "快递配送" ? "商家确认后将安排发货" : "请凭订单编号前往自提点领取"}</p></div></section><section className="personal-detail-card"><h2>{activeOrder.delivery === "快递配送" ? "收货信息" : "自提信息"}</h2><p><strong>{activeOrder.receiver}</strong> {activeOrder.phone}</p><p>{activeOrder.region} {activeOrder.address}</p></section><section className="personal-detail-card personal-detail-product"><img src={imageUrl(`${activeOrder.productScene}, realistic, natural light, no text, no watermark`)} alt={activeOrder.productName} /><div><small>{activeOrder.productType}</small><h2>{activeOrder.productName}</h2><p>{activeOrder.specification} · ×{activeOrder.quantity}</p></div><strong>¥{activeOrder.goodsAmount.toFixed(2)}</strong></section><section className="personal-detail-card"><h2>订单信息</h2><dl><div><dt>订单编号</dt><dd>{activeOrder.id}</dd></div><div><dt>下单时间</dt><dd>{new Date(activeOrder.createdAt).toLocaleString("zh-CN", { hour12: false })}</dd></div><div><dt>配送方式</dt><dd>{activeOrder.delivery}</dd></div><div><dt>买家留言</dt><dd>{activeOrder.message || "无"}</dd></div></dl></section><section className="personal-detail-card"><h2>费用明细</h2><dl><div><dt>商品金额</dt><dd>¥{activeOrder.goodsAmount.toFixed(2)}</dd></div><div><dt>运费</dt><dd>{activeOrder.shippingFee ? `¥${activeOrder.shippingFee.toFixed(2)}` : "免运费"}</dd></div><div className="is-total"><dt>实付总额</dt><dd>¥{activeOrder.totalAmount.toFixed(2)}</dd></div></dl></section></div> : empty("order", "订单不存在", "该订单记录可能已被清除。"))}
        {personalRecordView.page === "history" && (browsingHistory.length ? <div className="history-record-list">{browsingHistory.map((item) => {
          const spot = item.type === "spot" ? scenicSpots.find((entry) => entry.id === item.id) : undefined;
          const town = item.type === "town" ? townDetails.find((entry) => entry.id === item.id) : undefined;
          const good = item.type === "good" ? yianGoods.find((entry) => entry.name === item.id) : undefined;
          const title = spot?.name || town?.name || good?.name;
          if (!title) return null;
          const scene = spot?.scene || town?.scene || good?.scene || "";
          const typeLabel = spot ? "景点" : town ? "乡镇" : "好物";
          return <article className="history-record-card" key={`${item.type}-${item.id}`}><button type="button" className="personal-record-main" onClick={() => { setPersonalRecordView(null); if (spot) openSpot(spot); else if (town) openTown(town); else if (good) openGood(good); }}><img src={imageUrl(`${scene}, realistic, natural light, no text, no watermark`)} alt={title} /><div><small>{typeLabel} · {formatRecordTime(item.viewedAt)}</small><h2>{title}</h2><p>{spot?.intro || town?.intro || good?.detail}</p></div></button><button type="button" className="personal-record-remove" onClick={() => removeHistoryItem(item)}>删除</button></article>;
        })}</div> : empty("history", "暂无浏览足迹", "打开景点、乡镇或义安好物详情后，会自动记录在这里。"))}
      </div>
    </section>;
  };

  const renderGoodsOrderView = () => {
    if (goodsOrderView === "success" && activeGoodsOrder) return <>
      <header className="goods-order-topbar"><button type="button" onClick={() => { setGoodsOrderView(null); setCheckoutGood(null); setActiveSection("义安好物"); }} aria-label="返回义安好物"><ChevronLeft aria-hidden="true" /></button><strong>订单提交成功</strong><span>已保存</span></header>
      <div className="goods-order-scroll goods-order-success"><div className="goods-success-icon"><CheckCircle2 /></div><small>订单编号 {activeGoodsOrder.id}</small><h1>订单提交成功</h1><p>订单已保存到本机，您可以在游客端“我的—购买订单”中再次查看。</p><section className="goods-order-card goods-success-detail"><dl><div><dt>支付金额</dt><dd className="is-price">¥{activeGoodsOrder.totalAmount.toFixed(2)}</dd></div><div><dt>配送方式</dt><dd>{activeGoodsOrder.delivery}</dd></div><div><dt>收货信息</dt><dd>{activeGoodsOrder.receiver} {activeGoodsOrder.phone}<br />{activeGoodsOrder.address}</dd></div><div><dt>商品</dt><dd>{activeGoodsOrder.productName} × {activeGoodsOrder.quantity}</dd></div></dl></section><div className="goods-success-actions"><button type="button" onClick={() => { setGoodsOrderView(null); setCheckoutGood(null); setActiveSection("义安好物"); }}>返回好物</button><button type="button" className="is-secondary" onClick={() => { setGoodsOrderView(null); setCheckoutGood(null); setActiveSection("我的"); setPersonalRecordView({ page: "order-detail", orderId: activeGoodsOrder.id }); }}>查看订单</button></div></div>
    </>;
    if (!checkoutGood) return null;
    const unitPrice = goodsPrices[checkoutGood.name] || 58;
    const goodsAmount = Number((unitPrice * goodsQuantity).toFixed(2));
    const shippingFee = goodsDelivery === "到店自提" || goodsAmount >= 99 ? 0 : 8;
    const totalAmount = goodsAmount + shippingFee;
    return <>
      <header className="goods-order-topbar"><button type="button" onClick={() => { setGoodsOrderView(null); setSelectedGood(checkoutGood); }} aria-label="返回好物详情"><ChevronLeft aria-hidden="true" /></button><strong>确认订单</strong><span>义安甄选</span></header>
      <form className="goods-order-form" onSubmit={submitGoodsOrder} noValidate>
        <div className="goods-order-scroll">
          <section className="goods-order-card goods-order-product"><img src={imageUrl(`${checkoutGood.scene}, realistic, natural light, no text, no watermark`)} alt={checkoutGood.name} /><div><small>{checkoutGood.type}</small><h2>{checkoutGood.name}</h2><p>规格：{checkoutGood.specification.split(" / ")[0]}</p><footer><strong>¥{unitPrice.toFixed(2)}</strong><div className="goods-quantity"><button type="button" disabled={goodsQuantity <= 1} onClick={() => setGoodsQuantity((value) => Math.max(1, value - 1))}>−</button><span>{goodsQuantity}</span><button type="button" onClick={() => setGoodsQuantity((value) => value + 1)}>＋</button></div></footer></div><aside>小计 <strong>¥{goodsAmount.toFixed(2)}</strong></aside></section>
          <section className="goods-order-card goods-form-section"><header><small>RECEIVER</small><h2>收货信息</h2></header><label>收货人<input value={goodsForm.receiver} onChange={(event) => updateGoodsForm("receiver", event.target.value)} placeholder="请输入收货人姓名" autoComplete="name" />{goodsErrors.receiver && <em>{goodsErrors.receiver}</em>}</label><label>手机号<input type="tel" inputMode="numeric" maxLength={11} value={goodsForm.phone} onChange={(event) => updateGoodsForm("phone", event.target.value.replace(/\D/g, ""))} placeholder="请输入11位手机号" autoComplete="tel" />{goodsErrors.phone && <em>{goodsErrors.phone}</em>}</label>{goodsDelivery === "快递配送" && <><label>所在地区<select value={goodsForm.region} onChange={(event) => updateGoodsForm("region", event.target.value)}><option value="">请选择地区</option><option>安徽省 铜陵市 义安区</option><option>安徽省 铜陵市 铜官区</option><option>安徽省 铜陵市 郊区</option><option>其他地区</option></select>{goodsErrors.region && <em>{goodsErrors.region}</em>}</label><label>详细地址<textarea value={goodsForm.address} onChange={(event) => updateGoodsForm("address", event.target.value)} placeholder="街道、门牌号、小区楼栋等" />{goodsErrors.address && <em>{goodsErrors.address}</em>}</label></>}</section>
          <section className="goods-order-card goods-form-section"><header><small>DELIVERY</small><h2>订单信息</h2></header><div className="goods-delivery-options">{(["快递配送", "到店自提"] as GoodsDelivery[]).map((item) => <button type="button" key={item} className={goodsDelivery === item ? "is-active" : ""} onClick={() => { setGoodsDelivery(item); setGoodsErrors((current) => ({ ...current, region: undefined, address: undefined })); }}>{item}<small>{item === "快递配送" ? "满99元包邮" : "免运费"}</small></button>)}</div>{goodsDelivery === "到店自提" && <div className="goods-pickup-point"><strong>自提点</strong><p>{pickupPoint}</p><small>提交后请凭订单编号到店领取</small></div>}<label>买家留言<textarea value={goodsForm.message} onChange={(event) => updateGoodsForm("message", event.target.value)} placeholder="选填，可填写包装或配送需求" maxLength={120} /></label></section>
          <section className="goods-order-card goods-fee-detail"><header><small>PAYMENT</small><h2>费用明细</h2></header><dl><div><dt>商品金额</dt><dd>¥{goodsAmount.toFixed(2)}</dd></div><div><dt>运费</dt><dd>{shippingFee ? `¥${shippingFee.toFixed(2)}` : "免运费"}</dd></div><div><dt>合计金额</dt><dd>¥{totalAmount.toFixed(2)}</dd></div></dl></section>
        </div><footer className="goods-order-submit"><div><small>应付总额</small><strong>¥{totalAmount.toFixed(2)}</strong></div><button type="submit">提交订单</button></footer>
      </form>
    </>;
  };

  const renderInvestmentView = () => {
    const visibleProjects = investmentCategory === "全部" ? investmentProjects : investmentProjects.filter((project) => project.category === investmentCategory);
    if (investmentView === "list") return <>
      <header className="investment-topbar"><button type="button" onClick={handleInvestmentBack} aria-label="返回智慧导览"><ChevronLeft aria-hidden="true" /></button><div><small>义安区投资促进服务</small><strong>投资义安</strong></div><span>政府招商</span></header>
      <div className="investment-page-body investment-list-page">
        <section className="investment-hero"><small>INVEST IN YI'AN</small><h1>山水人文汇义安<br />携手共创好未来</h1><p>聚焦文旅融合、乡村振兴和现代产业，为投资伙伴提供项目对接与全流程服务。</p><div><span><strong>{investmentProjects.length}</strong> 个精选项目</span><span><strong>5</strong> 大产业方向</span></div></section>
        <nav className="investment-tabs" aria-label="投资项目分类">{investmentCategories.map((category) => <button type="button" key={category} className={investmentCategory === category ? "is-active" : ""} onClick={() => setInvestmentCategory(category)}>{category}</button>)}</nav>
        <section className="investment-project-list" aria-live="polite">{visibleProjects.map((project) => <article className="investment-project-card" key={project.id}>
          <img src={project.sceneryImage} alt="" loading="lazy" />
          <div className="investment-project-card__content">
            <header><div><span>{project.category}</span><small>{project.town}</small></div><em>{project.status}</em></header>
            <h2>{project.name}</h2>
            <div className="investment-project-card__scene"><strong>闲置资源场景</strong><p>{project.scene}</p></div>
            <button type="button" onClick={() => openInvestmentProject(project)}>查看项目详情 <span>›</span></button>
          </div>
        </article>)}</section>
        <footer className="investment-service-note"><Briefcase /><div><strong>义安区投资促进服务</strong><p>项目情况以正式招商资料和实地洽谈为准，我们将为您提供专人对接服务。</p></div></footer>
      </div>
    </>;
    if (!selectedInvestmentProject) return null;
    if (investmentView === "detail") return <>
      <header className="investment-topbar"><button type="button" onClick={handleInvestmentBack} aria-label="返回项目列表"><ChevronLeft aria-hidden="true" /></button><div><small>{selectedInvestmentProject.category} · {selectedInvestmentProject.town}</small><strong>项目详情</strong></div><span>{selectedInvestmentProject.status}</span></header>
      <div className="investment-page-body investment-detail-page">
        <section className="investment-detail-hero"><span>{selectedInvestmentProject.category}</span><h1>{selectedInvestmentProject.name}</h1><p>{selectedInvestmentProject.town} · {selectedInvestmentProject.status}</p></section>
        <section className="investment-detail-section"><h2><span>01</span>闲置资源场景</h2><p>{selectedInvestmentProject.scene}</p></section>
        <section className="investment-detail-section"><h2><span>02</span>投资建议</h2><p>{selectedInvestmentProject.suggestion}</p></section>
        <section className="investment-detail-section"><h2><span>03</span>资源风貌</h2><img className="investment-scenery-image" src={selectedInvestmentProject.sceneryImage} alt="资源风貌" loading="lazy" /></section>
        <section className="investment-contact-card"><small>联系我们</small><strong>{selectedInvestmentProject.contact}</strong><span>{selectedInvestmentProject.phone}</span></section>
      </div>
      <footer className="investment-fixed-action"><button type="button" onClick={() => setInvestmentView("form")}><Send />我有投资意向</button></footer>
    </>;
    if (investmentView === "form") return <>
      <header className="investment-topbar"><button type="button" onClick={handleInvestmentBack} aria-label="返回项目详情"><ChevronLeft aria-hidden="true" /></button><div><small>投资合作意向登记</small><strong>我有投资意向</strong></div><span>专人对接</span></header>
      <div className="investment-page-body investment-form-page">
        <section className="investment-form-intro"><small>当前意向项目</small><h1>{selectedInvestmentProject.name}</h1><p>请留下真实信息，招商主管部门将在收到信息后尽快与您联系。</p></section>
        <form className="investment-lead-form" onSubmit={submitInvestmentLead}>
          <label>姓名 / 企业<input name="name" required placeholder="请输入姓名或企业名称" autoComplete="organization" /></label>
          <label>联系电话<input name="phone" required type="tel" inputMode="tel" pattern="[0-9+\- ]{6,20}" placeholder="请输入联系电话" autoComplete="tel" /></label>
          <label>意向项目<input name="project" value={selectedInvestmentProject.name} readOnly /></label>
          <label>投资方向<select name="direction" required defaultValue=""><option value="" disabled>请选择投资方向</option>{investmentCategories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
          <label>预计投资额<select name="amount" required defaultValue=""><option value="" disabled>请选择预计投资额</option><option>1000万元以下</option><option>1000万—5000万元</option><option>5000万—1亿元</option><option>1亿—3亿元</option><option>3亿元以上</option><option>待进一步评估</option></select></label>
          <label>备注<textarea name="remark" placeholder="可填写合作资源、考察计划或其他需求" /></label>
          <p>提交即表示您同意工作人员基于项目对接目的与您联系。</p>
          <button type="submit"><Send />提交投资意向</button>
        </form>
      </div>
    </>;
    return <>
      <header className="investment-topbar"><button type="button" onClick={handleInvestmentBack} aria-label="返回项目详情"><ChevronLeft aria-hidden="true" /></button><div><small>投资合作意向登记</small><strong>提交成功</strong></div><span>已受理</span></header>
      <div className="investment-page-body investment-success-page"><div className="investment-success-icon"><CheckCircle2 /></div><small>意向编号 {investmentLeads[0]?.id}</small><h1>感谢关注投资义安</h1><p>您的投资意向已成功保存，招商主管部门将尽快与您联系。您可返回项目详情继续查看项目信息。</p><button type="button" onClick={() => setInvestmentView("detail")}>返回项目详情</button><button type="button" className="is-secondary" onClick={() => setInvestmentView("list")}>浏览更多项目</button></div>
    </>;
  };

  const normalizedGoodsSearch = goodsSearch.trim().toLocaleLowerCase("zh-CN");
  const filteredGoods = yianGoods.filter((good) => {
    const matchesSource = goodsSourceFilter === "全部" || good.source === goodsSourceFilter;
    const matchesCategory = goodsCategoryFilter === "全部" || good.type === goodsCategoryFilter;
    const matchesSearch = !normalizedGoodsSearch || [good.name, good.type, good.detail, good.publisher]
      .some((value) => value.toLocaleLowerCase("zh-CN").includes(normalizedGoodsSearch));
    return matchesSource && matchesCategory && matchesSearch;
  });
  const hasGoodsFilters = Boolean(goodsSearch) || goodsSourceFilter !== "全部" || goodsCategoryFilter !== "全部";
  const clearGoodsFilters = () => {
    setGoodsSearch("");
    setGoodsSourceFilter("全部");
    setGoodsCategoryFilter("全部");
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
        {activeSection === "我的" && userRole !== "政务" && (
          <section className="profile-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="profile-hero">
              <div className="profile-hero__icon"><UserRound aria-hidden="true" /></div>
              <div><span>MY YI'AN</span><h1>我的义安</h1><p>当前角色：{userRole}端</p></div>
              <button className="role-change-button" type="button" onClick={() => setIsRoleSelectorOpen(true)}>切换角色</button>
            </header>
            {userRole === "村民" ? <>
              <section className="villager-profile-card"><div className="villager-profile-card__avatar">村</div><div><small>已认证村民 · 顺安镇</small><h2>王师傅，欢迎回家</h2><p>共建等级：银杏村民 3级</p></div></section>
              <section className="villager-profile-stats"><div><strong>{pointsBalance.toLocaleString()}</strong><small>可用积分</small></div><div><strong>8</strong><small>参与村务</small></div><button type="button" onClick={() => openVillagerDetail("publications", "我的发布")}><strong>{villagerPublications.length}</strong><small>我的发布</small></button><button type="button" onClick={openPointsOrders}><strong>{pointsOrders.length}</strong><small>我的兑换</small></button></section>
              <section className="villager-profile-section"><header><small>我的事项</small><h3>办理进度</h3></header><div className="villager-record-list"><article><span className="is-review">审核中</span><div><h4>自家富硒大米上架申请</h4><p>我的货摊 · 2026-07-26提交</p></div><button type="button" onClick={() => openVillagerDetail("record", "自家富硒大米上架申请")}>查看</button></article><article><span className="is-progress">处理中</span><div><h4>村东路口增设反光标识建议</h4><p>民情诉求 · 预计08月02日前反馈</p></div><button type="button" onClick={() => openVillagerDetail("record", "村东路口增设反光标识建议")}>查看</button></article><article><span className="is-done">已通过</span><div><h4>农村电商创业扶持补贴</h4><p>补贴申领 · 等待资金拨付</p></div><button type="button" onClick={() => openVillagerDetail("record", "农村电商创业扶持补贴")}>查看</button></article></div></section>
              <section className="villager-profile-section"><header><small>积分足迹</small><h3>最近积分流水</h3></header><div className="villager-points-history">{pointsTransactions.slice(0, 6).map((item) => <div key={item.id} className={item.points < 0 ? "is-spent" : ""}><span>{item.title}</span><strong>{item.points > 0 ? "+" : ""}{item.points}</strong><small>{new Date(item.createdAt).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}</small></div>)}</div></section>
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
                  const count = action.title === "我的收藏" ? favoriteGoods.length : action.title === "购买订单" ? goodsOrders.length : action.title === "游览足迹" ? browsingHistory.length : 0;
                  return <button type="button" key={action.title} onClick={() => { if (userRole !== "游客") return; if (action.title === "我的收藏") setPersonalRecordView({ page: "favorites" }); if (action.title === "购买订单") setPersonalRecordView({ page: "orders" }); if (action.title === "游览足迹") setPersonalRecordView({ page: "history" }); }}><span><Icon aria-hidden="true" /></span><strong>{action.title}</strong><small>{count ? `${count} 条本机记录` : action.detail}</small></button>;
                })}
              </div>
              <section className="profile-service-card"><div><small>账户服务</small><h3>{userRole === "游客" ? "登录后同步个人数据" : "完成政务人员认证"}</h3><p>{userRole === "游客" ? "收藏、订单和足迹将在登录后跨设备同步。" : "认证后可进入政务工作台处理审核和治理事项。"}</p></div><a href={MEITUAN_MINI_PROGRAM}>{userRole === "游客" ? "微信授权登录" : "前往政务认证"}</a></section>
            </>}
          </section>
        )}

        {isReady && activeSection === "智慧导览" && (
          <>
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
            {townDetails.filter((town) => town.mapHotspot).map((town) => (
              <button
                key={town.id}
                type="button"
                className={`scenic-hotspot scenic-hotspot--${town.id} town-hotspot`}
                style={{
                  left: `${town.mapHotspot!.x * 100}%`,
                  top: `${town.mapHotspot!.y * 100}%`,
                  width: town.mapHotspot!.width,
                  height: town.mapHotspot!.height,
                }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => openTown(town)}
                aria-label={`查看${town.name}详情`}
              />
            ))}
          </div>
          {userRole === "游客" && <nav className="tourist-side-tools" aria-label="游客便民服务" onPointerDown={(event) => event.stopPropagation()}>{(["义安天气", "投资义安", "投诉建议"] as TouristSideService[]).map((item) => <button type="button" key={item} onClick={() => { if (item === "投资义安") { setTouristQuickService(null); setSelectedInvestmentProject(null); setInvestmentCategory("全部"); setInvestmentView("list"); } else setTouristQuickService(item); }}>{item === "义安天气" ? <><span>26℃</span><strong><i>义安</i><i>天气</i></strong></> : item === "投资义安" ? <><Briefcase /><strong><i>投资</i><i>义安</i></strong></> : <><Megaphone /><strong><i>投诉</i><i>建议</i></strong></>}</button>)}</nav>}
          </>
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
                <header><div><small>一起建设家乡</small><h2>本周共建任务</h2></div><button type="button" onClick={() => { setVillagerSection("村务服务"); setActiveVillagerService("议事投票"); setActiveSection("村务服务"); }}>全部任务</button></header>
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
                    { title: "积分兑换", detail: "参与越多，收获越多", icon: ShoppingBag, section: "积分超市" as VillagerSection },
                    { title: "惠农服务", detail: "政策岗位及时掌握", icon: HomeIcon, section: "村务服务" as VillagerSection },
                  ].map((item) => { const Icon = item.icon; return <button type="button" key={item.title} onClick={() => { setVillagerSection(item.section); setActiveVillagerService(item.title === "我要建议" ? "民情诉求" : item.title === "分享好物" ? "我的货摊" : item.title === "积分兑换" ? "积分超市" : "补贴申领"); setActiveSection(item.section); }}><span><Icon /></span><strong>{item.title}</strong><small>{item.detail}</small></button>; })}
                </div>
              </section>

              <section className="villager-notice"><span>村务速递</span><strong>顺安镇本月村务公开信息已更新</strong><button type="button" onClick={() => openVillagerDetail("article", "顺安镇本月村务公开信息", "本月村务公开包含村级财务收支、公益项目进展、惠农政策落实和村民议事结果等内容。")}>查看详情</button></section>
            </> : <>
              {villagerSection !== "积分超市" && <section className="villager-category-intro"><small>{villagerSection === "村务服务" ? "信息公开 · 共建议事" : "我的资源 · 我来建设"}</small><h2>{villagerSection}</h2><p>{villagerSection === "村务服务" ? "村务信息看得见，议事投票可参与，培训课程随时学，惠农政策和就业服务送到家。" : "发布好物、盘活农房、反映诉求，让每份家乡资源都产生价值。"}</p></section>}
              {villagerSection !== "积分超市" && <nav className="villager-service-tabs" aria-label={`${villagerSection}功能`}>
                {villagerServices.filter((service) => service.group === villagerSection).map((service) => { const Icon = service.icon; return <button type="button" key={service.name} className={activeVillagerService === service.name ? "is-active" : ""} onClick={() => setActiveVillagerService(service.name)}><Icon /><span>{service.name}</span></button>; })}
              </nav>}
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
              {townDetails.map((town, index) => (
                <button type="button" className="charm-card" key={town.id} onClick={() => openTown(town)} style={{ animationDelay: `${index * 55}ms` }}>
                  <img src={imageUrl(town.scene)} alt={`${town.name}风光`} loading={index > 2 ? "lazy" : "eager"} decoding="async" />
                  <span className="charm-card__shade" />
                  <span className="charm-card__copy"><strong>{town.name}</strong><em>走进乡镇</em></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeSection === "宝藏义安" && userRole === "游客" && selectedTravelItem && (
          <section className="catalog-detail-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="catalog-detail-topbar">
              <button type="button" onClick={() => setSelectedTravelItem(null)} aria-label="返回宝藏义安列表"><ChevronLeft aria-hidden="true" /></button>
              <div><small>{selectedTravelItem.item.area} · {selectedTravelItem.item.subtype}</small><strong>宝藏义安详情</strong></div>
            </header>
            <div className="catalog-detail-body">
              <section className="catalog-detail-hero">
                <img src={publicAssetUrl(selectedTravelItem.item.image)} alt={selectedTravelItem.item.name} decoding="async" />
                <span />
                <div><small>{selectedTravelItem.item.area} · {selectedTravelItem.item.subtype}</small><h1>{selectedTravelItem.item.name}</h1></div>
              </section>
              <section className="catalog-detail-section"><h2>简介</h2><p>{selectedTravelItem.item.detail}</p></section>
              {selectedTravelItem.item.images && selectedTravelItem.item.images.length > 1 && <section className="catalog-detail-section"><h2>更多风貌</h2><div className="catalog-detail-gallery">{selectedTravelItem.item.images.map((image, index) => <img key={image} src={publicAssetUrl(image)} alt={`${selectedTravelItem.item.name}风貌${index + 1}`} loading="lazy" decoding="async" />)}</div></section>}
              <section className="catalog-detail-section"><h2>体验建议</h2><p>{selectedTravelItem.category === "景点" ? "建议提前了解开放时间和当日天气，合理安排游览路线，预留充足时间感受自然风光与在地文化。" : selectedTravelItem.category === "美食" ? "建议结合用餐人数提前联系商家，优先品尝当季食材和义安地方风味，高峰时段可提前预约。" : selectedTravelItem.category === "住宿" ? "建议根据出行人数、入住日期和行程安排提前预订，并确认房型、停车及周边配套信息。" : "建议到店了解文创的实际展示与供应信息，具体内容以现场为准。"}</p></section>
              <section className="catalog-detail-section catalog-detail-info"><h2>出行信息</h2><dl><div><dt>所在区域</dt><dd>{selectedTravelItem.item.area}</dd></div><div><dt>内容类型</dt><dd>{selectedTravelItem.item.subtype}</dd></div><div><dt>温馨提示</dt><dd>营业、开放及服务信息可能调整，出行前建议再次确认。</dd></div></dl></section>
            </div>
            <footer className="catalog-detail-action"><a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(`铜陵义安区${selectedTravelItem.item.name}`)}&callnative=1`} target="_blank" rel="noreferrer"><Compass aria-hidden="true" />地图导航</a></footer>
          </section>
        )}

        {activeSection === "宝藏义安" && userRole === "游客" && !selectedTravelItem && (
          <section className="catalog-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="catalog-hero">
              <span>TRAVEL & STAY</span>
              <h1>宝藏义安，一站尽览</h1>
              <p>汇集义安代表性景区、地方餐饮、品质住宿与文创项目，点击查看详情了解更多。</p>
            </header>
            <nav className="catalog-tabs" aria-label="宝藏义安分类">
              {travelCategories.map((category) => <button type="button" key={category} className={activeTravelCategory === category ? "is-active" : ""} onClick={() => setActiveTravelCategory(category)}><strong>{category}</strong></button>)}
            </nav>
            <div className="catalog-grid">
              {travelCatalog[activeTravelCategory].map((item, index) => (
                <article className="catalog-card" key={item.name} role="button" tabIndex={0} onClick={() => setSelectedTravelItem({ item, category: activeTravelCategory })} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedTravelItem({ item, category: activeTravelCategory }); } }}>
                  <img src={publicAssetUrl(item.image)} alt={item.name} loading={index > 3 ? "lazy" : "eager"} decoding="async" />
                  <div><span>{item.area} · {item.subtype}</span><h2>{item.name}</h2><p>{item.detail}</p><strong className="catalog-card__more">查看详情 <span>›</span></strong></div>
                </article>
              ))}
            </div>
            <small className="catalog-note">营业时间、开放信息和服务内容可能调整，出行前请通过官方渠道或地图平台确认。</small>
          </section>
        )}

        {activeSection === "义安好物" && userRole === "游客" && (
          <section className="goods-view" onPointerDown={(event) => event.stopPropagation()}>
            <header className="goods-hero"><span>GIFTS FROM YI'AN</span><h1>义安好物</h1><p>把白姜的清脆、酥糖的香甜、凤丹的芬芳与千年铜韵带回家。</p></header>
            <section className="goods-filter-panel" aria-label="义安好物搜索与筛选">
              <label className="goods-search">
                <Search aria-hidden="true" />
                <input value={goodsSearch} onChange={(event) => setGoodsSearch(event.target.value)} placeholder="搜索好物" aria-label="搜索义安好物" />
                {goodsSearch && <button type="button" onClick={() => setGoodsSearch("")} aria-label="清除搜索内容"><X aria-hidden="true" /></button>}
              </label>
              <label className="goods-compact-filter"><span>来源</span><select aria-label="发布来源筛选" value={goodsSourceFilter} onChange={(event) => setGoodsSourceFilter(event.target.value as GoodsSourceFilter)}>{goodsSourceFilters.map((source) => <option key={source}>{source}</option>)}</select></label>
              <label className="goods-compact-filter"><span>类别</span><select aria-label="商品类别筛选" value={goodsCategoryFilter} onChange={(event) => setGoodsCategoryFilter(event.target.value)}><option>全部</option>{goodsCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
            </section>
            {filteredGoods.length > 0 ? <div className="goods-grid">
              {filteredGoods.map((item, index) => (
                <article className="goods-card" key={item.name} onClick={() => openGood(item)}>
                  <div className="goods-card__image"><img src={imageUrl(`${item.scene}, realistic, natural light, no text, no watermark`)} alt={item.name} loading={index > 3 ? "lazy" : "eager"} decoding="async" /><span className={`goods-source-badge ${item.source === "官方甄选" ? "is-official" : "is-villager"}`}><b aria-hidden="true">{item.source === "官方甄选" ? "◆" : "●"}</b>{item.source}</span></div>
                  <div className="goods-card__body"><small>{item.type}</small><h2>{item.name}</h2><span className="goods-card__publisher">{item.publisher}</span><p>{item.detail}</p><button type="button" className={item.source === "农特商品" ? "is-contact" : ""} onClick={(event) => { event.stopPropagation(); openGood(item); }}>{item.source === "官方甄选" ? "在线购买" : "电话联系"}</button></div>
                </article>
              ))}
            </div> : <div className="goods-empty" role="status"><Search aria-hidden="true" /><strong>暂未找到匹配的好物</strong><p>换个关键词或调整发布来源、商品类别试试。</p><button type="button" onClick={clearGoodsFilters}>清除全部筛选</button></div>}
            <small className="catalog-note">产品图片为主题视觉展示，实际包装、规格和售价以正规销售渠道为准。</small>
          </section>
        )}

        {isReady && (
          <nav className="map-menu" aria-label={userRole === "游客" ? "义安旅游服务" : "义安村民服务"} onPointerDown={(event) => event.stopPropagation()}>
            {userRole === "游客" ? <>
              <button type="button" className={activeSection === "智慧导览" ? "is-active" : ""} onClick={() => setActiveSection("智慧导览")}><MapIcon aria-hidden="true" /><span>导览</span></button>
              <button type="button" className={activeSection === "魅力义安" ? "is-active" : ""} onClick={() => setActiveSection("魅力义安")}><Compass aria-hidden="true" /><span>魅力义安</span></button>
              <button type="button" className={activeSection === "宝藏义安" ? "is-active" : ""} onClick={() => setActiveSection("宝藏义安")}><Store aria-hidden="true" /><span>宝藏义安</span></button>
              <button type="button" className={activeSection === "义安好物" ? "is-active" : ""} onClick={() => setActiveSection("义安好物")}><ShoppingBag aria-hidden="true" /><span>义安好物</span></button>
              <button type="button" className={activeSection === "我的" ? "is-active" : ""} onClick={() => setActiveSection("我的")}><UserRound aria-hidden="true" /><span>我的</span></button>
            </> : userRole === "村民" ? <>
              <button type="button" className={villagerSection === "村民首页" && activeSection !== "我的" ? "is-active" : ""} onClick={() => { setVillagerSection("村民首页"); setActiveSection("村民首页"); }}><HomeIcon aria-hidden="true" /><span>首页</span></button>
              <button type="button" className={villagerSection === "村务服务" && activeSection !== "我的" ? "is-active" : ""} onClick={() => { setVillagerSection("村务服务"); setActiveVillagerService("村务公开"); setActiveSection("村务服务"); }}><MapIcon aria-hidden="true" /><span>村务服务</span></button>
              <button type="button" className={villagerSection === "积分超市" && activeSection !== "我的" ? "is-active" : ""} onClick={() => { setVillagerSection("积分超市"); setActiveVillagerService("积分超市"); setActiveSection("积分超市"); }}><ShoppingBag aria-hidden="true" /><span>积分超市</span></button>
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
            <header className="villager-detail-page__header"><button type="button" onClick={() => { if (villagerDetail.type === "points-checkout") { const good = pointsGoods.find((item) => item.id === villagerDetail.id); if (good) openPointsGood(good); } else if (villagerDetail.type === "points-order-detail") openPointsOrders(); else setVillagerDetail(null); }} aria-label="返回村民服务"><ChevronLeft aria-hidden="true" /><span>返回</span></button><strong>义安村民服务</strong></header>
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
                  { role: "游客" as UserRole, title: "游客端", detail: "智慧导览、魅力义安、宝藏义安与义安好物", icon: Compass },
                  { role: "村民" as UserRole, title: "村民端", detail: "村务服务、积分超市、资源发布与惠农服务", icon: HomeIcon },
                  { role: "政务" as UserRole, title: "政务端", detail: "村务管理、内容审核、民情处理与运营数据", icon: UserRound },
                ]).map((item) => {
                  const Icon = item.icon;
                  return <button type="button" key={item.role} className={userRole === item.role ? "is-current" : ""} onClick={() => {
                    setUserRole(item.role);
                    setIsRoleSelectorOpen(false);
                    setPersonalRecordView(null);
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
                <div className="goods-detail-modal__meta"><span className={`goods-source-badge ${selectedGood.source === "官方甄选" ? "is-official" : "is-villager"}`}><b aria-hidden="true">{selectedGood.source === "官方甄选" ? "◆" : "●"}</b>{selectedGood.source}</span><small>{selectedGood.type}</small></div>
                <h2 id="goods-detail-title">{selectedGood.name}</h2>
                <p>{selectedGood.detail}</p>
                <dl><div><dt>发布主体</dt><dd>{selectedGood.publisher}</dd></div><div><dt>可选规格</dt><dd>{selectedGood.specification}</dd></div><div><dt>购买说明</dt><dd>{selectedGood.service}</dd></div></dl>
                <div className="goods-detail-modal__actions"><button type="button" className={favoriteGoods.includes(selectedGood.name) ? "is-favorite" : ""} onClick={() => toggleFavoriteGood(selectedGood)}><Heart aria-hidden="true" fill={favoriteGoods.includes(selectedGood.name) ? "currentColor" : "none"} />{favoriteGoods.includes(selectedGood.name) ? "已收藏" : "收藏好物"}</button>{selectedGood.source === "官方甄选" ? <button type="button" className="goods-detail-modal__buy" onClick={() => startGoodsCheckout(selectedGood)}><ShoppingBag aria-hidden="true" />立即购买</button> : <a className="goods-detail-modal__contact" href={`tel:${villagerGoodsPhones[selectedGood.name]}`}><Phone aria-hidden="true" />电话联系</a>}</div>
              </div>
            </section>
          </div>
        )}

        {touristQuickService && (
          <div className="spot-modal-backdrop quick-service-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setTouristQuickService(null)}>
            <section className="quick-service-modal" role="dialog" aria-modal="true" aria-labelledby="quick-service-title" onClick={(event) => event.stopPropagation()}>
              <header><div><small>义安游客服务</small><h2 id="quick-service-title">{touristQuickService}</h2></div><button type="button" onClick={() => setTouristQuickService(null)} aria-label={`关闭${touristQuickService}`}>×</button></header>
              {touristQuickService === "义安天气" ? <div className="weather-service"><div className="weather-current"><strong>26℃</strong><div><h3>多云转晴</h3><p>义安区今日 23—31℃，东南风2级，适宜户外游览。</p></div></div><ul className="weather-metrics"><li><span>空气</span><b>优 28</b></li><li><span>湿度</span><b>68%</b></li><li><span>紫外线</span><b>中等</b></li><li><span>能见度</span><b>12 km</b></li></ul><section className="weather-forecast"><header><h3>24小时预报</h3><span>逐小时更新</span></header><div className="weather-hourly">{[{ t: "现在", w: "多云", v: "26°" }, { t: "12时", w: "晴", v: "28°" }, { t: "15时", w: "晴", v: "31°" }, { t: "18时", w: "多云", v: "28°" }, { t: "21时", w: "多云", v: "25°" }, { t: "00时", w: "晴", v: "24°" }, { t: "03时", w: "晴", v: "23°" }, { t: "06时", w: "多云", v: "24°" }].map((item) => <article key={item.t}><small>{item.t}</small><span>{item.w}</span><strong>{item.v}</strong></article>)}</div></section><section className="weather-forecast"><header><h3>最近7天</h3><span>义安区</span></header><div className="weather-weekly">{[{ d: "今天", w: "多云转晴", l: "23°", h: "31°" }, { d: "周四", w: "晴", l: "24°", h: "33°" }, { d: "周五", w: "雷阵雨", l: "25°", h: "32°" }, { d: "周六", w: "小雨", l: "24°", h: "29°" }, { d: "周日", w: "多云", l: "23°", h: "30°" }, { d: "周一", w: "晴", l: "24°", h: "32°" }, { d: "周二", w: "多云", l: "25°", h: "33°" }].map((item) => <article key={item.d}><strong>{item.d}</strong><span>{item.w}</span><small>{item.l} / <b>{item.h}</b></small></article>)}</div></section></div> : <form className="quick-service-form" onSubmit={(event) => { event.preventDefault(); setTouristQuickService(null); }}><label>建议类型<select><option>旅游服务</option><option>景区管理</option><option>交通出行</option><option>市场消费</option></select></label><label>投诉建议<textarea placeholder="请描述具体问题、时间和地点" required /></label><label>联系方式<input placeholder="手机号（选填）" /></label><button type="submit">提交建议</button></form>}
            </section>
          </div>
        )}

        {selectedCharmTown && (
          <div className="spot-modal-backdrop charm-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelectedCharmTown(null)}>
            <section className="spot-modal charm-modal town-unified-modal" role="dialog" aria-modal="true" aria-labelledby="charm-town-title" onClick={(event) => event.stopPropagation()}>
              <div className="charm-modal__image">
                <img src={imageUrl(selectedCharmTown.scene)} alt={`${selectedCharmTown.name}风光`} />
                <span />
                <a className="charm-modal__navigate" href={`https://uri.amap.com/search?keyword=${encodeURIComponent(selectedCharmTown.mapKeyword)}&callnative=1`} target="_blank" rel="noreferrer" aria-label={`导航到${selectedCharmTown.name}`}><Compass aria-hidden="true" />导航</a>
                <button type="button" onClick={() => setSelectedCharmTown(null)} aria-label="关闭乡镇介绍">×</button>
                <div><small>{selectedCharmTown.subtitle}</small><h2 id="charm-town-title">{selectedCharmTown.name}</h2></div>
              </div>
              <nav className="charm-guide-tabs town-unified-tabs" aria-label={`${selectedCharmTown.name}详情栏目`}>
                {townDetailTabs.map((category) => (
                  <button type="button" key={category} className={activeCharmCategory === category ? "is-active" : ""} onClick={() => setActiveCharmCategory(category)}>{category}</button>
                ))}
              </nav>
              <div className="charm-modal__body town-unified-body">
                {activeCharmCategory === "镇情概览" ? (
                  <div className="town-overview">
                    <span className="charm-modal__eyebrow">魅力义安 · 乡镇印象</span>
                    <p>{selectedCharmTown.intro}</p>
                    <div className="charm-highlights">{selectedCharmTown.highlights.map((item) => <span key={item}>{item}</span>)}</div>
                    <dl className="town-overview-facts">
                      <div><dt>代表景点</dt><dd>{selectedCharmTown.representativeAttractions.join("、")}</dd></div>
                      <div><dt>特色产业</dt><dd>{selectedCharmTown.industries.join("、")}</dd></div>
                      <div><dt>推荐季节</dt><dd>{selectedCharmTown.bestSeason}</dd></div>
                      <div><dt>建议停留</dt><dd>{selectedCharmTown.duration}</dd></div>
                    </dl>
                    <a className="town-overview-navigate" href={`https://uri.amap.com/search?keyword=${encodeURIComponent(selectedCharmTown.mapKeyword)}&callnative=1`} target="_blank" rel="noreferrer"><Compass aria-hidden="true" />导航前往{selectedCharmTown.name}</a>
                  </div>
                ) : activeCharmCategory === "下属村庄" ? (
                  <div className="town-village-list">
                    {selectedCharmTown.villages.map((item) => (
                      <article className="town-village-card" key={item.name}>
                        <div><small>下属村庄</small><h3>{item.name}</h3><p>{item.intro}</p></div>
                        <dl><div><dt>产业 / 资源</dt><dd>{item.resource}</dd></div><div><dt>景点 / 农产品</dt><dd>{item.representative}</dd></div></dl>
                        <a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(item.mapKeyword)}&callnative=1`} target="_blank" rel="noreferrer" aria-label={`导航到${item.name}`}><Compass aria-hidden="true" />导航</a>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="charm-guide-list">
                    {selectedCharmTown.guides[activeCharmCategory].map((item) => (
                      <article key={item.name} className="charm-guide-card">
                        <img src={imageUrl(guideScene(selectedCharmTown, activeCharmCategory, item.name))} alt={`${selectedCharmTown.name}${item.name}`} loading="lazy" decoding="async" />
                        <div><span>{activeCharmCategory}</span><strong>{item.name}</strong><p>{item.detail}</p></div>
                      </article>
                    ))}
                  </div>
                )}
                <small className="detail-disclaimer">图像为乡镇主题视觉展示，具体景观、活动、营业和开放信息以当地实际情况为准。</small>
              </div>
            </section>
          </div>
        )}

        {personalRecordView && userRole === "游客" && renderPersonalRecordView()}

        {goodsOrderView && userRole === "游客" && (
          <section className="goods-order-view" onPointerDown={(event) => event.stopPropagation()}>
            {renderGoodsOrderView()}
          </section>
        )}

        {investmentView && userRole === "游客" && (
          <section className="investment-view" onPointerDown={(event) => event.stopPropagation()}>
            {renderInvestmentView()}
          </section>
        )}

        {selectedSpot && (
          <div className="spot-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelectedSpot(null)}>
            <section className="spot-modal home-spot-modal" role="dialog" aria-modal="true" aria-labelledby="spot-title" onClick={(event) => event.stopPropagation()}>
              <div className="home-spot-modal__image">
                <img src={imageUrl(selectedSpot.scene)} alt={`${selectedSpot.name}景区风光`} decoding="async" />
                <span />
                <div className="home-spot-modal__actions">
                  <a className="is-vr" href={selectedSpot.vrUrl} target="_blank" rel="noreferrer" aria-label={`打开${selectedSpot.name}VR导览`}>VR导览</a>
                  <a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(selectedSpot.mapKeyword)}&callnative=1`} target="_blank" rel="noreferrer" aria-label={`导航到${selectedSpot.name}`}>导航</a>
                  <a href={MEITUAN_MINI_PROGRAM} aria-label={`购买${selectedSpot.name}门票`}>购票</a>
                </div>
                <button type="button" onClick={() => setSelectedSpot(null)} aria-label="关闭景区详情">×</button>
                <div className="home-spot-modal__heading"><small>义安智慧导览</small><h2 id="spot-title">{selectedSpot.name}</h2></div>
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
