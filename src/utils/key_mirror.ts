export function keyMirror<K extends string>(origin: { [key in K]: any }) {
  const res: { [key: string]: string } = {};
  for (const key in origin) {
    if (Object.hasOwn(origin, key)) {
      res[key] = key;
    }
  }
  return res as { [key in K]: string };
}
