import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LAYOUT_KEY, LayoutState } from "./layout.state";

export const layoutFeatureSelector = createFeatureSelector<LayoutState>(LAYOUT_KEY);

export const pageLoadingStateSelector = createSelector(layoutFeatureSelector, ({ pageLoading }) => pageLoading);

export const siteNameSelector = createSelector(layoutFeatureSelector, ({ siteName }) => siteName);

export const pageTitleSelector = createSelector(layoutFeatureSelector, ({ pageTitle }) => pageTitle);
