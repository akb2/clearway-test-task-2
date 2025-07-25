import { effect, inject, Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateUrl } from "@models/app";
import { Actions, ofType } from "@ngrx/effects";
import { routerNavigatedAction } from "@ngrx/router-store";
import { signalStore, withHooks, withState } from '@ngrx/signals';
import { on, withEffects, withReducer } from '@ngrx/signals/events';
import { debugActions } from "@store/debug.actions";
import { map } from "rxjs";
import { LayoutActions, PageLoaderDisableAction, PageLoaderEnableAction, SetBreadCrumbsAction, SetPageTitleAction } from "./layout.actions";
import { LayoutInitialState, LayoutTitleSeparator } from "./layout.state";

@Injectable({ providedIn: "root" })
export class LayoutStore extends signalStore(
  debugActions(LayoutActions),

  withState(LayoutInitialState),

  withReducer(
    on(PageLoaderEnableAction, () => ({ pageLoading: true })),
    on(PageLoaderDisableAction, () => ({ pageLoading: false })),
    on(SetPageTitleAction, ({ payload: pageTitle }) => ({ pageTitle })),
    on(SetBreadCrumbsAction, ({ payload: breadCrumbs }) => ({ breadCrumbs })),
  ),

  withEffects((_, actions = inject(Actions)) => ({
    // Обновление заголовка из роута
    routerChangeListener$: actions.pipe(
      ofType(routerNavigatedAction),
      map(({ payload: { routerState } }) => routerState as unknown as RouterStateUrl),
      map(({ title }) => SetPageTitleAction(title))
    ),
  })),

  withHooks((store, titleService = inject(Title)) => ({
    onInit() {
      // Обновление заголовка во вкладке
      effect(() => {
        const pageTitle = store.pageTitle();
        const siteName = store.siteName();

        titleService.setTitle(!!store.pageTitle()
          ? pageTitle + LayoutTitleSeparator + siteName
          : siteName
        );
      });
    }
  }))
) { }
