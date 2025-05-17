import React, { useState,useContext } from "react";
import { Button, Form, Popover, Space, Typography } from "antd";
import styles from './index.module.css'
import { InfoCircleOutlined, InfoOutlined, LinkOutlined } from "@ant-design/icons";
import { ThemeContext } from "@/theme";
import { getMultipleSelectProps } from "@/utils/form-helpers/get-multiple-select-props";
import { BaseSelect } from "@/components/base-select";

const { Link } = Typography;
const LinkSitePopOver: React.FC = () => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  return (
    <Popover
      content={<Content hide={hide} />}
      trigger="click"
      open={open}
      placement="bottomRight"
      title="Link Site"
      onOpenChange={handleOpenChange}   
    >
      <Button
              size="large"
              // disabled={true}
              className={`${
                darkTheme ? "dark_disabled_button" : "light_disabled_button"
              }`}
              // type="primary"
              icon={<LinkOutlined />}
              // onClick={handleFilterClick}
            >
              Link Site
            </Button>
    </Popover>
  );
};

export default LinkSitePopOver;

const Content = ({ hide }: { hide: any }) => {
  const { Item } = Form;
  const [form] = Form.useForm<any>();
  return (
    
    <>

    <div className={styles.pop_test}>
   

      <label style={{marginTop:"12px"}}>*Parent Group</label>
          <BaseSelect
            mode="multiple"
            placeholder="Select Site"
            allowClear={true}
            // options={siteOptions}
            className={`select_input ${styles.select_input}`}
           
            />
      <div style={{ display: "flex", justifyContent: "center",marginTop:"8px",columnGap:"0.3rem"}}>
      <Button size="small" onClick={hide} className={styles.primary_btn} >
        Submit
        </Button>
        <Button 
          size="small"
          className={styles.default_btn}
          onClick={hide}
          
          >
          Cancel
        </Button>
        
          </div>
    </div>
    </>
  );
};
