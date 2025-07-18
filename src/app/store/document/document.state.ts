import { DocumentItem } from "@models/document";

export interface DocumentState {
  documents: DocumentItem[];
  viewingDocumentId: number;
}

export const DocumentInitialState: DocumentState = {
  documents: [],
  viewingDocumentId: 0,
};
