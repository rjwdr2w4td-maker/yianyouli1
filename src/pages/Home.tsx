import { useCallback, useEffect, useRef, useState } from "react";

const TOUR_DURATION = 42000;
const MAX_ZOOM = 4;

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
  const animationRef = useRef<Animation | null>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const viewRef = useRef<ViewTransform>({ x: 0, y: 0, scale: 1 });
  const gestureRef = useRef<Gesture>({ x: 0, y: 0, scale: 1 });
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isHighResolution, setIsHighResolution] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const getMinimumScale = useCallback(() => {
    const stage = stageRef.current;
    const map = mapRef.current;
    if (!stage || !map) return 1;

    const widthScale = stage.clientWidth / map.naturalWidth;
    const heightScale = stage.clientHeight / map.naturalHeight;
    return Math.max(widthScale, heightScale) * 1.01;
  }, []);

  const constrainView = useCallback((view: ViewTransform) => {
    const stage = stageRef.current;
    const map = mapRef.current;
    if (!stage || !map) return view;

    const minScale = getMinimumScale();
    const scale = Math.min(Math.max(view.scale, minScale), minScale * MAX_ZOOM);
    const renderedWidth = map.naturalWidth * scale;
    const renderedHeight = map.naturalHeight * scale;
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
  }, [constrainView]);

  const takeOverAnimation = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const matrix = new DOMMatrixReadOnly(getComputedStyle(map).transform);
    const current = { x: matrix.m41, y: matrix.m42, scale: Math.hypot(matrix.m11, matrix.m12) };
    animationRef.current?.cancel();
    animationRef.current = null;
    applyView(current);
    setIsPaused(true);
    setIsManual(true);
  }, [applyView]);

  const buildTour = useCallback(() => {
    const stage = stageRef.current;
    const map = mapRef.current;
    if (!stage || !map) return;

    animationRef.current?.cancel();
    map.style.transform = "";
    const viewportWidth = stage.clientWidth;
    const viewportHeight = stage.clientHeight;
    const mapWidth = map.naturalWidth;
    const mapHeight = map.naturalHeight;
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
      </div>
    </main>
  );
}
