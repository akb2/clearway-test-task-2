import { Params } from "@angular/router";

export interface RouterStateUrl<P = Params, Q = Params> {
  url: string;
  params: P;
  queryParams: Q;
  title: string;
}

export type SimpleTypes = string | number | boolean | null | undefined;
export type ObjectTypes = {} | object;
export type BaseTypes = SimpleTypes | ObjectTypes;
export type TypeOrArray<T> = T | T[];

export interface DragStartEvent {
  startX: number;
  startY: number;
}

export interface DraggingEvent {
  deltaX: number;
  deltaY: number;
}
