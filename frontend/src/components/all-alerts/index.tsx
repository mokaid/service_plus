import {
  type FC,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";

import { AlertsSearchFilterDrawer } from "@/modals/alerts-search-filter-drawer";
import { setAllEvents, setShowEventsFilterModal } from "@/store/slices/events";

import { AllAlertsTable } from "../all-alerts-table";

import styles from "./index.module.css";

import { DeviceEvent } from "@/types/device-event";

import {
  useQueryEventsMutation,
  useProcessEventMutation,
  useGetAssetsStatisticsMutation,
} from "@/services";
import debouce from "lodash.debounce";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getSelectedRowIds } from "@/store/selectors/events";
import { ThemeContext } from "@/theme";
import { RootState } from "@/types/store";
import { setShowDateFilter } from "@/store/slices/sites";
import moment from "moment";
import Item from "antd/es/list/Item";
import Search from "antd/es/input/Search";
import { setFilters } from "@/store/slices/filters";

type Fields = {
  search: string;
};

const { Title } = Typography;

export const AllAlerts: FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<Fields>();
  const [getAllEvents, { isLoading }] = useQueryEventsMutation();
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
  const selectedIds = useAppSelector(getSelectedRowIds);

  const filters = useSelector((state: RootState) => state.filters);

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

  const handlePageFilterDate = (
    startD: string,
    endD: string,
    data: number[],
    // sites?: string[]
  ) => {
    setRender(true);
    if (startD !== undefined) {
      setStartDate(startD);
    }
    if (endD !== undefined) {
      setEndDate(endD);
    }
    if (data.length !== 0 && data !== undefined) {
      const finalResult = {
        ...itemLevels,
        ...data,
      };
      const FilteredData = finalResult;
      const allSelectedItems = [].concat(...Object.values(FilteredData));
      setItemLevels(allSelectedItems);
    } else {
      setItemLevels([]);
    }
  };

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

  const { totalAlerts } = useSelector((state: RootState) => state.events);
  const [
    getAssetsStatistics,
    { data: dashboardStatistics, isLoading: dashboardLoading },
  ] = useGetAssetsStatisticsMutation();

  useEffect(() => {
    (async () => {
      await getAssetsStatistics({
        ...filters,
        startTime: moment(filters.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(filters.endTime).format("YYYY-MM-DD HH:mm:ss"),
      });
    })();
  }, [filters]);

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
          getAssetsStatistics({
            ...filters,
          });
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

  useEffect(() => {
    (async () => {
      const res = await getAllEvents({
        processed: 0,
      });
    })();
  }, []);

  return (
    <>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <header className={styles.header}>
            <Title level={4}>All Alerts — {totalAlerts}</Title>

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
              <Button
                className={`filter_btn ${darkTheme ? "filter_btn_bg" : ""}`}
                icon={<CheckCircleOutlined />}
                disabled={!clearAll || isLoading}
                onClick={() => ClearAllEvents()}
              >
                Clear All
              </Button>
            </Space>
          </header>
        </Col>

        <Col span={24}>
          <AllAlertsTable
            refetch={getAllEvents}
            dataTestId="all-alerts-table"
            pageIndex={pageIndex}
            pageSize={pageSize}
            handlePageChange={handlePageChange}
            loading={dashboardLoading}
            className={`${darkTheme ? "alerts_table" : ""}`}
            totalAlerts={totalAlerts}
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
