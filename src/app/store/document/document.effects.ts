import { inject, Injectable } from "@angular/core";
import { DocumentService } from "@app/services/document.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { initialLoadDocumentsAction, updateDocumentsAction } from "./document.actions";
import { map, switchMap, tap } from "rxjs";

@Injectable()
export class DocumentEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly documentService: DocumentService,
  ) { }

  readonly initialLoadDocuments$ = createEffect(
    () => this.actions$.pipe(
      ofType(initialLoadDocumentsAction),
      switchMap(() => this.documentService.getList()),
      map(documents => updateDocumentsAction({ documents })),
    )
  );
}
