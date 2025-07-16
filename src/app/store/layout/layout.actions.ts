import { createAction } from "@ngrx/store";

export const pageLoaderEnableAction = createAction(
  "[ШАБЛОН] Показать загрузку страницы"
);

export const pageLoaderDisableAction = createAction(
  "[ШАБЛОН] Скрыть загрузку страницы"
);
