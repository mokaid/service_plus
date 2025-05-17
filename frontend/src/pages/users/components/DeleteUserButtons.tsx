import { useDeleteUserMutation } from "@/services";
import { User } from "@/types/user";
import {
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { Button, Popconfirm, PopconfirmProps } from "antd";
import useMessage from "antd/es/message/useMessage";

const DeleteUserButton = ({
  user,
  refetch,
}: {
  user: User;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<any, any, any, any, any>
  >;
}) => {
  const [messageApi, messageContext] = useMessage();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const confirmDelete: PopconfirmProps["onConfirm"] = async () => {
    const response = await deleteUser({ userGuid: user.userGuid });
    if ('data' in response) {
      messageApi.success("User has been deleted!");
      refetch();
    }
  };

  return (
    <>
      {messageContext}

      {
        <Popconfirm
          title="Delete User"
          description="Are you sure to delete this user?"
          onConfirm={confirmDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button size="small" type="primary" loading={isLoading} danger>
            Delete
          </Button>
        </Popconfirm>
      }
    </>
  );
};

export default DeleteUserButton;
