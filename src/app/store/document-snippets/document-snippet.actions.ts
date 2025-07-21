import { DocumentSnippet } from "@models/document";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const UpsertSnippetsAction = event(
  "[АННОТАЦИИ] Сохранение аннотаций",
  type<DocumentSnippet[]>()
);
