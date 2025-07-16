import { DOCUMENT_KEY, DocumentState } from "./document/document.state";
import { LAYOUT_KEY, LayoutState } from "./layout/layout.state";

export interface AppState {
  [DOCUMENT_KEY]: DocumentState;
  [LAYOUT_KEY]: LayoutState;
}
