import { Button, Drawer, Form } from "antd";
import { SetStateAction, useContext, type FC } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getSelectedEvents,
  getShowSiteInfoModalState,
} from "@/store/selectors/events";
import { setSelectedEvents, setShowSiteInfoModal } from "@/store/slices/events";
import { ProcessStatus } from "@/types/device-event";

import { PermissionGuard } from "@/components/permission-guard";
import { SiteInfoListMap } from "@/components/site-info-map-list";
import { getSiteObject } from "@/store/selectors/sites";
import { setShowConfigureSiteDrawer } from "@/store/slices/sites";
import { ThemeContext } from "@/theme";
import { EditSiteModal } from "../edit-site-modal";
import styles from "./index.module.css";

type Props = {
  dataTestId?: string;
  refetch: () => any;
};

type Fields = {
  processStatus: ProcessStatus;
  remarks: string;
  caseNumber: string;
};

const initialValues: Fields = {
  processStatus: ProcessStatus.Accomplished,
  remarks: "",
  caseNumber: "",
};

export const SiteInfo: FC<Props> = ({ dataTestId, refetch }) => {
  const dispatch = useAppDispatch();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [form] = Form.useForm<Fields>();
  const show = useAppSelector(getShowSiteInfoModalState);
  const [event] = useAppSelector(getSelectedEvents);

  const siteObject = useAppSelector(getSiteObject);

  const handleClose = () => {
    dispatch(setShowSiteInfoModal(false));
    dispatch(setSelectedEvents([]));
  };

  const configureSite = () => {
    dispatch(setShowConfigureSiteDrawer(true));
  };

  return (
    <>
      <Drawer
        open={show}
        width={460}
        title="Site Info"
        destroyOnClose={true}
        onClose={() => handleClose()}
        data-testid={dataTestId}
        style={{ background: `${darkTheme ? "#0C183B" : ""}` }}
        extra={
          <PermissionGuard keyName="siteMap" action="m">
            <Button
              onClick={configureSite}
              className={`filter_btn ${darkTheme ? "filter_btn_bg" : ""}`}
              type="primary"
            >
              Edit Site
            </Button>
          </PermissionGuard>
        }
      >
        <div className={styles.container}>
          <>
            <SiteInfoListMap site={siteObject} />
          </>
        </div>
        <EditSiteModal
          refetch={refetch}
          Show={false}
          setAddSite={function (): void {
            throw new Error("Function not implemented.");
          }}
          organizations={undefined}
          organizationsLoading={false}
        />
      </Drawer>
    </>
  );
};
