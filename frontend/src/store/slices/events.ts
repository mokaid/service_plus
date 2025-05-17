import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { DeviceEvent } from "@/types/device-event";

type State = {
  showProcessAlarmModal: boolean;
  showSiteInfoModal: boolean;
  showEventsFilterModal: boolean;
  selectedEvents: DeviceEvent[];
  Events: any[];
  allEvents: DeviceEvent[];
  alertMapEvents: any[];
  alarmRecordEvents: any[];
  selectedEventsId: any[];
  selectedEventIdsByPage: any[];
  globalPageSize: number;
  alertMapId: number;
  totalAlerts: number;
  totalAlertsSite: number;
  totalAlarmRecords: number;
};

const initialState: State = {
  showProcessAlarmModal: false,
  showEventsFilterModal: false,
  showSiteInfoModal: false,
  selectedEvents: [],
  Events: [],
  allEvents: [],
  alertMapEvents: [],
  alarmRecordEvents: [],
  selectedEventsId: [],
  selectedEventIdsByPage: [],
  globalPageSize: 10,
  alertMapId: 0,
  totalAlerts: 0,
  totalAlertsSite: 0,
  totalAlarmRecords: 0,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setShowProcesslarmModal(state, action: PayloadAction<boolean>) {
      state.showProcessAlarmModal = action.payload;
    },
    setShowEventsFilterModal(state, action: PayloadAction<boolean>) {
      state.showEventsFilterModal = action.payload;
    },
    setShowSiteInfoModal(state, action: PayloadAction<boolean>) {
      state.showSiteInfoModal = action.payload;
    },
    setSelectedEvents(state, action: PayloadAction<DeviceEvent[]>) {
      state.selectedEvents = action.payload;
    },
    setEvents(state, action: PayloadAction<any>) {
      const data = [
        ...state.Events,
        {
          pageIndex: action.payload.pageIndex,
          data: action.payload.data,
        },
      ];
      const jsonObject = data?.map((item) => JSON.stringify(item));
      const uniqueSet = new Set(jsonObject);
      const uniqueArray = Array.from(uniqueSet).map((item) => JSON.parse(item));

      state.Events = uniqueArray;
    },
    setAllEvents(state, action: PayloadAction<any>) {
      state.allEvents = action.payload;
    },
    setSelectedEventsId(state, action: PayloadAction<any>) {
      const { pageIndex, selectedRowKeys } = action.payload;
      const finalResult = {
        ...state.selectedEventIdsByPage,
        [pageIndex]: selectedRowKeys,
      };

      state.selectedEventIdsByPage = finalResult;
      const allSelectedItems = [].concat(
        ...Object.values(state.selectedEventIdsByPage),
      );

      state.selectedEventsId = allSelectedItems;
    },
    clearAllSelectEvents(state) {
      state.selectedEventsId = [];
      state.selectedEventIdsByPage = [];
    },
    setGlobalPageSize(state, action: PayloadAction<number>) {
      state.globalPageSize = action.payload;
    },
    setTotalAlertsGlobal(state, action: PayloadAction<number>) {
      state.totalAlerts = action.payload;
    },
    setTotalAlertsSiteGlobal(state, action: PayloadAction<number>) {
      state.totalAlertsSite = action.payload;
    },
    setTotalAlarmRecord(state, action: PayloadAction<number>) {
      state.totalAlarmRecords = action.payload;
    },
    clearAllEvents(state) {
      state.Events = [];
    },
    setAlertMapId(state, action: PayloadAction<any>) {
      state.alertMapId = action.payload;
    },
    setAlertMapEvents(state, action: PayloadAction<any>) {
      const data = [
        ...state.alertMapEvents,
        {
          pageIndex: action.payload.pageIndex,
          data: action.payload.data,
        },
      ];
      const jsonObject = data?.map((item) => JSON.stringify(item));
      const uniqueSet = new Set(jsonObject);
      const uniqueArray = Array.from(uniqueSet).map((item) => JSON.parse(item));

      state.alertMapEvents = uniqueArray;
    },
    setAlarmRecordEvents(state, action: PayloadAction<any>) {
      const data = [
        ...state.alarmRecordEvents,
        {
          pageIndex: action.payload.pageIndex,
          data: action.payload.data,
        },
      ];
      const jsonObject = (data || [])?.map((item) => JSON.stringify(item));
      const uniqueSet = new Set(jsonObject);
      const uniqueArray = Array.from(uniqueSet).map((item) => JSON.parse(item));

      state.alarmRecordEvents = uniqueArray;
    },

    clearAllMapAlerts(state) {
      state.alertMapEvents = [];
    },
    clearAlarmRecordEvents(state) {
      state.alarmRecordEvents = [];
    },
  },
});

export const events = eventsSlice.reducer;

export const {
  setShowProcesslarmModal,
  setShowEventsFilterModal,
  setSelectedEvents,
  setEvents,
  setAllEvents,
  setSelectedEventsId,
  setGlobalPageSize,
  clearAllEvents,
  setShowSiteInfoModal,
  setAlertMapId,
  setAlertMapEvents,
  clearAllMapAlerts,
  clearAllSelectEvents,
  setTotalAlertsGlobal,
  setTotalAlertsSiteGlobal,
  setAlarmRecordEvents,
  clearAlarmRecordEvents,
  setTotalAlarmRecord,
} = eventsSlice.actions;
