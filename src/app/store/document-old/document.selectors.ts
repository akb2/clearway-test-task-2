import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DOCUMENT_KEY, DocumentState } from "./document.state";

export const documentFeatureSelector = createFeatureSelector<DocumentState>(DOCUMENT_KEY);

export const documentsListSelector = createSelector(documentFeatureSelector, ({ documents }) => documents);
