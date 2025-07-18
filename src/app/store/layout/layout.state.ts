import { BreadCrumbs } from '@app/models/ui';

export interface LayoutState {
  pageLoading: boolean;
  siteName: string;
  pageTitle: string;
  breadCrumbs?: BreadCrumbs[];
}

export const LayoutInitialState: LayoutState = {
  pageLoading: true,
  siteName: "ClearWay Integration",
  pageTitle: "",
  breadCrumbs: undefined
};

export const LayoutTitleSeparator = " | ";
