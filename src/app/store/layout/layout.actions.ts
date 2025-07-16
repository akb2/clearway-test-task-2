import { createAction, props } from "@ngrx/store";

export const pageLoaderEnableAction = createAction(
  "[ШАБЛОН] Показать загрузку страницы"
);

export const pageLoaderDisableAction = createAction(
  "[ШАБЛОН] Скрыть загрузку страницы"
);

export const setPageTitleAction = createAction(
  "[ШАБЛОН] Установка заголовка страницы",
  props<{ pageTitle: string }>()
);
