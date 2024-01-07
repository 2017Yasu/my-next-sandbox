import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const pointerSchema = z.object({
  x: z.number(),
  y: z.number(),
  pressed: z.boolean(),
});

export type PointerInfo = z.infer<typeof pointerSchema>;

export type MyAwareness = {
  user: User | undefined;
  position: PointerInfo | undefined;
};
