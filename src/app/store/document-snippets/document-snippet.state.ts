import { DocumentItem, DocumentSnippet } from "@models/document";
import { type } from "@ngrx/signals";

export const LocalStorageSnippetsKey = "document_snippets";
export const LocalStorageSnippetsByDocumentIdsKey = "document_snippets_by_document_ids";

export interface DocumentSnippetState extends Pick<DocumentItem, "id"> {
  snippetsIds: Set<number>;
}

export const SnippetEntitiesConfig = {
  entity: type<DocumentSnippet>(),
  collection: "snippets",
  selectId: ({ id }: DocumentSnippet) => id,
  trackBy: ([prev, next]: DocumentSnippet[]) => (Object.keys(prev) as (keyof DocumentSnippet)[])
    .every(key => prev[key] === next[key]),
};

export const DocumentIdTableEntitiesConfig = {
  entity: type<DocumentSnippetState>(),
  collection: "documentIdTable",
  selectId: ({ id }: DocumentSnippetState) => id,
  trackBy: ([prev, next]: DocumentSnippetState[]) => (
    prev.id === next.id
    && prev.snippetsIds.size === next.snippetsIds.size
    && (
      prev.snippetsIds.size === 0
      || Array.from(prev.snippetsIds).every(id => next.snippetsIds.has(id))
    )
  )
};

export const EmptyDocumentSnippet = (id: number): DocumentSnippetState => ({
  id,
  snippetsIds: new Set(),
});
