import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const SetZoomAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить масштаб просмотра документа",
  type<number>()
);
