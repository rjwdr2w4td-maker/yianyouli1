import { useCallback, useEffect, useRef, useState } from "react";

const TOUR_DURATION = 42000;
const MAX_ZOOM = 4;
const MAP_WIDTH = 2048;
const MAP_HEIGHT = 1388;

const scenicSpots = [
  {
    id: "liqiao",
    name: "犁桥水镇",
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
  x: 0.508,
  y: 0.285,
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
          fetchPriority="high"
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

        {isReady && (
          <nav className="map-menu" aria-label="义安旅游服务" onPointerDown={(event) => event.stopPropagation()}>
            {[
              ["智慧导览", "#guide"],
              ["魅力义安", "#yian"],
              ["商旅食宿", "#travel"],
              ["投资建设", "#invest"],
            ].map(([label, href], index) => (
              <a key={label} className={index === 0 ? "is-active" : ""} href={href}>{label}</a>
            ))}
          </nav>
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
                  {shunanTown.categories[activeTownCategory].map((item, index) => (
                    <article className="town-card" key={item.name}>
                      <div className="town-card-number">{String(index + 1).padStart(2, "0")}</div>
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
