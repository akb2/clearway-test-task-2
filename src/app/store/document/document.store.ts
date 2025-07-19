import { computed, inject, Injectable } from "@angular/core";
import { DeepClone } from "@helpers/app";
import { AnyToInt } from "@helpers/converters";
import { DocumentBreadCrumbs, DocumentPagesBreadCrumbs, DocumentViewBreadCrumbs } from "@helpers/ui";
import { RouterStateUrl } from "@models/app";
import { BreadCrumbs } from "@models/ui";
import { Actions, ofType } from "@ngrx/effects";
import { routerNavigatedAction } from "@ngrx/router-store";
import { signalStore, withComputed, withState } from "@ngrx/signals";
import { Events, on, withEffects, withReducer } from "@ngrx/signals/events";
import { DocumentService } from "@services/document.service";
import { debugActions } from "@store/debug.actions";
import { map, mergeMap, switchMap } from 'rxjs';
import { PageLoaderDisableAction, PageLoaderEnableAction, SetBreadCrumbsAction } from "../layout/layout.actions";
import { SetViewingDocumentIdAction, UpdateDocumentsAction } from "./document.actions";
import { DocumentInitialState } from "./document.state";

@Injectable()
export class DocumentStore extends signalStore(
  debugActions,

  withState(DocumentInitialState),

  withComputed(store => ({
    viewingDocument: computed(() => {
      const id = store.viewingDocumentId();

      return id
        ? store.documents().find(doc => doc.id === id)
        : undefined;
    })
  })),

  withReducer(
    on(UpdateDocumentsAction, ({ payload: documents }) => ({ documents: DeepClone(documents) })),
    on(SetViewingDocumentIdAction, ({ payload: viewingDocumentId }) => ({ viewingDocumentId })),
  ),

  withEffects((store, events = inject(Events), actions = inject(Actions), documentService = inject(DocumentService)) => ({
    // Инициализация при навигации
    initialViewingId$: actions.pipe(
      ofType(routerNavigatedAction),
      map(({ payload: { routerState } }) => routerState as unknown as RouterStateUrl<{ documentViewId: number }>),
      switchMap(({ params: { documentViewId } }) => documentService.getList().pipe(
        map(documents => ({ documentViewId: AnyToInt(documentViewId), documents })),
      )),
      mergeMap(({ documentViewId, documents }) => [
        UpdateDocumentsAction(documents),
        SetViewingDocumentIdAction(documentViewId),
        PageLoaderDisableAction(),
      ])
    ),
    // Инициализация страницы при навигации
    initialDocuments$: actions.pipe(
      ofType(routerNavigatedAction),
      map(() => PageLoaderEnableAction()),
    ),
    // Установка хлебных крошек при навигации
    setBreadCrumbs$: events.on(UpdateDocumentsAction, SetViewingDocumentIdAction).pipe(
      map(() => {
        const breadCrumbs: BreadCrumbs[] = [DocumentBreadCrumbs];

        if (store.viewingDocumentId() > 0) {
          breadCrumbs.push(DocumentPagesBreadCrumbs, DocumentViewBreadCrumbs);
        }

        else {
          const { link, ...documentPagesBreadCrumbs } = DocumentPagesBreadCrumbs;

          breadCrumbs.push(documentPagesBreadCrumbs);
        }

        return SetBreadCrumbsAction(breadCrumbs);
      })
    ),
  })),
) { }
