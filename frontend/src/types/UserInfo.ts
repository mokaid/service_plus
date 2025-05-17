interface UserInfos {
  rights: {
    dashboardParent: { v: number };
    Dashboard: { v: number; m: number };

    alarmParent: { v: number };
    record: { v: number; m: number; e: number };
    siteCount: { v: number; m: number };

    siteMapParent: { v: number };
    siteMap: { v: number };

    // Configuration: { v: number };
    siteConfiguration: { v: number; m: number };
    siteSystemItem: { v: number; c: number };
    siteUpgrade: { v: number; c: number; m: number; d: number };
    audioConfiguration: { v: number; c: number; m: number; d: number };

    contactsConfigurationParent: { v: number };
    contactsConfiguration: { v: number; c: number; m: number; d: number };

    maskedSourceParent: { v: number };
    maskSource: { v: number; m: number };

    disconnectParent: { v: number };
    disconnect: { v: number; m: number };

    userParent: { v: number };
    user: { v: number; c: number; m: number; d: number };

    videoParent: { v: number };
    video: { m: number };
  };
}
