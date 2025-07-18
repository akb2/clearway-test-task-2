import { Injectable } from "@angular/core";
import { DocumentService } from "@app/services/document.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";
import { initialLoadDocumentsAction, updateDocumentsAction } from "./document.actions";

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
