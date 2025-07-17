
export interface LayoutState {
  pageLoading: boolean;
  siteName: string;
  pageTitle: string;
}

export const LayoutInitialState: LayoutState = {
  pageLoading: true,
  siteName: "ClearWay Integration",
  pageTitle: ""
};

export const LayoutTitleSeparator = " | ";
