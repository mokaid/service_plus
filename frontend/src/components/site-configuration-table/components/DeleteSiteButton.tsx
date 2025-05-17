import { useDeleteSiteMutation } from "@/services";
import { Button, Popconfirm, PopconfirmProps } from "antd";
import useMessage from "antd/es/message/useMessage";

const DeleteSiteButton = ({
  id,
  refetch,
}: {
  id: string;
  refetch: () => void;
}) => {
  const [messageApi, messageContext] = useMessage();
  const [deleteSite, { isLoading }] = useDeleteSiteMutation();
  const confirmDelete: PopconfirmProps["onConfirm"] = async () => {
    const response = await deleteSite({ siteId: id });
    if ('data' in response && response.data.error == 0) {
      messageApi.success("Site has been deleted !");
      refetch();
    } else if ('error' in response) {
      messageApi.error(response.error);
    }
  };

  return (
    <>
      {messageContext}

      <Popconfirm
        title="Delete Site"
        description="Are you sure to delete this site?"
        onConfirm={confirmDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button loading={isLoading} danger type="link">
          Delete
        </Button>
      </Popconfirm>
    </>
  );
};

export default DeleteSiteButton;
