export type Point = {
  x: number;
  y: number;
};

export type AnnotatedImage = {
  src: string;
  title: string;
  annotations: {
    title: string;
    description: string;
    fillStyle: string;
    polygon: Point[];
  }[];
};

export const lineIntersects = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point
): boolean => {
  const s1_x = p1.x - p0.x;
  const s1_y = p1.y - p0.y;
  const s2_x = p3.x - p2.x;
  const s2_y = p3.y - p2.y;

  const s =
    (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) /
    (-s2_x * s1_y + s1_x * s2_y);
  const t =
    (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) /
    (-s2_x * s1_y + s1_x * s2_y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Collision detected
    return true;
  }
  return false; // No collision
};

export const pointDistance = (p0: Point, p1: Point): number => {
  return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
};

export const checkIntersect = (perimeter: Point[], point: Point): boolean => {
  if (perimeter.length < 3) {
    return false;
  }

  let p0 = { x: 0, y: 0 };
  let p1 = { x: 0, y: 0 };
  const p2 = { ...perimeter.at(-1)! };
  const p3 = { ...point };

  for (let i = 0; i < perimeter.length - 1; i++) {
    p0 = { ...perimeter[i] };
    p1 = { ...perimeter[i + 1] };

    if (p1.x === p2.x && p1.y === p2.y) {
      continue;
    }

    if (p0.x === p3.x && p0.y === p3.y) {
      continue;
    }

    if (lineIntersects(p0, p1, p2, p3)) {
      return true;
    }
  }

  return false;
};

export const calculatePointSize = (ctx: CanvasRenderingContext2D): number => {
  return Math.round(ctx.canvas.height / 100);
};
