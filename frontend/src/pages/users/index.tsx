import { Button, Col, Row, Space, Spin, Table } from "antd";
import { type FC, useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/theme";
import { Breadcrumbs } from "@/breadcrumbs";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { AddUserModal, EditUserModal } from "@/modals/user-modals";
import { useGetUsersQuery } from "@/services";
import { generateColumns } from "./components/config";
import { User } from "@/types/user";
import { useAppSelector } from "@/hooks/use-app-selector";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "@/utils/userPermissions";

export const Users: FC = () => {
  const { appTheme } = useContext(ThemeContext);
  const [addUser, setAddUser] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<User | false>(false);
  const darkTheme = appTheme === "dark";

  const { isLoading, refetch, currentData } = useGetUsersQuery({});

  const user = useAppSelector((state) => state.authState.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !hasPermission(user, "users", "v")) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // const {
  //   isLoading: allUsersLoader,
  //   refetch: refetchAllUsers,
  //   data: allUsersData,
  // } = useGetAllUsersQuery({});

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const columns = generateColumns({
    refetch: refetch,
    onEdit: setEditUser,
  });

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Breadcrumbs />
        </Col>
        {user?.role === 99 && !user?.permission && (
          <Col span={24}>
            <Space>
              <Button
                size="large"
                className="primary_button"
                type="primary"
                icon={<PlusOutlined color="white" />}
                onClick={() => {
                  setAddUser(true);
                }}
              >
                Create user
              </Button>
            </Space>
          </Col>
        )}
        <Col span={24}>
          <Table
            bordered
            rowKey="userName" // Replace with the correct key if different
            className={`${darkTheme ? "alerts_table" : ""}`}
            scroll={{ x: 1200 }}
            dataSource={currentData ? currentData.user : []} // Set fetched users as the data source
            sticky={true}
            columns={columns}
            showSorterTooltip={false}
            loading={isLoading}
          />
        </Col>
      </Row>

      {/* Add/Edit User Modals */}
      <AddUserModal Show={addUser} setAddUser={setAddUser} refetch={refetch} />
      <EditUserModal
        Show={editUser ? true : false}
        user={editUser ? editUser : null}
        setEditUser={setEditUser}
        refetch={refetch}
      />
    </>
  );
};
