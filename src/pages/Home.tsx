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
    intro: "犁桥水镇以江南水乡风貌、古建街巷和夜游体验为特色，适合亲子休闲、民俗体验与夜景游览。",
    services: ["游客咨询", "餐饮休憩", "亲子游览", "夜游服务"],
    traffic: "位于铜陵市义安区西联镇犁桥村，建议自驾或乘坐网约车前往，节假日请关注临时交通管制。",
    shows: ["水镇民俗互动｜具体场次以当天公告为准", "水上光影与夜游演艺｜具体场次以当天公告为准"],
    mapKeyword: "安徽铜陵犁桥水镇",
    ticket: "景区开放及收费项目以官方当天公示为准。",
  },
  {
    id: "yongquan",
    name: "永泉小镇",
    x: 0.654,
    y: 0.409,
    intro: "永泉小镇融合江南园林、山水度假、美食体验与温泉休闲，是义安区具有代表性的综合度假目的地。",
    services: ["游客中心", "餐饮住宿", "温泉度假", "停车服务"],
    traffic: "位于铜陵市义安区钟鸣镇，靠近高速及城市主干道，自驾导航至永泉小镇游客中心更便捷。",
    shows: ["江南民俗演艺｜具体场次以当天公告为准", "夜间沉浸式游园｜具体场次以当天公告为准"],
    mapKeyword: "安徽铜陵永泉小镇",
    ticket: "不同园区、温泉及住宿产品票价不同，请以景区官方售票渠道为准。",
  },
  {
    id: "fenghuangshan",
    name: "凤凰山景区",
    x: 0.576,
    y: 0.778,
    intro: "凤凰山景区以自然山水、牡丹文化和乡野景观著称，适合登山观景、春季赏花与生态休闲。",
    services: ["旅游咨询", "登山游览", "停车服务", "休息补给"],
    traffic: "位于铜陵市义安区顺安镇凤凰山一带，山地道路较多，建议提前查看天气并按导航路线前往。",
    shows: ["牡丹文化活动｜花期及场次以景区公告为准", "节庆文旅活动｜具体安排以当天公告为准"],
    mapKeyword: "安徽铜陵凤凰山景区",
    ticket: "开放时间、活动票及相关收费以景区现场或官方公告为准。",
  },
] as const;

type ScenicSpot = (typeof scenicSpots)[number];
type DetailTab = "介绍" | "服务" | "交通" | "演出节目单" | "导航" | "购票";
const detailTabs: DetailTab[] = ["介绍", "服务", "交通", "演出节目单", "导航", "购票"];

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
    setActiveTab("介绍");
  };

  const renderDetail = () => {
    if (!selectedSpot) return null;
    if (activeTab === "介绍") return <p>{selectedSpot.intro}</p>;
    if (activeTab === "服务") return <ul>{selectedSpot.services.map((item: string) => <li key={item}>{item}</li>)}</ul>;
    if (activeTab === "交通") return <p>{selectedSpot.traffic}</p>;
    if (activeTab === "演出节目单") return <ul>{selectedSpot.shows.map((item: string) => <li key={item}>{item}</li>)}</ul>;
    if (activeTab === "导航") {
      return (
        <div className="action-panel">
          <p>点击下方按钮，在地图应用中打开“{selectedSpot.name}”点位。</p>
          <a href={`https://uri.amap.com/search?keyword=${encodeURIComponent(selectedSpot.mapKeyword)}&callnative=1`} target="_blank" rel="noreferrer">打开地图导航</a>
        </div>
      );
    }
    return (
      <div className="action-panel">
        <p>{selectedSpot.ticket}</p>
        <a href={`https://www.baidu.com/s?wd=${encodeURIComponent(`${selectedSpot.name} 官方购票`)}`} target="_blank" rel="noreferrer">查询官方购票</a>
      </div>
    );
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
                className="scenic-hotspot"
                style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%` }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => openSpot(spot)}
                aria-label={`查看${spot.name}`}
              >
                <span className="hotspot-pulse" />
                <strong>{spot.name}</strong>
              </button>
            ))}
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

        {selectedSpot && (
          <div className="spot-modal-backdrop" role="presentation" onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelectedSpot(null)}>
            <section className="spot-modal" role="dialog" aria-modal="true" aria-labelledby="spot-title" onClick={(event) => event.stopPropagation()}>
              <header>
                <div>
                  <span>义安智慧导览</span>
                  <h2 id="spot-title">{selectedSpot.name}</h2>
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
