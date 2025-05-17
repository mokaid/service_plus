import { useDeleteUploadMutation, useDeleteUserMutation } from "@/services";
import { QueryActionCreatorResult, QueryDefinition } from "@reduxjs/toolkit/query";
import { Button, Popconfirm, PopconfirmProps } from "antd";
import useMessage from "antd/es/message/useMessage";

const DeletePackgeButton = ({id, refetch}: {id: number, refetch: () => QueryActionCreatorResult<QueryDefinition<any, any, any, any, any>>}) => {
    
    const [ messageApi, messageContext ] = useMessage();
    const [ deleteUpload, { isLoading: isDeleting } ] = useDeleteUploadMutation();
    const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
      const response = await deleteUpload(id);
      if ('data' in response) {
        messageApi.success('Package has been deleted !');
        refetch();
      } else if ('error' in response) {
        messageApi.error(response.error);
      }
    };

    return (
      <>
      {messageContext}
      
      <Popconfirm
      title="Delete Package"
      description="Are you sure to delete this package?"
      onConfirm={confirmDelete}
      okText="Yes"
      cancelText="No"
    >
      <Button size="small" type="primary" loading={isDeleting} danger>Delete</Button>
    </Popconfirm>
    </>
  )
}

export default DeletePackgeButton;