import React, { useState } from "react";
import { Button, Popover, Space, Typography } from "antd";
import styles from './index.module.css'
import { InfoCircleOutlined, InfoOutlined } from "@ant-design/icons";

const { Link } = Typography;
const Popup: React.FC = () => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={<Content hide={hide} />}
      trigger="click"
      open={open}
      placement="bottomRight"
      onOpenChange={handleOpenChange}
    //   style={{background:"blue"}}   
    >
      <Link>Delete</Link>
    </Popover>
  );
};

export default Popup;

const Content = ({ hide }: { hide: any }) => {
  return (
    <div style={{ padding: "0.7rem" }}>
      <Space>
        <Typography style={{ fontSize: "18px" }}>
        <InfoOutlined style={{borderRadius:"50%",background:"rgba(251, 182, 45, 1)",color:"rgba(15, 30, 76, 1)"}} />  Delete the Site Dubai?
        </Typography>
      </Space>
      <Space style={{ display: "flex", justifyContent: "flex-end",marginTop:"8px"}}>
        <Button 
          size="small"
          className={styles.default_btn}
          onClick={hide}
        
        >
          No
        </Button>
        <Button size="small" onClick={hide} className={styles.primary_btn} >
          Yes
        </Button>
      </Space>
    </div>
  );
};
