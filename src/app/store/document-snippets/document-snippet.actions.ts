import { DocumentSnippet } from "@models/document";
import { RectData } from "@models/ui";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

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

export const CreateSnippetAction = event(
  "[АННОТАЦИИ] Создание аннотации",
);

export const SetSnippetRectAction = event(
  "[АННОТАЦИИ] Установка позиции аннотации",
  type<Pick<DocumentSnippet, "id"> & Partial<RectData>>(),
);

export const DeleteSnippetAction = event(
  "[АННОТАЦИИ] Удаление аннотации",
  type<number>(),
);

export const DocumentSnippetActions = [
  SetCreatingSnippetPositionAction,
  SetCreatingSnippetSizeAction,
  ClearCreatingSnippetAction,
  CreateSnippetAction,
  SetSnippetRectAction,
  DeleteSnippetAction,
];
