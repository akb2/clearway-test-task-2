
export interface DocumentViewerState {
  zoom: number;
  positionX: number;
  positionY: number;
}

export const DocumentViewerInitialState: DocumentViewerState = {
  zoom: 1,
  positionX: 0,
  positionY: 0,
};
