import { DocumentsListUrl } from "@models/route";
import { BreadCrumbs } from "@models/ui";

export const DocumentTitle = "Название документа";
export const DocumentPagesTitle = "Все страницы";
export const DocumentViewTitle = "Просмотр документа";

export const DocumentBreadCrumbs: BreadCrumbs = {
  title: DocumentTitle,
};

export const DocumentPagesBreadCrumbs: BreadCrumbs = {
  title: DocumentPagesTitle,
  link: DocumentsListUrl,
};

export const DocumentViewBreadCrumbs: BreadCrumbs = {
  title: DocumentViewTitle,
};
