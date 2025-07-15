import { Routes } from '@angular/router';
import { DocumentsRoutes } from "@pages/documents/documents.routes";

export const routes: Routes = [
  // Основное
  {
    path: "",
    redirectTo: "/documents",
    pathMatch: "full"
  },
  // Список документов
  DocumentsRoutes,
];
