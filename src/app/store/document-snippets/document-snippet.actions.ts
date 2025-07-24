import { DocumentSnippet } from "@models/document";
import { RectData } from "@models/ui";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const UpsertSnippetsAction = event(
  "[АННОТАЦИИ] Сохранение аннотаций",
  type<DocumentSnippet[]>()
);

export const SetCreatingSnippetPositionAction = event(
  "[АННОТАЦИИ] Начало создания новой аннотации",
  type<Pick<RectData, "left" | "top">>(),
);

export const ClearCreatingSnippetAction = event(
  "[АННОТАЦИИ] Очистка информации о начале создания аннотации",
);
