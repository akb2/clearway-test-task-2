import { effect, Injectable } from "@angular/core";
import { DeepClone } from "@helpers/app";
import { LocalStorageGet, LocalStorageSet } from "@helpers/local-storage";
import { DocumentSnippet } from "@models/document";
import { patchState, signalStore, withHooks, withMethods } from "@ngrx/signals";
import { setEntities, upsertEntities, withEntities } from "@ngrx/signals/entities";
import { DocumentIdTableEntitiesConfig, DocumentSnippetState, EmptyDocumentSnippet, LocalStorageSnippetsByDocumentIdsKey, LocalStorageSnippetsKey, SnippetEntitiesConfig } from "./document-snippet.state";

@Injectable()
export class DocumentSnippetsStore extends signalStore(
  // Таблица аннотаций
  withEntities(SnippetEntitiesConfig),

  // Таблица связей аннотаций с документами
  withEntities(DocumentIdTableEntitiesConfig),

  // Методы для работы с аннотациями
  withMethods(state => ({
    // Обновить таблицу сопоставлений
    upsertDocumentIdTable: (items: DocumentSnippetState[]) => patchState(
      state,
      upsertEntities(DeepClone(items), DocumentIdTableEntitiesConfig)
    ),
    // Обновить аннотации
    upsertSnippets(items: DocumentSnippet[]) {
      const { documentIdTableEntityMap } = state;
      const documentIdTable = documentIdTableEntityMap();
      const documentIds: DocumentSnippetState[] = [];

      items.forEach(({ id, documentId }) => {
        const documentIdItem = documentIdTable[documentId] ?? EmptyDocumentSnippet(documentId);

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

  // Работа с localStorage
  withHooks(({ snippetsEntities, documentIdTableEntities }) => ({
    onInit: () => {
      // Загрузить аннотации из localStorage
      const snippets = LocalStorageGet<DocumentSnippet[]>(LocalStorageSnippetsKey);
      const documentIdTable = LocalStorageGet<DocumentSnippetState[]>(LocalStorageSnippetsByDocumentIdsKey);
      // Записать изменения в localStorage
      effect(() => {
        LocalStorageSet(LocalStorageSnippetsKey, snippetsEntities());
        LocalStorageSet(LocalStorageSnippetsByDocumentIdsKey, documentIdTableEntities());
      })
    }
  })),
) { }
