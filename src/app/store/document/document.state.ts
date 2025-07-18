import { DocumentItem } from "@models/document";

export interface DocumentState {
  documents: DocumentItem[];
}

export const DocumentInitialState: DocumentState = {
  documents: [],
};
