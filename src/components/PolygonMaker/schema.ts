import { z } from "zod";
import { Point } from "./utils";

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const AnnotationSchema = z.object({
  title: z.string(),
  description: z.string(),
  fillStyle: z.string(),
  polygon: z.array(PointSchema),
});

export const AnnotatedImageSchema = z.object({
  src: z.string(),
  title: z.string(),
  annotations: z.array(AnnotationSchema).default([]),
});

type LegacyAnnotation = {
  title?: string;
  description?: string;
  fillStyle?: string;
  polygon?: Point[];
};

type LegacyAnnotatedImage = {
  src: string;
  title?: string;
  annotations: LegacyAnnotation[];
};

// Helper function to validate and migrate old format
export function validateAndMigrateAnnotatedImage(data: unknown) {
  try {
    // Try to parse as the new format first
    return AnnotatedImageSchema.parse(data);
  } catch (error) {
    // If that fails, try to handle old format
    const oldData = data as LegacyAnnotatedImage;
    
    // If it's an old format with just src and annotations array
    if (oldData.src && Array.isArray(oldData.annotations)) {
      return AnnotatedImageSchema.parse({
        src: oldData.src,
        title: oldData.title || "My stickers!",
        annotations: oldData.annotations.map((annotation) => ({
          title: annotation.title || "",
          description: annotation.description || "",
          fillStyle: annotation.fillStyle || "rgba(239,68,68,0.5)",
          polygon: annotation.polygon || [],
        })),
      });
    }
    
    // If it's completely invalid, throw the original error
    throw error;
  }
} 