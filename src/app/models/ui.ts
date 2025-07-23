export interface BreadCrumbs {
  title: string;
  link?: string;
}

export interface RectData {
  width: number;
  height: number;
  left: number;
  top: number;
}

export type ResizeEvent = RectData;
