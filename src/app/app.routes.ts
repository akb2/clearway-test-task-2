import { Routes } from '@angular/router';
import { DocumentsListRoute, DocumentsListUrl, DocumentViewRoute } from "@models/route";

export const routes: Routes = [
  // Основное
  {
    path: "",
    redirectTo: DocumentsListUrl,
    pathMatch: "full"
  },
  // Список документов
  {
    path: DocumentsListRoute,
    data: {
      title: "Документы",
    },
    loadChildren: () => import("@pages/document-pages/document-pages.module").then(m => m.DocumentPagesModule)
  },
  // Просмотр документа
  {
    path: DocumentViewRoute,
    data: {
      title: "Просмотр документа",
    },
    loadChildren: () => import("@pages/documents-view/documents-view.module").then(m => m.DocumentsViewModule)
  }
];
