import { RootState } from "@/types/store";

const getState = (state: RootState) => state.sites;

export const getShowConfigureSiteDrawer = (state: RootState) => getState(state).showConfigureSiteDrawer;

export const getShowEditSiteDrawer = (state: RootState) => getState(state).showEditSiteDrawer;
export const getShowEditOrgDrawer = (state: RootState) => getState(state).showEditOrgDrawer;
export const getShowEditGroupDrawer = (state: RootState) => getState(state).showEditGroupDrawer;

export const getSelectedOrg = (state: RootState) => getState(state).selectedOrg;
export const getSelectedGroup = (state: RootState) => getState(state).selectedGroup;
export const getSelectedSite = (state: RootState) => getState(state).selectedSite;

export const getSiteObject = (state: RootState) => getState(state).siteObject;
export const getGroupObject = (state: RootState) => getState(state).groupObject;
export const getOrgObject = (state: RootState) => getState(state).orgObject;

export const getShowDateFilter = (state: RootState) => getState(state).showDateFilter;