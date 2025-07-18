import { effect, inject, Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateUrl } from "@app/models/app";
import { routerNavigatedAction } from "@ngrx/router-store";
import { signalStore, withHooks, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { map } from "rxjs";
import { PageLoaderDisableAction, PageLoaderEnableAction, SetPageTitleAction } from "./layout.actions";
import { LayoutInitialState, LayoutTitleSeparator } from "./layout.state";

@Injectable({ providedIn: "root" })
export class LayoutStore extends signalStore(
  withState(LayoutInitialState),

  withReducer(
    on(PageLoaderEnableAction, () => ({ pageLoading: true })),
    on(PageLoaderDisableAction, () => ({ pageLoading: false })),
    on(SetPageTitleAction, ({ payload: pageTitle }) => ({ pageTitle })),
  ),

  withEffects((_, events = inject(Events)) => ({
    // Обновление заголовка из роута
    routerChangeListener$: events.on(routerNavigatedAction).pipe(
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
