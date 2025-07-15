export const DocumentsRoutes = {
  path: "documents",
  loadComponent: () => import("./documents.component").then(m => m.DocumentsComponent)
};
