import { DocumentItem } from "@app/models/document";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const InitialLoadDocumentsAction = event(
  "[ДОКУМЕНТЫ] Начальная загрузка списка документов"
);

export const UpdateDocumentsAction = event(
  "[ДОКУМЕНТЫ] Сохранение списка документов",
  type<DocumentItem[]>()
);
