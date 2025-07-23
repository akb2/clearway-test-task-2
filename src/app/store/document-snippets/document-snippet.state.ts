import { DragStartEvent, Nullable } from "@models/app";
import { DocumentItem, DocumentSnippet } from "@models/document";
import { type } from "@ngrx/signals";

export const LocalStorageSnippetsKey = "document_snippets";

export interface DocumentSnippetState {
  createEvent: Nullable<DragStartEvent>;
}

export interface DocumentForSnippet extends Pick<DocumentItem, "id"> {
  snippetsIds: Set<number>;
}

export const DocumentSnippetInitialState: DocumentSnippetState = {
  createEvent: undefined,
};

export const SnippetEntitiesConfig = {
  entity: type<DocumentSnippet>(),
  collection: "snippets",
  selectId: ({ id }: DocumentSnippet) => id,
  trackBy: ([prev, next]: DocumentSnippet[]) => (Object.keys(prev) as (keyof DocumentSnippet)[])
    .every(key => prev[key] === next[key]),
};

export const DocumentIdTableEntitiesConfig = {
  entity: type<DocumentForSnippet>(),
  collection: "documentIdTable",
  selectId: ({ id }: DocumentForSnippet) => id,
  trackBy: ([prev, next]: DocumentForSnippet[]) => (
    prev.id === next.id
    && prev.snippetsIds.size === next.snippetsIds.size
    && (
      prev.snippetsIds.size === 0
      || Array.from(prev.snippetsIds).every(id => next.snippetsIds.has(id))
    )
  )
};

export const EmptyDocumentForSnippet = (id: number): DocumentForSnippet => ({
  id,
  snippetsIds: new Set(),
});
