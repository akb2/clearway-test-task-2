import { Routes } from '@angular/router';
import { DocumentPagesTitle, DocumentViewTitle } from "@helpers/ui";
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
      title: DocumentPagesTitle,
    },
    loadChildren: () => import("@pages/document-pages/document-pages.module").then(m => m.DocumentPagesModule)
  },
  // Просмотр документа
  {
    path: DocumentViewRoute,
    data: {
      title: DocumentViewTitle,
    },
    loadChildren: () => import("@pages/document-view/document-view.module").then(m => m.DocumentViewModule)
  }
];
