import { DefaultRectData } from "@helpers/ui";
import { RectData } from "@models/ui";

export interface DocumentViewerState {
  zoom: number;
  imageElmRect: RectData;
  containerRect: RectData;
  imageRect: RectData;
}

export const DocumentViewerInitialState: DocumentViewerState = {
  zoom: 1,
  imageElmRect: DefaultRectData,
  containerRect: DefaultRectData,
  imageRect: DefaultRectData,
};
