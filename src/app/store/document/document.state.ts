import { DocumentItem } from "@models/document";

export const DOCUMENT_KEY = "document";
export const DOCUMENT_SNIPPETS_LOCAL_STORAGE_KEY = "document-snippets";

export interface DocumentState {
  documents: DocumentItem[];
}

export const documentInitialState: DocumentState = {
  documents: [],
};
