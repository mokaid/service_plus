import {
  Organisation,
  OrganisationGroup,
  OrganisationSite,
} from "@/types/organisation";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
  showEditSiteDrawer: boolean;
  showConfigureSiteDrawer: boolean;
  showEditOrgDrawer: boolean;
  showEditGroupDrawer: boolean;
  selectedSite: string | null;
  selectedGroup: string;
  selectedOrg: string;
  siteObject: OrganisationSite | any;
  orgObject: Organisation | any;
  groupObject: OrganisationGroup | any;
  showDateFilter: boolean;
};

const initialState: State | any = {
  selectedSite: "",
  siteObject: {},
  orgObject: {},
  groupObject: {},
  showEditSiteDrawer: false,
  showEditOrgDrawer: false,
  showEditGroupDrawer: false,
  showConfigureSiteDrawer: false,
  showDateFilter: true,
};

const sitesSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    setSelectedSite(state, action: PayloadAction<string | null>) {
      state.selectedSite = action.payload;
    },
    setShowDateFilter(state, action: PayloadAction<boolean>) {
      state.showDateFilter = action.payload;
    },
    setSelectedGroup(state, action: PayloadAction<string>) {
      state.selectedGroup = action.payload;
    },
    setSelectedOrg(state, action: PayloadAction<string>) {
      state.selectedOrg = action.payload;
    },
    setShowEditSiteDrawer(state, action: PayloadAction<boolean>) {
      state.showEditSiteDrawer = action.payload;
    },
    setShowEditOrgDrawer(state, action: PayloadAction<boolean>) {
      state.showEditOrgDrawer = action.payload;
    },
    setShowConfigureSiteDrawer(state, action: PayloadAction<boolean>) {
      state.showConfigureSiteDrawer = action.payload;
    },
    setShowEditGroupDrawer(state, action: PayloadAction<boolean>) {
      state.showEditGroupDrawer = action.payload;
    },
    setSiteObject(state, action: PayloadAction<OrganisationSite>) {
      state.siteObject = action.payload;
    },
    setGroupObject(state, action: PayloadAction<OrganisationGroup>) {
      state.groupObject = action.payload;
    },
    setOrgObject(state, action: PayloadAction<Organisation>) {
      state.orgObject = action.payload;
    },
  },
});

export const sites = sitesSlice.reducer;

export const {
  setSelectedSite,
  setShowEditSiteDrawer,
  setShowEditGroupDrawer,
  setShowEditOrgDrawer,
  setSiteObject,
  setGroupObject,
  setOrgObject,
  setShowConfigureSiteDrawer,
  setSelectedGroup,
  setSelectedOrg,
  setShowDateFilter,
} = sitesSlice.actions;
