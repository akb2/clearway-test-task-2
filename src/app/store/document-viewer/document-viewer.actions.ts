import { RectData } from "@models/ui";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const SetZoomAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить масштаб просмотра документа",
  type<number>()
);

export const SetPositionAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить позицию просмотра документа",
  type<{ x: number; y: number }>()
);

export const SetContainerRectAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить размеры контейнера просмотра документа",
  type<RectData>()
);
