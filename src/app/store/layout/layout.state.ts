export const LAYOUT_KEY = "layout";

export const LayoutTitleSeparator = " | ";

export interface LayoutState {
  pageLoading: boolean;
  siteName: string;
  pageTitle: string;
}

export const layoutInitialState: LayoutState = {
  pageLoading: true,
  siteName: "ClearWay Integration",
  pageTitle: ""
};
