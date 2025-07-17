import { type FC, useContext, useEffect, useMemo, useState } from "react";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Row, Space, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { AlertsSearchFilterDrawer } from "@/modals/alerts-search-filter-drawer";
import {
  clearAllSelectEvents,
  setShowEventsFilterModal,
  setTotalAlertsGlobal,
} from "@/store/slices/events";

import { AllAlertsTable } from "../all-alerts-table";

import styles from "./index.module.css";

import { useAppSelector } from "@/hooks/use-app-selector";
import {
  useGetUserAllowedSitesMutation,
  useProcessEventMutation,
  useQueryEventsMutation,
} from "@/services";
import { getSelectedRowIds } from "@/store/selectors/events";
import { setFilters } from "@/store/slices/filters";
import { setShowDateFilter } from "@/store/slices/sites";
import { ThemeContext } from "@/theme";
import { RootState } from "@/types/store";
import Search from "antd/es/input/Search";
import debouce from "lodash.debounce";
import { decodeBase64 } from "@/utils/decodeBase64";

type Fields = {
  search: string;
};

interface PropsType {
  setRefetch?: React.Dispatch<React.SetStateAction<boolean>>;
  recordTable?: boolean;
}

const { Title } = Typography;

export const AllAlerts: FC<PropsType> = ({
  setRefetch,
  recordTable,
}: PropsType) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<Fields>();
  const [getAllEvents, { data: currentData, isLoading }] =
    useQueryEventsMutation();
  const [handleProcessEvents, {}] = useProcessEventMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchfilter, setSearchFilter] = useState<string | "">(""); //search handler state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [clearAll, setClearAll] = useState<boolean>(false);

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [itemLevels, setItemLevels] = useState<any[]>([]);
  const [render, setRender] = useState<boolean>(false);
  let selectedIds = useAppSelector(getSelectedRowIds);
  const user = useAppSelector((state: RootState) => state.authState.user);

  const filters = useSelector((state: RootState) => state.filters);

  const totalAlerts = useSelector(
    (state: RootState) => state.events.totalAlerts,
  );

  const [allowedSites, setAllowedSites] = useState<any[]>([]);

  //USER ALLOWED SITES
  const [getUserAllowedSites] = useGetUserAllowedSitesMutation();

  const handleAllowedSites = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });
    const filteredSites: any[] = [];
    if ("data" in res) {
      res?.data?.filter?.forEach((item: any, index: number) => {
        const splittedValue =
          item?.orgId?.split("00")[item?.orgId.split("00").length - 1];

        const orgId = res?.data?.filter[0]?.orgId?.split("00")[1];

        let newSiteId;
        if (splittedValue?.length === 2 && orgId) {
          newSiteId = `000${item?.orgId}`;
        }
        if (splittedValue?.length === 3 && orgId) {
          newSiteId = `00${item?.orgId}`;
        }
        if (splittedValue?.length === 3 && orgId === undefined) {
          newSiteId = `0${item?.orgId}`;
        }
        if (splittedValue?.length === 2 && orgId === undefined) {
          newSiteId = `00${item?.orgId}`;
        }

        if (newSiteId) {
          filteredSites.push(newSiteId);
        }
      });

      setAllowedSites(filteredSites);
    }
  };

  useEffect(() => {
    handleAllowedSites();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getAllEvents({
        ...filters,
        processed: recordTable ? -1 : 0,
        sites: filters?.sites.length > 0 ? filters?.sites : allowedSites,
      });
    })();
  }, [filters, allowedSites, recordTable]);

  const handleSubmit = (values: Fields) => {
    dispatch(
      setFilters({
        ...filters,
        keyword: searchfilter,
      }),
    );
  };

  useEffect(() => {
    if (selectedIds.length !== 0) {
      setClearAll(true);
    } else {
      setClearAll(false);
    }
  }, [selectedIds]);

  const handleFilterClick = () => {
    dispatch(setShowEventsFilterModal(true));
    dispatch(setShowDateFilter(true));
  };

  // const handlePageFilterDate = (
  //   startD: string,
  //   endD: string,
  //   data: number[],
  //   // sites?: string[]
  // ) => {
  //   setRender(true);
  //   if (startD !== undefined) {
  //     setStartDate(startD);
  //   }
  //   if (endD !== undefined) {
  //     setEndDate(endD);
  //   }
  //   if (data.length !== 0 && data !== undefined) {
  //     const finalResult = {
  //       ...itemLevels,
  //       ...data,
  //     };
  //     const FilteredData = finalResult;
  //     const allSelectedItems = [].concat(...Object.values(FilteredData));
  //     setItemLevels(allSelectedItems);
  //   } else {
  //     setItemLevels([]);
  //   }
  // };

  const handlePageChange = (page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };
  const handleChange = (e: any) => {
    setRender(true);
    if (
      e.target.value !== null ||
      e.target.value !== undefined ||
      e.target.value !== ""
    ) {
      setSearchFilter(e.target.value);
    } else {
      setSearchFilter("");
      dispatch(
        setFilters({
          ...filters,
          keyword: "",
        }),
      );
    }
  };
  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);

  const ClearAllEvents = async () => {
    const event: Array<number> = selectedIds;
    const body: any = {
      event,
      processStatus: 2,
    };

    if (selectedIds.length > 0) {
      const res = await handleProcessEvents(body);
      if (res) {
        if ("data" in res) {
          if (!recordTable) {
            await getAllEvents({
              ...filters,
              processStatus: recordTable ? -1 : 0,
            });
          }

          // dispatch(clearAllSelectEvents());

          messageApi.open({
            type: "success",
            content: "Process status updated",
          });
        } else {
          messageApi.open({
            type: "error",
            content: "Process status update failed",
          });
        }
      }
    } else {
      messageApi.open({
        type: "error",
        content: "Check the alarms you want to clear first",
      });
    }
  };

  const dashboardPermission = useMemo(() => {
    const permissions = decodeBase64(user?.permission || "");
    return permissions?.Dashboard.m;
  }, [user]);

  return (
    <>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <header className={styles.header}>
            <Title level={4}>
              All Alerts — {isLoading ? "0" : totalAlerts}
            </Title>

            <Space size="middle" align="center">
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  ...filters,
                }}
                name="all-alerts-search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-testid="all-alerts-search-form"
                onFinish={handleSubmit}
              >
                <Form.Item name="search" noStyle={true}>
                  <Search
                    placeholder="Search"
                    allowClear={{
                      clearIcon: (
                        <CloseCircleOutlined
                          onClick={() => {
                            setSearchFilter("");
                            dispatch(
                              setFilters({
                                ...filters,
                                keyword: "",
                              }),
                            );
                          }}
                        />
                      ),
                    }}
                    onChange={debouncedResults}
                    className={`${
                      darkTheme ? "search_input" : "search_input_light"
                    }`}
                    onSubmit={form.submit}
                  />
                </Form.Item>
              </Form>

              <Button
                className={`filter_btn ${darkTheme ? "filter_btn_bg" : ""}`}
                icon={<FilterOutlined />}
                onClick={handleFilterClick}
              >
                Filter
              </Button>
              {dashboardPermission === 1 &&
                user?.role === 99 &&
                !user?.permission && (
                  <Button
                    className={`filter_btn ${darkTheme ? "filter_btn_bg" : ""}`}
                    icon={<CheckCircleOutlined />}
                    disabled={!clearAll || isLoading}
                    onClick={() => ClearAllEvents()}
                  >
                    Clear All
                  </Button>
                )}
              {user?.role === 99 && !user?.permission && (
                <Button
                  className={`filter_btn ${darkTheme ? "filter_btn_bg" : ""}`}
                  icon={<CheckCircleOutlined />}
                  disabled={!clearAll || isLoading}
                  onClick={() => ClearAllEvents()}
                >
                  Clear All
                </Button>
              )}
            </Space>
          </header>
        </Col>

        <Col span={24}>
          <AllAlertsTable
            refetch={getAllEvents}
            dataTestId="all-alerts-table"
            eventsData={currentData}
            pageIndex={pageIndex}
            pageSize={pageSize}
            handlePageChange={handlePageChange}
            loading={false}
            className={`${darkTheme ? "alerts_table" : ""}`}
            totalAlerts={totalAlerts}
            eventsLodaer={isLoading}
            setRefetch={setRefetch}
            recordTable={recordTable}
          />
        </Col>
      </Row>

      <AlertsSearchFilterDrawer
        darkTheme={darkTheme}
        dataTestId="all-alerts-search-filter"
        handlePageFilterDate={(startDate, endDate) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
      />
    </>
  );
};

function setStartDate(startD: string) {
  throw new Error("Function not implemented.");
}
function setEndDate(endD: string) {
  throw new Error("Function not implemented.");
}
