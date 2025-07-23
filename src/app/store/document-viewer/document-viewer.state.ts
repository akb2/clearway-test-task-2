import { DefaultRectData } from "@helpers/ui";
import { RectData } from "@models/ui";

export interface DocumentViewerState {
  zoom: number;
  containerRect: RectData;
  imageRect: Pick<RectData, "left" | "top"> & {
    naturalWidth: number;
    naturalHeight: number;
  };
}

export const DocumentViewerInitialState: DocumentViewerState = {
  zoom: 1,
  containerRect: DefaultRectData,
  imageRect: {
    left: DefaultRectData.left,
    top: DefaultRectData.top,
    naturalWidth: 0,
    naturalHeight: 0,
  },
};
