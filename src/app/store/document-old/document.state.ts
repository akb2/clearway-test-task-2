import { DocumentItem } from "@models/document";

export const DOCUMENT_KEY = "document";

export interface DocumentState {
  documents: DocumentItem[];
}

export const documentInitialState: DocumentState = {
  documents: [],
};
