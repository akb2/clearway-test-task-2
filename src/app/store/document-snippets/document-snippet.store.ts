import { computed, effect, inject, Injectable } from "@angular/core";
import { CreateNewId, DeepClone } from "@helpers/app";
import { AnyToArray, AnyToInt } from "@helpers/converters";
import { LocalStorageGet, LocalStorageSet } from "@helpers/local-storage";
import { DocumentSnippet, DocumentSnippetPosition } from "@models/document";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { addEntities, addEntity, EntityMap, updateEntity, upsertEntities, upsertEntity, withEntities } from "@ngrx/signals/entities";
import { Events, on, withEffects, withReducer } from "@ngrx/signals/events";
import { debugActions } from "@store/debug.actions";
import { DocumentStore } from "@store/document/document.store";
import { filter, map, tap } from "rxjs";
import { ClearCreatingSnippetAction, CreateSnippetAction, DocumentSnippetActions, SetCreatingSnippetPositionAction, SetCreatingSnippetSizeAction, SetSnippetPositionAction } from "./document-snippet.actions";
import { DocumentForSnippet, DocumentIdTableEntitiesConfig, DocumentSnippetInitialState, DocumentSnippetState, EmptyDocumentForSnippet, LocalStorageSnippetsKey, SnippetEntitiesConfig } from "./document-snippet.state";

@Injectable()
export class DocumentSnippetsStore extends signalStore(
  debugActions(DocumentSnippetActions),

  withState<DocumentSnippetState>(DocumentSnippetInitialState),

  // Таблица аннотаций
  withEntities(SnippetEntitiesConfig),

  // Таблица связей аннотаций с документами
  withEntities(DocumentIdTableEntitiesConfig),

  withComputed(({ snippetsEntities, snippetsEntityMap, documentIdTableEntityMap }) => ({
    snippetsArray: computed(() => snippetsEntities()),
    snippetsTable: computed<EntityMap<DocumentSnippet>>(() => snippetsEntityMap()),
    documentIdTable: computed<EntityMap<DocumentForSnippet>>(() => documentIdTableEntityMap()),
  })),

  withComputed((store, documentStore = inject(DocumentStore)) => ({
    currentDocumentSnippets: computed<DocumentSnippet[]>(() => {
      const documentId = documentStore.viewingDocumentId();
      const snippetsTable = store.snippetsTable();
      const documentIdTable = store.documentIdTable();
      const snippetsIds = AnyToArray(documentIdTable[documentId]?.snippetsIds);

      return snippetsIds.map(id => snippetsTable[id]);
    })
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
    on(SetCreatingSnippetSizeAction, ({ payload: { width, height } }, { helperRect }) => ({
      helperRect: {
        width,
        height,
        left: AnyToInt(helperRect?.left),
        top: AnyToInt(helperRect?.top),
      }
    })),
    on(ClearCreatingSnippetAction, () => ({ helperRect: undefined })),
  ),

  // Методы для работы с аннотациями
  withMethods(store => ({
    addSnippetToDocument(
      documentId: number,
      snippetId: number,
      documentIdArray: DocumentForSnippet[] = []
    ): DocumentForSnippet {
      const documentIdTable = store.documentIdTable();
      const documentIdItem = (
        documentIdArray.find(item => item.id === documentId)
        ?? documentIdTable[documentId]
        ?? EmptyDocumentForSnippet(documentId)
      );

      documentIdItem.snippetsIds.add(snippetId);

      return documentIdItem;
    },
    // Добавить ID к аннатоции
    addIdToSnippet: (snippet: DocumentSnippet | Omit<DocumentSnippet, "id">) => snippet.hasOwnProperty("id")
      ? <DocumentSnippet>snippet
      : <DocumentSnippet>({ ...snippet, id: CreateNewId(store.snippetsTable()) })
  })),

  // Методы для работы с аннотациями
  withMethods(({ documentIdTableEntityMap, snippetsEntityMap, documentIdTableEntities, ...store }) => ({
    // Добавить аннотацию
    addSnippet(mixedSnippet: DocumentSnippet | Omit<DocumentSnippet, "id">) {
      const snippet = store.addIdToSnippet(mixedSnippet);
      const documentSnippets = store.addSnippetToDocument(snippet.documentId, snippet.id);

      patchState(
        store,
        addEntity(DeepClone(snippet), SnippetEntitiesConfig),
        upsertEntity(DeepClone(documentSnippets), DocumentIdTableEntitiesConfig),
      );
    },
    // Добавить аннотации
    addSnippets(mixedSnippets: Array<DocumentSnippet | Omit<DocumentSnippet, "id">>) {
      const documentsSnippets: DocumentForSnippet[] = [];
      const snippets: DocumentSnippet[] = [];

      mixedSnippets.forEach(mixedSnippet => {
        const snippet = store.addIdToSnippet(mixedSnippet);
        const documentSnippets = store.addSnippetToDocument(snippet.documentId, snippet.id, documentsSnippets);

        snippets.push(snippet);
        documentsSnippets.push(documentSnippets);
      });

      patchState(
        store,
        addEntities(DeepClone(snippets), SnippetEntitiesConfig),
        upsertEntities(DeepClone(documentsSnippets), DocumentIdTableEntitiesConfig),
      );
    },
    // Обновить аннотацию
    updateSnippetPosition({ id, top, left }: DocumentSnippetPosition) {
      patchState(
        store,
        updateEntity({ id, changes: <Partial<DocumentSnippet>>{ top, left } }, SnippetEntitiesConfig),
      );
    }
  })),

  withEffects((store, documentStore = inject(DocumentStore), events = inject(Events)) => ({
    // Создание аннотации
    createSnippetAction$: events.on(CreateSnippetAction).pipe(
      map(() => ({
        helperRect: store.helperRect(),
        documentId: documentStore.viewingDocumentId(),
      })),
      filter(({ helperRect, documentId }) => !!helperRect && !!documentId),
      tap(({ helperRect, documentId }) => store.addSnippet({
        width: Math.abs(helperRect.width),
        height: Math.abs(helperRect.height),
        left: helperRect.width > 0
          ? helperRect.left
          : helperRect.left + helperRect.width,
        top: helperRect.height > 0
          ? helperRect.top
          : helperRect.top + helperRect.height,
        documentId,
        text: "",
      })),
      map(() => ClearCreatingSnippetAction())
    ),
    // Установка позиции аннотации
    setSnippetPositionAction$: events.on(SetSnippetPositionAction).pipe(
      tap(({ payload: position }) => store.updateSnippetPosition(position)),
    ),
  })),

  // Работа с localStorage
  withHooks(store => ({
    onInit: () => {
      // Загрузить аннотации из localStorage
      store.addSnippets(AnyToArray(LocalStorageGet<DocumentSnippet[]>(LocalStorageSnippetsKey)));
      // Записать изменения в localStorage
      effect(() => LocalStorageSet(LocalStorageSnippetsKey, store.snippetsArray()))
    }
  })),
) { }
