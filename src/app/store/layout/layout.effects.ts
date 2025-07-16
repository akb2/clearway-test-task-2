import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map } from "rxjs";
import { initialLoadDocumentsAction, updateDocumentsAction } from "../document/document.actions";
import { pageLoaderDisableAction, pageLoaderEnableAction } from "./layout.actions";

@Injectable()
export class LayoutEffects {
  constructor(
    private readonly actions$: Actions
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
}
