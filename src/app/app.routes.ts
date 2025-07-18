import { Routes } from '@angular/router';

export const routes: Routes = [
  // Основное
  {
    path: "",
    redirectTo: "/documents",
    pathMatch: "full"
  },
  // Список документов
  {
    path: "documents",
    data: {
      title: "Документы",
    },
    loadChildren: () => import("@pages/documents/documents.module").then(m => m.DocumentsModule)
  },
  // Просмотр документа
  {
    path: "documents/view/:id",
    data: {
      title: "Просмотр документа",
    },
    loadChildren: () => import("@pages/documents-view/documents-view.module").then(m => m.DocumentsViewModule)
  }
];
