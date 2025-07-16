import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.state";
import { documentReducer } from "./document/document.reducer";
import { DOCUMENT_KEY } from "./document/document.state";

export const appReducer: ActionReducerMap<AppState> = {
  [DOCUMENT_KEY]: documentReducer
};
