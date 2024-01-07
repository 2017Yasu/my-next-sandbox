type Coordinate = number | string;

export type Point<T extends Coordinate = number> = {
  x: T;
  y: T;
};
