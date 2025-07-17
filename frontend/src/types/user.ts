export type User = {
  userGuid: string;
  parentGuid?: string;
  /**
   * 0 - Local system account,
   * 1 - ADFS
   * @default 0 - Local system account
   */
  loginType: 0 | 1;
  userName: string;
  nickName: string;
  permission?: string;
  filter: string;
  role: number;
  sysRole?: number;
  /**
   * 0 - Deactive,
   * 1 - Active
   * @default 1 - Active
   */
  status: 0 | 1;
  remark: string;
  creation: {
    /**
     * YYYY-MM-DD HH:MM:SS
     */
    time: string;
    userGuid?: string;
    userName?: string;
    nickName?: string;
  };
  lastLogin?: {
    /**
     * YYYY-MM-DD HH:MM:SS
     */
    time: string;
    host: string;
  };
  lastChange?: {
    /**
     * YYYY-MM-DD HH:MM:SS
     */
    time: string;
    userGuid: string;
    userName: string;
    nickName: string;
  };
};
