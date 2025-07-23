import { DocumentsListUrl } from "@models/route";
import { BreadCrumbs, RectData } from "@models/ui";

export const DocumentTitle = "Название документа";
export const DocumentPagesTitle = "Все страницы";
export const DocumentViewTitle = "Просмотр документа";

export const NoHoverLink = "#";

export const DocumentBreadCrumbs: BreadCrumbs = {
  title: DocumentTitle,
  link: NoHoverLink
};

export const DocumentPagesBreadCrumbs: BreadCrumbs = {
  title: DocumentPagesTitle,
  link: DocumentsListUrl,
};

export const LoadingBreadCrumbs: BreadCrumbs = {
  title: ". . . Загрузка",
};

export const DefaultRectData: RectData = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
};
