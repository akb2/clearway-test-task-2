import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateUrl } from "@app/models/app";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { routerNavigatedAction } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { combineLatest, map, tap } from "rxjs";
import { initialLoadDocumentsAction, updateDocumentsAction } from "../document/document.actions";
import { pageLoaderDisableAction, pageLoaderEnableAction, setPageTitleAction } from "./layout.actions";
import { pageTitleSelector, siteNameSelector } from "./layout.selectors";
import { LayoutTitleSeparator } from "./layout.state";

@Injectable()
export class LayoutEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store,
    private readonly titleService: Title
  ) { }

  readonly initialLoadDocumentsEnableLoader$ = createEffect(
    () => this.actions$.pipe(
      ofType(initialLoadDocumentsAction),
      map(() => pageLoaderEnableAction()),
    )
  );

  readonly documentsUpdatedDisableLoader$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateDocumentsAction),
      map(() => pageLoaderDisableAction()),
    )
  );

  readonly routerChangeListener$ = createEffect(
    () => this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload: { routerState } }) => routerState as unknown as RouterStateUrl),
      map(({ title: pageTitle }) => setPageTitleAction({ pageTitle }))
    )
  );

  readonly setTitle$ = createEffect(
    () => combineLatest([
      this.store$.select(siteNameSelector),
      this.store$.select(pageTitleSelector),
    ]).pipe(
      tap(([siteName, pageTitle]) => this.titleService.setTitle(!!pageTitle
        ? pageTitle + LayoutTitleSeparator + siteName
        : siteName
      ))
    ),
    { dispatch: false }
  );
}
