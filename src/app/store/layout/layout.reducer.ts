import { createReducer, on } from "@ngrx/store";
import { pageLoaderDisableAction, pageLoaderEnableAction } from "./layout.actions";
import { layoutInitialState } from "./layout.state";

export const layoutReducer = createReducer(
  layoutInitialState,
  // Включить лоадер страницы
  on(pageLoaderEnableAction, (state) => ({
    ...state,
    pageLoading: true
  })),
  // Выключить лоадер страницы
  on(pageLoaderDisableAction, (state) => ({
    ...state,
    pageLoading: false
  })),
);
