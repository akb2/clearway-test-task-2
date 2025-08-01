import { Signal } from "@angular/core";
import { Params } from "@angular/router";

export interface RouterStateUrl<P = Params, Q = Params> {
  url: string;
  params: P;
  queryParams: Q;
  title: string;
}

export type SimpleTypes = Nullable<string | number | boolean>;
export type ObjectTypes = {} | object;
export type BaseTypes = SimpleTypes | ObjectTypes;
export type TypeOrArray<T> = T | T[];
export type Nullable<T> = T | null | undefined;

export interface DragStartEvent {
  startX: number;
  startY: number;
}

export interface DraggingEvent extends Pick<MouseEvent, "clientX" | "clientY"> {
  deltaX: number;
  deltaY: number;
}

export interface LocalStorageItemInterface<T = any> {
  value: T;
  expiry: number;
}

export type Signalized<T extends Record<string, any>> = {
  [key in keyof T]: Signal<T[keyof T]>
};
