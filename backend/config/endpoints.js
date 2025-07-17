export const ENDPOINTS = {
  LOGIN: "sp/s/userLogin/", // LOGIN
  REFRESH_TOKEN: "RefreshToken", // REFRESH LOGIN TOKEN
  USERS_LIST: "sp/api/GetOrgContacts/", // GET ALL USERS
  GET_USER: "sp/s/getUserByToken/", // GET ONE USER
  DELETE_USER: "access/api/deleteUser", // DELETE USER
  GET_ORGANIZATIONS: "sp/api/GetOrgSite/", // GET ALL ORGANIZATIONS & SITES (UN-MASKED)
  POST_ORGANIZATION: "sp/api/PostOrganization/",
  POST_GROUP: "sp/api/PostGroup/",
  DELETE_GROUP: "DeleteGroup",
  QUERY_EVENTS: "sp/api/GetEvents/",
  PROCESS_EVENT: "sp/api/PostBatchProcessEvents/",
  REGISTER_BOX: "sp/api/PostRegisterBox/",
  DELETE_SITE: "sp/api/DeleteBox/",
  UPDATE_IO_EVENTS: "sp/api/PostIoEventsText/",
  GET_BOX_STATUS: "sp/api/GetBoxProperty/",
  GET_IO_EVENTS: "sp/api/GetIoEventsText/",
  GET_MASKED_ITEM: "sp/api/GetMaskedItemKey/",
  MASK_ITEM: "sp/api/PostMaskedItemKey/",
  UPGRADE_BOX_FIRMWARE: "sp/api/PostUpgradeBoxFirmware",
  DELETE_MASKED_ITEM: "sp/api/DeleteMaskedItemKey/",
  FAST_RECOVERY: "sp/api/GetEventsCountbySite/",
  POST_CONFIGURE_BOX: "sp/api/PostConfigureBox/",
  GET_SYSTEMS: "sp/api/GetSiteSystem/",
  GET_DEVICES: "sp/api/GetSiteSystemObject/",
  GET_EVENT_CATEGORIES: "sp/api/GetSiteSystemObjectItem/",
  POST_PROCESS_SINGLE: "sp/api/PostProcessSingleEvent",
  GET_CHART_DATA: "sp/api/GetSiteCount",
  GET_CHART_SITE_SYSTEM_OBJECT_COUNT: "sp/api/GetSiteSystemObjectCount/",
  GET_CHART_EVENTS_COUNT_OFFLINE_HISTORY:
    "sp/api/GetEventsCountOfOfflineHistroy",
  GET_CHART_EVENTS_RESPONSE_TIME: "sp/api/GetEventsResponseTime/",
  GET_CHART_EVENTS_COUNT_BY_STATUS: "sp/api/GetEventsCountbyStatus/",
  GET_EVENT_TOP_DATA: "sp/api/GetEventDataTop/",
  GET_ALL_USERS_PERMISSIONS: "sp/api/GetUserPermissionList/",
  REGISTER_USER: "sp/s/postUser", // ADD/EDIT USER
  GET_ALL_USERS: "sp/s/getUserList",
  POST_USER_PERMISSION: "sp/api/postUserPermission",
  GET_USER_PERMISSON_LIST: "sp/api/GetUserPermissionList/",
  GET_SINGLE_USER_PERMISSION: "sp/api/GetUserPermission",
  GET_USER_ALLOWED_SITES: "sp/api/GetUserFilter/",
  POST_USER_FILTER: "sp/api/PostUserFilter/",
  POST_SINGLE_USER_PERMISSION: "sp/api/PostUserPermission/",
  GET_BOX_PROPERTY: "sp/api/GetBoxProperty/",
  POST_ORG_CONTACTS: "sp/api/PostOrgContacts/",
};
