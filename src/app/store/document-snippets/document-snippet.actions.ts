import { DragStartEvent } from "@models/app";
import { DocumentSnippet } from "@models/document";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const UpsertSnippetsAction = event(
  "[АННОТАЦИИ] Сохранение аннотаций",
  type<DocumentSnippet[]>()
);

export const CreateSnippetAction = event(
  "[АННОТАЦИИ] Начало создания новой аннотации",
  type<DragStartEvent>(),
);

export const ClearCreateSnippetEventAction = event(
  "[АННОТАЦИИ] Очистка информации о начале создания аннотации",
);
