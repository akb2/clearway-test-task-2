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
    loadChildren: () => import("@pages/documents/documents.module").then(m => m.DocumentsModule)
  },
];
