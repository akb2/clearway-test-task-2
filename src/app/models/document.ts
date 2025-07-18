export interface DocumentItem {
  id: number;
  name: string;
  imageUrl: string;
}

export enum DocumentEditTool {
  view,
  text,
  image
}
