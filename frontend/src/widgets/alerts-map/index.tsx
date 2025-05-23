import circleMarker from "@/assets/circleMarker.svg";
import { ActionList } from "@/components/action-list";
import { GoogleMapControl } from "@/components/google-map-control";
import { Widget } from "@/components/widget";
import { GOOGLE_MAP_API_KEY } from "@/const/google-maps";
import { useGetEventTopDataMutation, useGetSitesQuery } from "@/services";
import { filters, setFilters } from "@/store/slices/filters";
import { setSelectedSite } from "@/store/slices/sites";
import { ThemeContext } from "@/theme";
import { formatDate, getLastWeekDate } from "@/utils/general-helpers";
import { AlertData } from "@/widgets/site-map";
import {
  AimOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Badge, Button, Empty, Input, Spin, Typography } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import clsx from "clsx";
import moment from "moment";
import { useCallback, useContext, useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ALERTS_MAP_CONFIG } from "./config";
import styles from "./index.module.css";

type Props = {
  className?: string;
  dataTestId?: string;
  data: [];
  isLoading: boolean;
  selectedSite: string | null;
  setSelectedSiteId: React.Dispatch<React.SetStateAction<string>>;
};

const { Search } = Input;

export const AlertsMap: FC<Props> = ({
  className,
  dataTestId,
  data,
  isLoading,
  selectedSite,
  setSelectedSiteId,
  // setSelectedSite,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  const dispatch = useDispatch();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [_, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlertData, setFilteredAlertData] = useState<AlertData[]>([]);
  const [top10WeeklyAlertsbySite, setTop10WeeklyAlertsBySite] = useState([]);
  const [top10SevenAlerts, setTop10SevenAlerts] = useState([]);

  //Get Event Top Data
  const [getChartTop10Events] = useGetEventTopDataMutation();

  const { currentData: sites } = useGetSitesQuery({});

  const getTop10WeeklyAlertsBySite = async () => {
    const response = await getChartTop10Events({
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date()),
      groupBy: 5,
    });

    setTop10WeeklyAlertsBySite((response as any)?.data?.data?.data);
    setTop10SevenAlerts(
      (response as any)?.data?.data?.data.filter(
        (_: any, index: number) => index < 7,
      ),
    );
  };

  const handleRemoveFilter = () => {
    dispatch(setSelectedSite(null));
    setSelectedSiteId("");
    dispatch(
      setFilters({
        ...filters,
        startTime: moment(getLastWeekDate(new Date())).format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        sites: [],
      }),
    );
  };

  useEffect(() => {
    getTop10WeeklyAlertsBySite();
  }, []);

  useEffect(() => {
    let manipulatedData: any[] = data;
    const selectedSiteId = selectedSite?.split(" ")[0];

    if (selectedSite) {
      manipulatedData = manipulatedData?.filter(
        (alert: any) => alert?.site?.id == selectedSiteId,
      );
    }
    const filteredData = manipulatedData?.map((alert: any) => {
      const siteId = selectedSiteId ? selectedSiteId : alert?.site?.id;

      const site = sites?.find((s: any) => s.id === siteId);
      const top10WeeklyAlertsBySite = top10WeeklyAlertsbySite.find(
        (s: any) => s.name.split(" ")[0] === alert?.site?.id,
      );

      if (site && top10WeeklyAlertsBySite) {
        return {
          ...alert,
          site: {
            ...alert.site,
            latitude: site.latitude,
            longitude: site.longitude,
            count: (top10WeeklyAlertsBySite as any).count,
          },
        };
      }
      return alert;
    });

    // const newData = filteredData.filter((alert) => {
    //   return alert?.site?.name
    //     ?.toLowerCase()
    //     .includes(searchQuery.toLowerCase());
    // });

    const newData = filteredData;

    setFilteredAlertData(newData);
  }, [data, searchQuery, top10WeeklyAlertsbySite]);

  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      if (filteredAlertData.length > 0) {
        setMap(mapInstance);
      }
    },
    [filteredAlertData],
  );

  const handleMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleNavigate = async (name: string) => {
    dispatch(setSelectedSite(name));

    dispatch(
      setFilters({
        ...filters,
        startTime: moment(getLastWeekDate(new Date())).format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        sites: [name.split(" ")[0]],
      }),
    );
  };

  return (
    <div className={clsx(className, styles.container)} data-testid={dataTestId}>
      <Widget
        title="Weekly Alerts By Site"
        className={`${styles.alerts} ${
          darkTheme ? styles.alerts_bg : styles.alert_light
        }`}
        contentClassName={styles.content}
        round={false}
        extraAddon={
          selectedSite && (
            <Button
              onClick={handleRemoveFilter}
              size="small"
              danger
              type="link"
            >
              Remove Filter <CloseCircleOutlined />
            </Button>
          )
        }
      >
        <Search
          placeholder="Search..."
          className={`${
            darkTheme ? "serch_input_map" : "light_serch_input_map"
          }`}
          style={{ borderStartStartRadius: 0 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ActionList
          className={`${styles.list} ${darkTheme ? styles.list_bg : ""}`}
        >
          {(!isLoading && top10WeeklyAlertsbySite?.length) === 0 ? (
            <div className="loader">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : isLoading ? (
            <div className="loaderContainer">
              <Spin
                indicator={
                  <LoadingOutlined style={{ fontSize: 24 }} spin={true} />
                }
              />
            </div>
          ) : (
            <>
              {(searchQuery
                ? top10WeeklyAlertsbySite.filter((item: any) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                : top10SevenAlerts
              )?.map((site: { name: string; count: number }) => (
                <ActionList.Item
                  key={site.name}
                  extra={
                    <Typography.Text
                      type={selectedSite == site.name ? "success" : "secondary"}
                    >
                      {site.count}
                    </Typography.Text>
                  }
                  onClick={() => handleNavigate(site.name)}
                >
                  <Badge status="success" />{" "}
                  <Typography.Text
                    type={selectedSite == site.name ? "success" : "secondary"}
                  >
                    {site.name}
                  </Typography.Text>
                </ActionList.Item>
              ))}
            </>
          )}
        </ActionList>
      </Widget>

      <ErrorBoundary>
        {isLoaded && (
          <GoogleMap
            key={"sds"}
            mapContainerClassName={styles.map}
            options={ALERTS_MAP_CONFIG}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
            zoom={2}
          >
            {filteredAlertData?.map((data: any) => {
              return (
                <Marker
                  key={data?.eventId}
                  position={{
                    lat: data?.site?.latitude,
                    lng: data?.site?.longitude,
                  }}
                  onClick={() =>
                    handleNavigate(`${data?.site?.id} ${data?.site?.name}`)
                  }
                  options={{
                    icon: circleMarker,
                    label: {
                      text: String(data?.site?.count),
                      fontSize: "12px",
                      color: "white",
                    },
                  }}
                  label={String(data?.site?.count)}
                />
              );
            })}
            <GoogleMapControl
              position={window.google.maps.ControlPosition.RIGHT_BOTTOM}
            >
              <button
                type="button"
                className={styles.mapButton}
                style={{ marginInlineEnd: "6px" }}
                // onClick={handleMapCenterClick}
                title="Re-center the map"
                aria-label="Re-center the map"
              >
                <AimOutlined />
              </button>
            </GoogleMapControl>
          </GoogleMap>
        )}
      </ErrorBoundary>
    </div>
  );
};
