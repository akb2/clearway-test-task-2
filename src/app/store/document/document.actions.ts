import { DocumentItem } from "@app/models/document";
import { createAction, props } from "@ngrx/store";

export const initialLoadDocumentsAction = createAction(
  "[ДОКУМЕНТЫ] Начальная загрузка списка документов"
);

export const updateDocumentsAction = createAction(
  "[ДОКУМЕНТЫ] Сохранение списка документов",
  props<{ documents: DocumentItem[] }>()
);
