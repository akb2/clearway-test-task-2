import { inject, Injectable } from "@angular/core";
import { DeepClone } from "@app/helpers/app";
import { DocumentService } from "@app/services/document.service";
import { signalStore, withState } from "@ngrx/signals";
import { Events, on, withEffects, withReducer } from "@ngrx/signals/events";
import { map, switchMap } from 'rxjs';
import { PageLoaderDisableAction, PageLoaderEnableAction } from "../layout/layout.actions";
import { InitialLoadDocumentsAction, UpdateDocumentsAction } from "./document.actions";
import { DocumentInitialState } from "./document.state";

@Injectable()
export class DocumentStore extends signalStore(
  withState(DocumentInitialState),

  withReducer(
    on(UpdateDocumentsAction, ({ payload: documents }) => ({ documents: DeepClone(documents) })),
  ),

  withEffects((_, events = inject(Events), documentService = inject(DocumentService)) => ({
    // Загрузка документов при инициализации приложения
    initialLoadDocuments$: events.on(InitialLoadDocumentsAction).pipe(
      switchMap(() => documentService.getList()),
      map(documents => UpdateDocumentsAction(documents)),
    ),
    // Запуск лоадера при загрузке документов
    initialLoadDocumentsEnableLoader$: events.on(InitialLoadDocumentsAction).pipe(
      map(() => PageLoaderEnableAction()),
    ),
    // Запуск лоадера при загрузке документов
    initialLoadDocumentsDisableLoader$: events.on(UpdateDocumentsAction).pipe(
      map(() => PageLoaderDisableAction()),
    ),
  })),
) { }
