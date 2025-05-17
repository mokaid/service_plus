import { Base64 } from "js-base64";

export function initRights(v: number) {
  /**
   * v:view
   * c:create
   * m:modify
   * d:delete
   * e:export
   */

  v = v ? 1 : 0;
  return {
    dashboardParent: { v: v },
    Dashboard: { v: v, m: v },

    alarmParent: { v: v },
    record: { v: v, m: v, e: v },
    siteCount: { v: v, m: v },

    siteMapParent: { v: v },
    siteMap: { v: v },

    Configuration: { v: v },
    siteConfiguration: { v: v, m: v },
    siteSystemItem: { v: v, c: v },
    siteUpgrade: { v: v, c: v, m: v, d: v },
    audioConfiguration: { v: v, c: v, m: v, d: v },

    contactsConfigurationParent: { v: v },
    contactsConfiguration: { v: v, c: v, m: v, d: v },

    maskedSourceParent: { v: v },
    maskSource: { v: v, m: v },

    disconnectParent: { v: v },
    disconnect: { v: v, m: v },

    userParent: { v: v },
    user: { v: v, c: v, m: v, d: v },

    videoParent: { v: v },
    video: { m: v },
  };
}

/** 将server的permission转为自定义的rights数据结构*/
export function permissionDecode(user: UserInfos) {
  if ((user as any).userName == "admin") {
    const rights: any = initRights(1);
    rights["Admin"] = { v: 1 };
    return rights;
  }
  if (import.meta.env.VITE_ENV === "development") {
    if ((user as any).userName == "leona" || (user as any).userName == "bing") {
      const rights: any = initRights(1);
      rights["Admin"] = { v: 1 };
      return rights;
    }
  }
  //
  if (
    typeof (user as any).sysRole != "undefined" &&
    (user as any).sysRole == 0
  ) {
    const rights: any = initRights(1);
    rights["userParent"] = { v: 0 };
    return rights;
  }
  try {
    const baseRights: any = initRights(0);
    if (!(user as any).permission) {
      return baseRights;
    }
    let rights: any = Base64.decode((user as any).permission);
    if (typeof rights == "string") {
      rights = JSON.parse(rights);
    }
    if (typeof rights == "object") {
      //兼容旧版本路由权限
      if (
        (rights["pending"] && rights["pending"]["v"]) ||
        (rights["quickly"] && rights["quickly"]["v"]) ||
        (rights["dispatched"] && rights["dispatched"]["v"])
      ) {
        let obj: { [key: string]: any } = { v: 1 };
        if (
          rights["pending"]["m"] ||
          rights["quickly"]["m"] ||
          rights["dispatched"]["m"]
        ) {
          obj["m"] = 1;
        }
        rights["siteCount"] = obj;
      }

      if (rights["map"] && rights["map"]["v"]) {
        rights["siteMap"] = { v: 1 };
      }

      for (var key in rights) {
        if (baseRights[key]) {
          baseRights[key] = { ...baseRights[key], ...rights[key] };
        }
      }
    }

    return baseRights;
  } catch (error) {
    console.log(error, "error");
    const baseRights: any = initRights(0);

    return baseRights;
  }
}

/** 将自定义的rights数据结构转为server的permission*/
export function permissionEncode(rightsData: any) {
  try {
    // const baseRights: any = initRights(0);
    // rightsData.forEach((right: any) => {
    //   for (const key in right.check) {
    //     const type = right.check[key];
    //     baseRights[right.name][type] = 1;
    //   }
    // });
    const permission = Base64.encode(JSON.stringify(rightsData));
    return permission;
  } catch (error) {
    return "";
  }
}
