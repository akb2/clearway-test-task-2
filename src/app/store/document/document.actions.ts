import { DocumentItem } from "@models/document";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const UpdateDocumentsAction = event(
  "[ДОКУМЕНТЫ] Сохранение списка документов",
  type<DocumentItem[]>()
);

export const SetViewingDocumentIdAction = event(
  "[ДОКУМЕНТЫ] Установить просматриваемый документ",
  type<number>()
);
