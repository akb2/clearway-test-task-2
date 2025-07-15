export const DocumentsRoutes = {
  path: "documents",
  loadChildren: () => import("./documents.component").then(m => m.DocumentsComponent)
};
