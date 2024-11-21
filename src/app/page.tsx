"use client";
import { createElement, useEffect, useRef, useState } from "react";

import annotatedImage from "./annotations.json";
import {
  AnnotatedImage,
  calculatePointSize,
  Point,
} from "@/components/PolygonMaker/utils";
import InfoBox from "@/components/InfoBox";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(true);
  const [infoBox, setInfoBox] = useState<{
    title: string;
    description: string;
  } | null>({
    title: "Welcome to my sticker library!",
    description:
      "Hello! I have lots of stickers on my laptop. So, I built a small web app to share them with people. It isn't particularly fancy (or well written, for that matter), but it gets the job done. I hope you enjoy it!",
  });

  const { src, annotations } = annotatedImage as AnnotatedImage;

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
    img.src = src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // We may want to draw and fill a polygon or simply draw the points that
      // make it up with lines between them.

      for (let annotation of annotations) {
        ctx.lineWidth = calculatePointSize(ctx) / 6;
        ctx.lineCap = "square";
        ctx.beginPath();

        const { polygon } = annotation;

        for (let i = 0; i < polygon.length; i++) {
          if (i == 0) {
            ctx.moveTo(polygon[i].x, polygon[i].y);
          } else {
            ctx.lineTo(polygon[i].x, polygon[i].y);
          }
        }

        ctx.lineTo(polygon[0].x, polygon[0].y);
        ctx.closePath();
        ctx.fillStyle = annotation.fillStyle;
        console.log(annotation.fillStyle);
        ctx.fill();
        ctx.strokeStyle = "grey";

        ctx.stroke();
      }
    };
  }, [canvasRef.current]);

  const openAnnotation = (annotation: AnnotatedImage["annotations"][0]) => {
    (async () => {
      if (open) {
        setOpen(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setInfoBox({
        title: annotation.title,
        description: annotation.description,
      });
      setOpen(true);
    })();
  };

  const getPointFromEvent = (e: React.MouseEvent): Point => {
    if (!canvasRef.current) {
      return { x: 0, y: 0 };
    }

    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (e.clientY - rect.top) * (canvasRef.current.height / rect.height),
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const ctx = canvasRef.current!.getContext("2d");

    for (let annotation of annotations) {
      const { polygon } = annotation;

      const point = getPointFromEvent(e);

      const path = new Path2D();

      for (let i = 0; i < polygon.length; i++) {
        if (i == 0) {
          path.moveTo(polygon[i].x, polygon[i].y);
        } else {
          path.lineTo(polygon[i].x, polygon[i].y);
        }
      }

      if (ctx!.isPointInPath(path, point.x, point.y)) {
        openAnnotation(annotation);
        break;
      }
    }
  };

  return (
    <>
      <div className='flex items-center justify-center p-4 space-x-4 h-dvh w-dvw'>
        <div className=''>
          <canvas
            className='w-full h-full max-h-[95dvh] max-w-[90dwh]'
            ref={canvasRef}
            onClick={(e) => handleClick(e)}
          />
        </div>
      </div>
      <InfoBox
        open={open}
        setOpen={setOpen}
        title={infoBox?.title}
        description={infoBox?.description}
      />
    </>
  );
}
