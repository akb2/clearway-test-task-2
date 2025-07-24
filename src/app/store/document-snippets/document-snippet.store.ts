import { computed, effect, inject, Injectable } from "@angular/core";
import { DeepClone } from "@helpers/app";
import { AnyToInt } from "@helpers/converters";
import { LocalStorageGet, LocalStorageSet } from "@helpers/local-storage";
import { DocumentSnippet } from "@models/document";
import { Actions, ofType } from "@ngrx/effects";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { setEntities, upsertEntities, withEntities } from "@ngrx/signals/entities";
import { on, withEffects, withReducer } from "@ngrx/signals/events";
import { map } from "rxjs";
import { ClearCreatingSnippetAction, SetCreatingSnippetPositionAction, UpsertSnippetsAction } from "./document-snippet.actions";
import { DocumentForSnippet, DocumentIdTableEntitiesConfig, DocumentSnippetInitialState, DocumentSnippetState, EmptyDocumentForSnippet, LocalStorageSnippetsKey, SnippetEntitiesConfig } from "./document-snippet.state";

@Injectable()
export class DocumentSnippetsStore extends signalStore(
  withState<DocumentSnippetState>(DocumentSnippetInitialState),

  // Таблица аннотаций
  withEntities(SnippetEntitiesConfig),

  // Таблица связей аннотаций с документами
  withEntities(DocumentIdTableEntitiesConfig),

  withComputed(({ documentIdTableEntityMap }) => ({
    documentIdTable: computed(documentIdTableEntityMap),
  })),

  withReducer(
    on(SetCreatingSnippetPositionAction, ({ payload: { left, top } }, { helperRect }) => ({
      helperRect: {
        width: AnyToInt(helperRect?.width),
        height: AnyToInt(helperRect?.height),
        left,
        top,
      }
    })),
    on(ClearCreatingSnippetAction, () => ({ helperRect: undefined })),
  ),

  // Методы для работы с аннотациями
  withMethods(state => ({
    // Обновить аннотации
    upsertSnippets(items: DocumentSnippet[]) {
      const documentIdTable = state.documentIdTable();
      const documentIds: DocumentForSnippet[] = [];

      items.forEach(({ id, documentId }) => {
        const documentIdItem = documentIdTable[documentId] ?? EmptyDocumentForSnippet(documentId);

        documentIdTable[documentId] = documentIdItem;
        documentIdItem.snippetsIds.add(id);

        documentIds.push(documentIdItem);
      });

      patchState(
        state,
        upsertEntities(DeepClone(items), SnippetEntitiesConfig),
        setEntities(DeepClone(documentIds), DocumentIdTableEntitiesConfig)
      );
    }
  })),

  withEffects((store, actions = inject(Actions)) => ({
    upsertSnippetsAction$: actions.pipe(
      ofType(UpsertSnippetsAction),
      map(({ payload: snippets }) => store.upsertSnippets(snippets)),
    )
  })),

  // Работа с localStorage
  withHooks(({ snippetsEntities }) => ({
    onInit: () => {
      // Загрузить аннотации из localStorage
      UpsertSnippetsAction(LocalStorageGet<DocumentSnippet[]>(LocalStorageSnippetsKey));
      // Записать изменения в localStorage
      effect(() => LocalStorageSet(LocalStorageSnippetsKey, snippetsEntities()))
    }
  })),
) { }
