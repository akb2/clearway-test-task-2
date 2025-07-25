import { Nullable } from "@models/app";
import { Direction, DirectionsNames } from "@models/math";

export const Clamp = (value: number, min = -Infinity, max = Infinity): number => Math.max(min, Math.min(max, value));

export const DirectionXNamesByDirection: Record<Direction, Nullable<DirectionsNames>> = {
  [-1]: "left",
  [0]: undefined,
  [1]: "right",
};

export const DirectionYNamesByDirection: Record<Direction, Nullable<DirectionsNames>> = {
  [-1]: "top",
  [0]: undefined,
  [1]: "bottom",
};
