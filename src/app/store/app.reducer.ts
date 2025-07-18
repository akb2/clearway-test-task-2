import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.state";
import { documentReducer } from "./document-old/document.reducer";
import { DOCUMENT_KEY } from "./document-old/document.state";

export const appReducer: ActionReducerMap<AppState> = {
  [DOCUMENT_KEY]: documentReducer,
};
