import { useEffect, type FC, useState, useMemo,useContext } from "react";
import { Col, Row, message } from "antd";
import { AlarmRecordTable } from "../alarm-record-table";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import type { SearchProps } from "antd/es/input";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useSearch } from "@/hooks/use-search";
import { AlertsSearchFilterDrawer } from "@/modals/alerts-search-filter-drawer";
import {
  clearAlarmRecordEvents,
  setAlarmRecordEvents,
  setGlobalPageSize,
  setShowEventsFilterModal,
  setTotalAlarmRecord,
} from "@/store/slices/events";

import styles from "./index.module.css";
import { useQueryEventsMutation } from "@/services";
import { ReqDeviceEvent } from "@/types/device-event";
import {
  formatDate,
  getLastWeekDate,
  getTodayDate,
} from "@/utils/general-helpers";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getAlarmRecordEvents,
  getGlobalPageSize,
  getSelectedRowIds,
  getTotalAlarmRecords,
} from "@/store/selectors/events";
import debounce from "lodash.debounce";
import { ThemeContext } from "@/theme";
import { getShowEditSiteDrawer } from "@/store/selectors/sites";
import { setShowEditSiteDrawer } from "@/store/slices/sites";

const { Search } = Input;

export const AlarmRecordGrid: FC = () => {
  const dispatch = useAppDispatch();
  const { initialValue, onClear, onSearch } = useSearch();
  const [messageApi, contextHolder] = message.useMessage();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const [getAllEvents, { isLoading }] = useQueryEventsMutation();
  const [filter, setFilter] = useState<string | "">(""); //search handler state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const date = new Date();
  const [startDate, setStartDate] = useState<string>(
    formatDate(getLastWeekDate(date)),
  );
  const [endDate, setEndDate] = useState<string>(
    formatDate(getTodayDate(date)),
  );
  const [itemLevels, setItemLevels] = useState<any[]>([]);
  const [render, setRender] = useState<boolean>(false);
  const events = useAppSelector(getShowEditSiteDrawer);
  const storePageSize = useAppSelector(getGlobalPageSize);
  const selectedIds = useAppSelector(getSelectedRowIds);
  const total = useAppSelector(getTotalAlarmRecords);
  const handleSearch: SearchProps["onSearch"] = (value, _event, info) => {
    if (info?.source === "clear") {
      onClear();
    } else if (info?.source === "input") {
      onSearch(value);
    }
  };

  const handleFilterClick = () => {
    dispatch(setShowEditSiteDrawer(true));
  };

  useEffect(() => {
    console.log("Alarm Record Grid");
    const body: ReqDeviceEvent = {
      pageSize,
      startTime: startDate,
      endTime: endDate,
      startNum: (pageIndex - 1) * pageSize,
      processed: -1,
      sites: [],
      vendors: [],
      itemKeys: [],
      itemLevels: itemLevels,
      keyword: filter,
      orderBy: 1,
      pageIndex: pageIndex,
    };
    setTotalAlerts(total);
    let pageSizeChange = false;

    if (storePageSize !== pageSize || render) {
      setPageIndex(1);
      dispatch(clearAlarmRecordEvents());
      pageSizeChange = true;
    }
    const doExist = !pageSizeChange
      ? events.find((item: any) => item.pageIndex === pageIndex)
      : undefined;

    (async () => {
      if (!doExist) {
        const data = await getAllEvents(body);
        if ('error' in data) {
          messageApi.open({
            type: "error", 
            content: "Request Timeout",
          });
        }
        dispatch(
          setAlarmRecordEvents({
            pageIndex: pageIndex,
            data: 'data' in data ? data.data.data.event : [],
          }),
        );
        dispatch(setGlobalPageSize(pageSize));
        dispatch(setTotalAlarmRecord('data' in data ? data.data.data.totalCount : 0));
        setRender(false);
      }
    })();
  }, [
    pageIndex,
    pageSize,
    filter,
    render,
    total,
    itemLevels,
    startDate,
    endDate,
  ]);
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
      setFilter(e.target.value);
    } else {
      setFilter("");
    }
  };
  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);
  const handlePageFilterDate = (
    startD: string,
    endD: string,
    data: number[],
  ) => {
    setRender(true);
    console.log("data in filter", data);
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
      console.log("allSelectedItems", allSelectedItems);
    } else {
      setItemLevels([]);
    }
  };
  return (
    <>
    {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div
            className={styles.container}
            data-testid="alarm-record-grid-search"
          >
            <Search
              role="search"
              size="large"
              placeholder="Search..."
              allowClear={true}
              title="Enter the keyword and press Enter"
              maxLength={255}
              // onSearch={debouncedResults}
              onChange={debouncedResults}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              defaultValue={initialValue}
              className={`${
                darkTheme ? "search_input" : "search_input_light"
              }`}
            />

            <Button
              size="large"
              className={`filter_btn ${darkTheme ? "filter_btn_bg":""}`}
              icon={<FilterOutlined />}
              onClick={handleFilterClick}
            >
              Filter
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <AlarmRecordTable
            dataTestId="alarm-record-table"
            data={events}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalAlerts={totalAlerts}
            handlePageChange={handlePageChange}
            refetch={getAllEvents}
            loading={isLoading}
            className={`${darkTheme ? "alerts_table" :"" }`}
          />
        </Col>
      </Row>
      <AlertsSearchFilterDrawer darkTheme={darkTheme} alarmRecord={true} handlePageFilterDate={handlePageFilterDate} />
    </>
  );
};
