import { RootState } from "@/types/store";

const getEventsState = (state: RootState) => state.events;

export const getShowProcessAlarmModalState = (state: RootState) =>
  getEventsState(state).showProcessAlarmModal;

export const getShowSiteInfoModalState = (state: RootState) =>
  getEventsState(state).showSiteInfoModal;

export const getShowEventsFilterModalState = (state: RootState) =>
  getEventsState(state).showEventsFilterModal;

export const getSelectedEvents = (state: RootState) =>
  getEventsState(state).selectedEvents;

export const getEvents = (state: RootState) => getEventsState(state).Events;
export const getAllEventsRecords = (state: RootState) => getEventsState(state).allEvents;

export const getSelectedRowIds = (state: RootState) =>
  getEventsState(state).selectedEventsId;

export const getGlobalPageSize = (state: RootState) =>
  getEventsState(state).globalPageSize;

export const getAlertMapEvents = (state: RootState) =>
  getEventsState(state).alertMapEvents;

export const getAlarmRecordEvents = (state: RootState) =>
  getEventsState(state).alarmRecordEvents;

export const getAlertMapId = (state: RootState) =>
  getEventsState(state).alertMapId;

export const getTotalAlerts = (state: RootState) =>
  getEventsState(state).totalAlerts;

export const getTotalAlertsSite = (state: RootState) =>
  getEventsState(state).totalAlertsSite;

export const getTotalAlarmRecords = (state: RootState) =>
  getEventsState(state).totalAlarmRecords;
