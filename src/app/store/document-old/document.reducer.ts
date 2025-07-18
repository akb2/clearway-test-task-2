import { createReducer, on } from "@ngrx/store";
import { updateDocumentsAction } from "./document.actions";
import { documentInitialState } from "./document.state";

export const documentReducer = createReducer(
  documentInitialState,
  // Обновить список документов
  on(updateDocumentsAction, (state, { documents }) => ({
    ...state,
    documents: [...documents]
  })),
);
