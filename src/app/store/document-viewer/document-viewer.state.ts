import { DefaultRectData } from "@helpers/ui";
import { RectData } from "@models/ui";

export interface DocumentViewerState {
  zoom: number;
  containerRect: RectData;
  positionX: number;
  positionY: number;
}

export const DocumentViewerInitialState: DocumentViewerState = {
  zoom: 1,
  containerRect: DefaultRectData,
  positionX: 0,
  positionY: 0,
};
