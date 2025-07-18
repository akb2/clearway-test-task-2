import { Params } from "@angular/router";

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
  title: string;
}

export type SimpleTypes = string | number | boolean | null | undefined;
export type ObjectTypes = {} | object;
export type BaseTypes = SimpleTypes | ObjectTypes;
export type TypeOrArray<T> = T | T[];
