import {
  MyAwareness,
  PointerInfo,
  User,
  pointerSchema,
  userSchema,
} from "@/types";
import { keyMirror } from "./key_mirror";

const tmp: { [key in keyof MyAwareness]: null } = {
  user: null,
  position: null,
};
export const FIELD_NAMES = keyMirror(tmp);

export function toUser(data: any): User | undefined {
  if (!data) {
    return undefined;
  }
  const result = userSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.error(result.error);
}

export function toPointerPosition(data: any): PointerInfo | undefined {
  if (!data) {
    return undefined;
  }
  const result = pointerSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.error(result.error);
}

export function parseAwareness(awareness: { [key: string]: any }): MyAwareness {
  return {
    user: toUser(awareness[FIELD_NAMES.user]),
    position: toPointerPosition(awareness[FIELD_NAMES.position]),
  };
}
