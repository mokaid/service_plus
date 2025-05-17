import circleMarker from "@/assets/orangemarker.svg";
import { GoogleMapControl } from "@/components/google-map-control";
import { GOOGLE_MAP_API_KEY } from "@/const/google-maps";
import { useGetEventTopDataMutation, useQueryEventsMutation } from "@/services";
import {
  clearAllSelectEvents,
  setShowSiteInfoModal,
} from "@/store/slices/events";
import { setSelectedSite, setSiteObject } from "@/store/slices/sites";
import { OrganisationSite } from "@/types/organisation";
import { formatDate, getLastWeekDate } from "@/utils/general-helpers";
import { AimOutlined } from "@ant-design/icons";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import clsx from "clsx";
import { useCallback, useEffect, useState, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ALERTS_MAP_CONFIG } from "./config";
import styles from "./index.module.css";
import { RootState } from "@/types/store";

export interface AlertData {
  site: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    count: number;
  };
}

interface TopAlertSite {
  name: string;
  count: number;
}

type Props = {
  className?: string;
  dataTestId?: string;
  sites: OrganisationSite[];
};

export const SiteMapComp: FC<Props> = ({ className, dataTestId, sites }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [searchQuery, _] = useState("");
  const [filteredAlertData, setFilteredAlertData] = useState<AlertData[]>([]);

  const [top10WeeklyAlertsbySite, setTop10WeeklyAlertsBySite] = useState<
    TopAlertSite[]
  >([]);

  const [getChartTop10Events] = useGetEventTopDataMutation();

  const [getEvents, { data: events }] = useQueryEventsMutation();

  console.log(events, "events on site map");

  const getTop10WeeklyAlertsBySite = async () => {
    try {
      const response = await getChartTop10Events({
        startTime: formatDate(getLastWeekDate(new Date())),
        endTime: formatDate(new Date()),
        groupBy: 5,
        top: 50,
      });

      if ((response as any)?.data?.data?.data) {
        setTop10WeeklyAlertsBySite((response as any).data.data.data);
      }
    } catch (error) {
      console.error("Error fetching top alerts:", error);
    }
  };

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapCenterClick = () => {
    if (map === null) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map.panTo(ALERTS_MAP_CONFIG.center!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map.setZoom(ALERTS_MAP_CONFIG.zoom!);
  };

  const handleNavigate = async (id: string, name?: string) => {
    dispatch(clearAllSelectEvents());
    navigate(`/alert-map?siteId=${id}${name ? `&&title=${name}` : ""}`);
  };

  const onMarkerClick = (data: OrganisationSite) => {
    dispatch(setShowSiteInfoModal(true));
    dispatch(setSelectedSite(data.id));
    dispatch(setSiteObject(data));
  };

  const filters = useSelector((state: RootState) => state.filters);
  useEffect(() => {
    getTop10WeeklyAlertsBySite();
    getEvents({
      ...filters,
      pageSize: 50,
      pageIndex: 1,
    });
  }, []);

  useEffect(() => {
    if (!events?.data?.event) return;

    const filteredData = events?.data?.event.map((alert: any) => {
      const siteId = alert?.site?.id;
      const site = sites?.find((s) => s.id === siteId);

      const top10WeeklyAlertsBySite = top10WeeklyAlertsbySite.find(
        (s) => s.name.split(" ")[0] === alert?.site?.id,
      );

      if (site && top10WeeklyAlertsBySite) {
        return {
          ...alert,
          site: {
            ...alert.site,
            latitude: site.latitude,
            longitude: site.longitude,
            count: top10WeeklyAlertsBySite.count,
          },
        };
      }
      return alert;
    });

    const newData = filteredData?.filter((alert: any) => {
      return alert?.site?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    });

    setFilteredAlertData(newData || []);
  }, [events, searchQuery, sites, top10WeeklyAlertsbySite]);

  return (
    <div className={clsx(className, styles.container)} data-testid={dataTestId}>
      <ErrorBoundary>
        {isLoaded && (
          <GoogleMap
            key={"sds"}
            mapContainerClassName={styles.map}
            options={ALERTS_MAP_CONFIG}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
          >
            {filteredAlertData?.map((data) => {
              return (
                <Marker
                  key={data?.site?.id}
                  position={{
                    lat: data?.site?.latitude,
                    lng: data?.site?.longitude,
                  }}
                  onClick={() => handleNavigate(data?.site?.id)}
                  options={{
                    icon: (window.google.maps as any).Icon,
                  }}
                  icon={circleMarker}
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
