import { type } from "@ngrx/signals";
import { event } from "@ngrx/signals/events";

export const PageLoaderEnableAction = event(
  "[ШАБЛОН] Показать загрузку страницы"
);

export const PageLoaderDisableAction = event(
  "[ШАБЛОН] Скрыть загрузку страницы"
);

export const SetPageTitleAction = event(
  "[ШАБЛОН] Установка заголовка страницы",
  type<string>()
);
