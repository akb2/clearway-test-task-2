import { DOCUMENT_KEY, DocumentState } from "./document-old/document.state";

export interface AppState {
  [DOCUMENT_KEY]: DocumentState;
}
