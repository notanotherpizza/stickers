import { useEffect, useRef, useState } from "react";
import {
  AnnotatedImage,
  calculatePointSize,
  checkIntersect,
  Point,
  pointDistance,
} from "@/components/PolygonMaker/utils";
import AnnotationBox from "./AnnotationBox";

const fillStyles = [
  "rgba(239,68,68,0.5)",
  "rgba(234,88,12,0.5)",
  "rgba(5,150,105,0.5)",
  "rgba(13,148,136,0.5)",
  "rgba(14,165,233,0.5)",
  "rgba(139,92,246,0.5)",
  "rgba(168,85,247,0.5)",
  "rgba(225,29,72,0.5)",
  "rgba(219,39,119,0.5)",
  "rgba(232,121,249,0.5)",
  "rgba(77,124,15,0.5)",
  "rgba(52,211,153,0.5)",
  "rgba(29,78,216,0.5)",
  "rgba(255, 0, 0, 0.5)",
];

export default function PolygonMaker({ img }: { img: AnnotatedImage }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [perimeter, setPerimeter] = useState<Point[]>([]);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);

  const [annotatedImage, setAnnotatedImage] = useState<AnnotatedImage>({
    ...img,
  });

  const pushNewPolygon = (polygon: Point[], fillStyle: string) => {
    setAnnotatedImage((v) => ({
      ...v,
      annotations: [
        ...v.annotations,
        {
          title: "",
          description: "",
          fillStyle: fillStyle,
          polygon,
        },
      ],
    }));
  };

  const removeAnnotation = (index: number) => {
    setAnnotatedImage((v) => ({
      ...v,
      annotations: v.annotations.filter((_, i) => i !== index),
    }));
  };

  const setAnnotationTitle = (title: string) => {
    setAnnotatedImage((v) => ({
      ...v,
      title,
    }));
  };

  const editAnnotation = (index: number, field: string, value: string) => {
    setAnnotatedImage((v) => ({
      ...v,
      annotations: v.annotations.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }));
  };

  const moveAnnotation = (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= annotatedImage.annotations.length) {
      return;
    }

    setAnnotatedImage((v) => {
      const annotations = [...v.annotations];
      [annotations[index], annotations[swapIndex]] = [
        annotations[swapIndex],
        annotations[index],
      ];

      return {
        ...v,
        annotations,
      };
    });
  };

  const getPointFromEvent = (e: React.MouseEvent): Point => {
    if (!canvasRef.current || !ctx) {
      return { x: 0, y: 0 };
    }

    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left) * (ctx.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (ctx.canvas.height / rect.height),
    };
  };

  const saveAnnotations = () => {
    const link = document.createElement("a");

    const file = new Blob([JSON.stringify(annotatedImage)], {
      type: "application/json",
    });

    link.href = URL.createObjectURL(file);
    link.download = "annotations.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const img = new Image();
    img.src = annotatedImage.src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setCtx(ctx);
      setBgImg(img);
    };
  }, [annotatedImage.src]);

  // const resetCanvas = useCallback(() => {}, []);

  const addPoint = (ctx: CanvasRenderingContext2D, p: Point) => {
    const { x, y } = p;

    const pointSize = calculatePointSize(ctx);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.fillRect(x - 2, y - 2, pointSize, pointSize);
    ctx.moveTo(x, y);
  };

  useEffect(() => {
    if (!canvasRef.current || !ctx || !bgImg) {
      return;
    }

    const drawPolygon = (
      ctx: CanvasRenderingContext2D,
      annotation: { polygon: Point[]; fillStyle: string },
      fill: boolean
    ) => {
      // We may want to draw and fill a polygon or simply draw the points that
      // make it up with lines between them.

      ctx.lineWidth = calculatePointSize(ctx) / 6;
      ctx.strokeStyle = "white";
      ctx.lineCap = "square";
      ctx.beginPath();

      const { polygon } = annotation;

      for (let i = 0; i < polygon.length; i++) {
        if (i == 0) {
          ctx.moveTo(polygon[i].x, polygon[i].y);
          if (!fill) {
            addPoint(ctx, polygon[i]);
          }
        } else {
          ctx.lineTo(polygon[i].x, polygon[i].y);
          if (!fill) {
            addPoint(ctx, polygon[i]);
          }
        }
      }

      if (fill) {
        ctx.lineTo(polygon[0].x, polygon[0].y);
        ctx.closePath();
        ctx.fillStyle = annotation.fillStyle;
        ctx.fill();
        ctx.strokeStyle = "blue";
      }

      ctx.stroke();
    };

    const drawCurrentPoint = (ctx: CanvasRenderingContext2D) => {
      if (!currentPoint) {
        return;
      }

      addPoint(ctx, currentPoint);

      const lastPoint = perimeter.at(-1);
      if (!lastPoint) {
        return;
      }

      console.log(lastPoint);

      ctx.lineWidth = calculatePointSize(ctx) / 6;
      ctx.strokeStyle = "white";
      ctx.lineCap = "square";
      ctx.beginPath();

      ctx.moveTo(currentPoint.x, currentPoint.y);
      ctx.lineTo(lastPoint.x, lastPoint.y);

      ctx.stroke();
    };

    // Reset the canvas on each render.
    ctx?.drawImage(bgImg, 0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const annotation of annotatedImage.annotations) {
      drawPolygon(ctx, annotation, true);
    }

    drawPolygon(ctx, { polygon: perimeter, fillStyle: "" }, false);

    drawCurrentPoint(ctx);
  }, [currentPoint, perimeter, annotatedImage.annotations, ctx, bgImg]);

  const closePolygon = () => {
    if (perimeter.length <= 2) {
      alert("Your polygon must have at least 3 points.");
      return;
    }

    pushNewPolygon(
      perimeter,
      fillStyles[annotatedImage.annotations.length % fillStyles.length]
    );
    setPerimeter([]);
  };

  const handleImageClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef.current || !ctx) {
      return;
    }

    // If we've control-clicked, close the polygon.
    if (e.ctrlKey === true) {
      closePolygon();
      e.preventDefault();
      return;
    }

    // If we've right-clicked, undo the last point.
    if (e.button === 2) {
      setPerimeter(perimeter.slice(0, -1));
      return;
    }

    const point = getPointFromEvent(e);

    // If it's the same point as the last, it's a double click.
    // Ignore it.
    if (
      perimeter.length > 0 &&
      point.x == perimeter.at(-1)!.x &&
      point.y == perimeter.at(-1)!.y
    ) {
      return;
    }

    // If the last click is within a bounding box of the first point, close the polygon.
    const maxDistance = calculatePointSize(ctx) + 30;
    const lastClickWithinBoundingBox =
      perimeter[0] !== undefined &&
      pointDistance(perimeter[0], point) < maxDistance;

    if (lastClickWithinBoundingBox) {
      closePolygon();
      return;
    }

    if (checkIntersect(perimeter, point)) {
      alert(
        "The line you are drawing intersects another line in your polygon."
      );
      return;
    }

    setPerimeter([...perimeter, point]);
  };

  const setHoverCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPointFromEvent(e);
    setCurrentPoint(point);
  };

  return (
    <div className='flex items-center justify-center w-screen h-screen p-4 space-x-4'>
      <div className='w-3/4'>
        <canvas
          className='w-full cursor-crosshair'
          ref={canvasRef}
          onMouseDown={(e) => handleImageClick(e)}
          onContextMenu={(e) => e.preventDefault()}
          onMouseMove={(e) => setHoverCoordinates(e)}
          onMouseLeave={() => setCurrentPoint(null)}
        />
      </div>

      {annotatedImage.annotations.length === 0 ? (
        <div className='flex flex-col items-center justify-center w-1/4 h-full space-y-2 text-center'>
          <p>
            Gonna be honest, this is designed for desktop. If you&apos;re on
            mobile, your mileage may vary.
          </p>
          <p>
            Click to draw a point on your image. Right-click to undo the last
            point. Press CTRL+click or click the first point to close your
            shape.
          </p>
          <p>
            Once you complete a shape, you&apos;ll see an annotation display
            here. Each annotation gets filled with a random colour.
          </p>
          <p>
            If you have multiple annotations, the up and down arrows can change
            the &ldquo;layering&rdquo; order. If a user clicks on an overlapping
            annotation, annotation earliest in the list will be read.
          </p>
        </div>
      ) : (
        <div className='flex flex-col items-center w-1/4 h-full py-2 space-y-3 overflow-y-auto'>
          {annotatedImage.annotations.map((annotation, i) => (
            <AnnotationBox
              key={i}
              index={i}
              annotation={annotation}
              moveAnnotation={(direction: "up" | "down") =>
                moveAnnotation(i, direction)
              }
              removeAnnotation={() => removeAnnotation(i)}
              onChange={(field, value) => editAnnotation(i, field, value)}
            />
          ))}
          <div className='w-full mt-5'>
            <button
              type='button'
              className='w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={() => {
                const title = prompt(
                  "Enter a title for this annotation. For example: 'my work MacBook'."
                );

                setAnnotationTitle(title ?? "My stickers!");
                saveAnnotations();
              }}>
              Save annotations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
