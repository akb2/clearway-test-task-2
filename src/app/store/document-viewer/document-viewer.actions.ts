import { RectData } from "@models/ui";
import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const SetZoomAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить масштаб просмотра документа",
  type<number>()
);

export const SetImagePositionAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить позицию просмотра документа",
  type<Pick<RectData, "left" | "top">>()
);

export const SetContainerRectAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить размеры контейнера просмотра документа",
  type<RectData>()
);

export const SetImageSizeAction = event(
  "[ПРОСМОТР_ДОКУМЕНТОВ] Установить размеры изображения документа",
  type<Pick<RectData, "width" | "height">>()
);
