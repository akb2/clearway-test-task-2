import { DocumentSnippet } from "@models/document";
import { RectData } from "@models/ui";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const UpsertSnippetsAction = event(
  "[АННОТАЦИИ] Сохранение аннотаций",
  type<DocumentSnippet[]>()
);

export const SetCreatingSnippetPositionAction = event(
  "[АННОТАЦИИ] Установка позиции создаваемой аннотации",
  type<Pick<RectData, "left" | "top">>(),
);

export const SetCreatingSnippetSizeAction = event(
  "[АННОТАЦИИ] Установка размера создаваемой аннотации",
  type<Pick<RectData, "width" | "height">>(),
);

export const ClearCreatingSnippetAction = event(
  "[АННОТАЦИИ] Очистка информации о начале создания аннотации",
);
