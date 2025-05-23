export enum ENDPOINTS {
  LOGIN = "login", // LOGIN
  REFRESH_TOKEN = "refreshToken", // REFRESH LOGIN TOKEN
  USERS_LIST = "users", // GET ALL USERS
  GET_USER = "user", // GET ONE USER
  DELETE_USER = "deleteUser", // DELETE USER
  GET_ORGANIZATIONS = "getOrganizations", // GET ALL ORGANIZATIONS & SITES & GROUPS (UN-MASKED)
  GET_SITES = "sites", // GET ALL ORGANIZATIONS & SITES & GROUPS (UN-MASKED)
  CREATE_SITE = "createSite",
  POST_ORGANIZATION = "postOrganization", // CREATE/EDIT ORGANIZATION
  POST_GROUP = "postGroup", // CREATE/EDIT GROUP
  DELETE_GROUP = "deleteGroup", // DELETE GROUP
  DELETE_SITE = "deleteSite",
  RESTART_BOX = "restartBox",
  UPDATE_IO_EVENTS = "updateioevents",
  GET_BOX_STATUS = "getBoxStatus",
  GET_IO_EVENTS = "getIoEvents",
  UPGRADE_BOX = "upgradeBoxFirmware",
  GET_ALL_USERS = "getAllUsers",
  REGISTER_USER = "PostUser", // CREATE/EDIT USER
  POST_USER_PERMISSSION = "postUserPermissionList",
  GET_USER_PERMISSSION_LIST = "getUserPermissionList",
  GET_SINGLE_USER_PERMISSION = "getSingleUserPermission",
  GET_USER_ALLOWED_SITES = "getUserAllowedSites",
  POST_USER_FILTER = "postUserFilter",
  POST_SINGLE_USER_PERMISSION = "postSingleUserPermission",
  GET_BOX_PROPERTY = "getBoxProperty",
  POST_ORG_CONTACTS = "PostOrgContacts",

  //SYSTEMS
  GET_SITE_SYSTEMS = "systems",
  GET_SITE_SYSTEM_OBJECT = "devices",
  GET_SITE_SYSTEM_OBJECT_ITEM = "eventCategories",

  // MASKED
  DELETE_MASKED_ITEM = "deleteMaskedItem",
  GET_MASKED_ITEM = "getMaskedItemKey",
  MASK_ITEM = "maskItem",

  // EVENTS
  EVENTS = "events",
  PROCESS_EVENT = "processEvent",
  POST_PROCESS_SINGLE_EVENT = "postProcessSingleEvent",
  // STATS
  DASHBOARD_STATISTICS = "dashboardStats",
  ASSETS_STATISTICS = "assetsStatistics",
  // QUERY_EVENTS = 'QueryEvents',
  // UPLOAD
  UPLOAD = "upload",
  GET_UPLOADS = "uploads",
  FAST_RECOVERY = "fastRecovery",

  // CONFIGURE BOX
  CONFIGURE_BOX = "configureBox",

  // GET FILTERS
  GET_FILTERS = "getFilters",

  // CHART
  GET_CHART_SITE_COUNT = "getChartData",
  GET_CHART_SITE_SYSTEM_OBJECT_COUNT = "getChartSiteSystemObjectCount",
  GET_CHART_EVENT_COUNT_OF_OFFLINE_HISTORY = "getChartEventsCountOfOfflineHistroy",
  GET_CHART_EVENTS_RESPONSE_TIME = "getEventsResponseTime",
  GET_CHARTS_EVENTS_COUNT_BY_STATUS = "getEventsCountbyStatus",
  GET_EVENT_TOP_DATA = "getEventDataTop",
}
