import { DefaultRectData } from "@helpers/ui";
import { RectData } from "@models/ui";

export interface DocumentViewerState {
  zoom: number;
  containerRect: RectData;
  imageRect: RectData;
}

export const DocumentViewerInitialState: DocumentViewerState = {
  zoom: 1,
  containerRect: DefaultRectData,
  imageRect: DefaultRectData,
};
