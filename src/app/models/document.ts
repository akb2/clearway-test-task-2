import { WritableSignal } from "@angular/core";
import { RectData } from "./ui";

export interface DocumentItem {
  id: number;
  name: string;
  imageUrl: string;
}

export interface DocumentSnippet extends RectData {
  id: number;
  documentId: number;
  text: string;
}

export type DocumentSnippetPosition = Pick<DocumentSnippet, "id" | "top" | "left">;
export type DocumentSnippetSizes = Pick<DocumentSnippet, "id" | "width" | "height">;
export type DocumentSnippetRect = DocumentSnippetPosition & DocumentSnippetSizes;

export interface DocumentSnippetForHtml extends DocumentSnippet {
  styles: Record<string, string>;
  dragging: WritableSignal<boolean>;
}
