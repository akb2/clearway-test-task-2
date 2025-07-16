import { DOCUMENT_KEY, DocumentState } from "./document/document.state";

export interface AppState {
  [DOCUMENT_KEY]: DocumentState;
}
