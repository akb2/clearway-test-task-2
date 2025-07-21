export interface DocumentItem {
  id: number;
  name: string;
  imageUrl: string;
}

export interface DocumentSnippet {
  id: number;
  documentId: number;
  text: string;
  width: number;
  height: number;
  left: number;
  top: number;
}
