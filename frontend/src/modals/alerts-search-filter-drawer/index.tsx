import { Button, Checkbox, DatePicker, Drawer, Form, Space } from "antd";
import { useEffect, useState, type FC } from "react";

import { BaseSelect } from "@/components/base-select";
import { ALARM_LEVEL_OPTIONS } from "@/const/alarm";
import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  useEventsFiltersMutation,
  useGetSitesQuery,
  useGetSiteSystemObjectItemMutation,
  useGetSiteSystemObjectMutation,
  useGetSiteSystemsMutation,
  useGetUserAllowedSitesMutation,
} from "@/services";
import { getShowEventsFilterModalState } from "@/store/selectors/events";
import { getShowDateFilter } from "@/store/selectors/sites";
import { setShowEventsFilterModal } from "@/store/slices/events";
import { setFilters } from "@/store/slices/filters";
import { DeviceEvent } from "@/types/device-event";
import { RootState } from "@/types/store";
import { getCheckboxGroupProps } from "@/utils/form-helpers/get-checkbox-group-props";
import { getDateFromEvent } from "@/utils/form-helpers/get-date-from-event";
import { getDateProps } from "@/utils/form-helpers/get-date-props";
import { getMultipleSelectProps } from "@/utils/form-helpers/get-multiple-select-props";
import { formatDate, getLastWeekDate } from "@/utils/general-helpers";
import { selectOptions } from "@/utils/selectOptions";
import moment from "moment";
import { useSelector } from "react-redux";
import { setSelectedSite } from "@/store/slices/sites";

type Props = {
  dataTestId?: string;
  handlePageFilterDate: (
    startDate: string,
    endDate: string,
    data: number[],
  ) => void;
  alarmRecord?: boolean;
  darkTheme?: boolean;
};

type Fields = {
  datetime: string[];
  devices: string;
  priority: number[];
  sites: string[];
  type: unknown[];
  value: unknown[];
  vendors: string[];
  systems: string[];
  status: string[];
  eventType: string;
};

const { Item } = Form;
const { RangePicker } = DatePicker;

// const CustomSelect = ({ options, setState }: { options: any[], setState: React.Dispatch<React.SetStateAction<any[]|undefined>> }) => {
//   const [value, setValue] = useState<string | undefined>(undefined);

//   const handleChange = (val: string) => {
//       // Add custom input to options if it's not already present
//       if (!options.some(option => option.value === val)) {
//           setState([...options, { label: val, value: val }]);
//       }
//       setValue(val);
//   };

//   return (
//       <BaseSelect
//           style={{ width: "100%" }}
//           // placeholder="Select or enter a value"
//           value={value}
//           options={options}
//           onChange={handleChange}
//           onSearch={(val) => setValue(val)} // Update state while typing
//           filterOption={(input, option) =>
//               (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
//           }
//       />
//   );
// };

export const AlertsSearchFilterDrawer: FC<Props> = ({
  dataTestId,
  handlePageFilterDate,
  alarmRecord,
  darkTheme,
}) => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(getShowEventsFilterModalState);
  const [form] = Form.useForm<Fields>();
  // const [filterBy, setFilterBy] = useState<boolean>(0);
  const [vendorData, setVendorData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [sitesData, setSitesData] = useState<any[]>([]);

  const filters = useSelector((state: RootState) => state.filters);

  const date = new Date();

  const { currentData: sites, isLoading: sitesLoading } = useGetSitesQuery({});

  const [getFilters, { data: filtersData }] = useEventsFiltersMutation();

  const [getSiteSystem, { data: siteSystemData }] = useGetSiteSystemsMutation();

  const [getSiteSystemObject, { data: siteSystemObjectData }] =
    useGetSiteSystemObjectMutation();

  const [getSiteSystemObjectItem, { data: siteSystemObjectItemData }] =
    useGetSiteSystemObjectItemMutation();

  const user = useAppSelector((state: RootState) => state.authState.user);

  //USER ALLOWED SITES
  const [getUserAllowedSites, { isLoading: allowedSitesLoadaer }] =
    useGetUserAllowedSitesMutation();

  const handleAllowedSitesForCustomer = async () => {
    const res = await getUserAllowedSites({ userGuid: user?.userGuid });

    if ("data" in res) {
      const filteredSites: any[] = [];
      sites?.forEach((item: any) => {
        res?.data?.filter?.forEach((sites: any) => {
          const splittedValue = sites?.orgId?.split("0")[0];
          let newSiteId;
          if (splittedValue?.length === 2) {
            newSiteId = `0${sites?.orgId}`;
          } else {
            newSiteId = `00${sites?.orgId}`;
          }

          if (newSiteId) {
            if (newSiteId === item?.id) {
              filteredSites.push(item);
            } else {
              return;
            }
          }

          setSitesData(filteredSites);
        });
      });
    }
  };

  useEffect(() => {
    if (user?.role === 99 && user?.permission) {
      handleAllowedSitesForCustomer();
    } else {
      setSitesData(sites);
    }
  }, [user, sites]);

  useEffect(() => {
    getFilters({});
  }, []);

  const handleReset = () => {
    const initialFilters = {
      startTime: moment(formatDate(getLastWeekDate(date)))
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment(formatDate(new Date()))
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      priority: [],
      devices: null,
      sites: [],
      eventType: null,
      vendors: [],
    };
    setVendorData([]);
    setDeviceData([]);
    setCategoryData([]);
    // Reset form fields and update values explicitly
    form.resetFields();
    form.setFieldsValue({
      datetime: [initialFilters.startTime, initialFilters.endTime],
      priority: initialFilters.priority,
      devices:
        initialFilters.devices === null ? undefined : initialFilters.devices,
      sites: initialFilters.sites,
      eventType:
        initialFilters.eventType === null
          ? undefined
          : initialFilters.eventType,
      vendors: initialFilters.vendors,
    });

    // Update Redux state with initial filters
    dispatch(setFilters(initialFilters));

    // Close the filter modal
    dispatch(setShowEventsFilterModal(false));
  };

  const handleClose = () => {
    dispatch(setShowEventsFilterModal(false));
  };

  const siteOptions = sitesData
    ? sitesData.map((site: any) => ({
        label: site.name,
        value: site.id,
      }))
    : [];
  const venderOptions = vendorData
    ? vendorData.map((vendor: any) => ({
        label: vendor.systemName,
        value: vendor.id,
      }))
    : [];

  const devicesOptions = deviceData
    ? deviceData.map((device: any) => ({
        label: device.objName,
        value: device.objId,
      }))
    : [];

  const categoryOptions = categoryData
    ? categoryData.map((category: any) => ({
        label: category.itemName,
        value: category.itemName,
      }))
    : [];

  const handleSiteChange = async (value: any) => {
    if (typeof value === "undefined") {
      return {
        value: [],
      };
    }

    const siteSystemArray = Array.isArray(value) ? value : [value];
    if (siteSystemArray.length > 0) {
      const vendorsArray: any[] = [];
      for (let i = 0; i < siteSystemArray.length; i++) {
        const response = await getSiteSystem({
          siteId: siteSystemArray[i],
        });
        if ("data" in response) {
          vendorsArray.push(...(response.data || []));
        }
      }

      setVendorData(vendorsArray);
    }

    return {
      value: Array.isArray(value) ? value : [value],
    };
  };

  const handleSiteObjectChange = async (value: any) => {
    if (typeof value === "undefined") {
      return {
        value: [],
      };
    }
    const siteSystemObjectArray = Array.isArray(value) ? value : [value];

    if (siteSystemObjectArray.length > 0) {
      const devicesArray: any[] = [];
      for (let i = 0; i < siteSystemObjectArray.length; i++) {
        const response = await getSiteSystemObject({
          systemId: siteSystemObjectArray[i],
          pageIndex: 1,
          pageSize: 1000,
        });
        if ("data" in response) {
          devicesArray.push(...(response.data || []));
        }
      }

      setDeviceData(devicesArray);
    }

    return {
      value: Array.isArray(value) ? value : [value],
    };
  };

  const handleSiteObjectItemChange = async (value: any) => {
    if (typeof value === "undefined") {
      return {
        value: [],
      };
    }
    const siteSystemObjectItemArray = Array.isArray(value) ? value : [value];

    if (siteSystemObjectItemArray.length > 0) {
      const categoryArray: any[] = [];
      for (let i = 0; i < siteSystemObjectItemArray.length; i++) {
        const response = await getSiteSystemObjectItem({
          objId: siteSystemObjectItemArray[i],
          pageIndex: 1,
          pageSize: 1000,
        });
        if ("data" in response) {
          categoryArray.push(...(response.data || []));
        }
      }

      setCategoryData(categoryArray);
    }

    return {
      value: Array.isArray(value) ? value : [value],
    };
  };

  const AllEventsData = useSelector((state: RootState) => state.events);
  // console.log(AllEventsData, "AllEventsData");

  const vendors: any = [];
  const devices: any = [];
  const eventTypes: any = [];

  (AllEventsData.allEvents || []).forEach((ev: DeviceEvent) => {
    // Vendors
    const findVendor = vendors.find((item: any) => item.value == ev.vendor);
    if (!findVendor) {
      vendors.push({ label: ev.vendor, value: ev.vendor });
    }
    // devices
    const device = devices.find((item: any) => item.value == ev.obj.name);
    if (!device) {
      devices.push({ label: ev.obj.name, value: ev.obj.name });
    }
    // Event Types
    const type = eventTypes.find((item: any) => item.value == ev.obj.key);
    if (!type) {
      eventTypes.push({ label: ev.obj.key, value: ev.obj.key });
    }
  });

  const handleSubmit = (values: Fields) => {
    const vendorArrays = venderOptions.filter((item) => {
      return values.vendors.find((ven) => {
        return item.value === ven;
      });
    });

    const vendorNames: string[] = [];
    vendorArrays.forEach((item) => {
      vendorNames.push(item.label);
    });
    dispatch(setSelectedSite(""));

    let priorities: number[] = [];
    const priorityArray = values.priority
      ? values.priority.forEach((item: number) => {
          if (item === 0) {
            priorities.push(0, 1);
          } else if (item === 2) {
            priorities.push(2, 3);
          } else if (item === 4) {
            priorities.push(4, 5);
          } else {
            priorities.push();
          }
        })
      : [];

    dispatch(
      setFilters({
        ...filters,
        startTime: values.datetime
          ? moment(values.datetime[0]).format("YYYY-MM-DD HH:mm:ss")
          : moment(filters.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: values.datetime
          ? moment(values.datetime[1]).format("YYYY-MM-DD HH:mm:ss")
          : moment(filters.endTime).format("YYYY-MM-DD HH:mm:ss"),

        sites: values.sites || [],
        priority: priorities,
        devices: values.devices || null,
        eventType: values.eventType || null,
        vendors: vendorNames,
      }),
    );
    dispatch(setShowEventsFilterModal(false));
  };

  const handleEventChange = (value: any) => {
    console.log(value, "value");
  };

  return (
    <Drawer
      open={show}
      width={460}
      title="Filter"
      extra={
        <Space>
          <Button
            type="default"
            onClick={handleReset}
            style={{
              background: "transparent",
              borderRadius: "1px",
              borderColor: "#1B3687",
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={form.submit}
            style={{ borderRadius: "1px" }}
          >
            Apply
          </Button>
        </Space>
      }
      // destroyOnClose={true}
      onClose={handleClose}
      data-testid={dataTestId}
      style={{ background: `${darkTheme ? "#0C183B" : ""}` }}
    >
      <Form<Fields>
        form={form}
        layout="vertical"
        name="alerts-search"
        initialValues={{
          ...filters,
          datetime: [filters.startTime, filters.endTime],
        }}
        onFinish={handleSubmit}
        data-testid="alerts-search-form"
      >
        <Item<Fields>
          label="Priority"
          name="priority"
          getValueProps={getCheckboxGroupProps}
        >
          <Checkbox.Group
            options={ALARM_LEVEL_OPTIONS.map((opt) => ({
              label: opt.label,
              value: opt.value[0],
            }))}
            className={"filter_checkbox"}
          />
        </Item>
        <Item<Fields>
          label="Site"
          name="sites"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="multiple"
            placeholder="Select Site"
            allowClear={true}
            loading={sitesLoading}
            options={siteOptions}
            className="select_input"
            onChange={handleSiteChange}
          />
        </Item>
        <Item<Fields>
          label="Date and Time"
          name="datetime"
          getValueFromEvent={getDateFromEvent}
          getValueProps={getDateProps}
        >
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format={APP_DATE_TIME_FORMAT}
            className="date_input"
          />
        </Item>
        <Item<Fields>
          label="Vendors"
          name="vendors"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="tags"
            placeholder="Select Vendors"
            allowClear={true}
            options={venderOptions}
            className="select_input"
            onChange={handleSiteObjectChange}
          />
        </Item>
        {/* <Divider /> */}
        {/* <Card
          bodyStyle={{ display: "none" }}
          style={{ background: "transparent" }}
          headStyle={{ borderBottom: 0, background: "transparent" }}
          title="Filter By:"
          extra={
            <Space>
              <Typography.Text>Devices</Typography.Text>
              <Switch
                onChange={setFilterBy}
                checked={filterBy}
                style={{ background: filterBy ? "#1568db" : "#dc5b16" }}
              />
              <Typography.Text>Event Type</Typography.Text>
            </Space>
          }
        ></Card> */}
        {/* <Divider style={{ border: 0, marginBottom: 5 }} /> */}
        {/* {!filterBy ? ( */}
        <Item<Fields>
          label="Device"
          name="devices"
          // getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="tags"
            placeholder="Select device"
            allowClear={true}
            options={devicesOptions}
            className="select_input"
            onChange={handleSiteObjectItemChange}
          />
        </Item>
        {/* ) : ( */}
        <Item<Fields> label="Event Type" name="eventType">
          <BaseSelect
            mode="tags"
            placeholder="Select Event Type"
            allowClear={true}
            options={categoryOptions}
            className="select_input"
            onChange={handleEventChange}
          />
        </Item>
        {/* )} */}
      </Form>
    </Drawer>
  );
};
