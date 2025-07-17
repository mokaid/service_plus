import { useUploadMutation } from "@/services";
import { ThemeContext } from "@/theme";
import { InboxOutlined } from "@ant-design/icons";
import {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useContext, useState, FC } from "react";
import styles from "./index.module.css";
import { useAppSelector } from "@/hooks/use-app-selector";
import { RootState } from "@/types/store";

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<any, any, any, any, any>
  >;
};

type Fields = {
  fileName: string;
  boxType: 1 | 0;
  packageType: 1 | 0;
  version: string;
};

const { Dragger } = Upload;

export const UploadPackageModal: FC<Props> = ({ show, setShow, refetch }) => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [form] = Form.useForm<Fields>();
  const [fileList, setFileList] = useState<any[]>([]); // State to manage uploaded files
  const [uploadPackage, { data: packageData, isLoading }] = useUploadMutation();
  const user = useAppSelector((state: RootState) => state.authState.user);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setShow(false);
  };

  const handleUpload = async (data: Fields) => {
    if (fileList.length === 0) {
      message.error("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("fileName", data.fileName);
    formData.append("boxType", String(data.boxType));
    formData.append("packageType", data.packageType.toString());
    formData.append("version", data.version);
    formData.append("file", fileList[0]); // Assuming only a single file upload
    formData.append("userId", user?.userGuid || "");

    try {
      const response = await uploadPackage(formData);

      if ("data" in response && !response?.data?.error) {
        message.success("Package uploaded successfully.");
      } else if ("error" in response) {
        message.error(`${response?.error?.data?.desc}`);
      }
      refetch();
      handleClose();
    } catch (error) {
      message.error("Failed to upload the package. Please try again.");
    }
  };

  const onFinish = (data: Fields) => {
    handleUpload(data);
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    fileList: fileList,
    beforeUpload: (file) => {
      setFileList([file]); // Store the file in the state
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  return (
    <Drawer
      open={show}
      width={460}
      title="Upload Package"
      destroyOnClose={true}
      onClose={handleClose}
      style={{ background: `${darkTheme ? "#0C183B" : ""}` }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="File Name"
          name="fileName"
          rules={[{ required: true, message: "Enter Name" }]}
        >
          <Input className={styles.input_bg} />
        </Form.Item>

        <Form.Item
          label="Box Type"
          name="boxType"
          rules={[{ required: true, message: "Choose Box Type" }]}
        >
          <Select
            className="select_input"
            options={[
              { value: 0, label: "Standard Version" },
              { value: 1, label: "Lite Version" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Package Type"
          name="packageType"
          rules={[{ required: true, message: "Choose Package Type" }]}
        >
          <Select
            className="select_input"
            options={[
              { value: 0, label: "OS" },
              { value: 1, label: "Firmware" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Package Version"
          name="version"
          rules={[{ required: true, message: "Enter Version" }]}
        >
          <Input className={styles.input_bg} />
        </Form.Item>

        <Form.Item>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. Strictly prohibited from uploading
              company data or other banned files.
            </p>
          </Dragger>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoading}
          disabled={fileList.length === 0}
        >
          Upload Package
        </Button>
      </Form>
    </Drawer>
  );
};
