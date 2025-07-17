import { Button, Form, Input, message } from "antd";
import datareport from "@/assets/signindatareport.png";
import { Logo } from "@/components/logo";
import styles from "./index.module.css";
import SliderCaptcha from "rc-slider-captcha";
import createPuzzle from "create-puzzle";
import {
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import {
  useGetSingleUserPermissionMutation,
  useLoginMutation,
} from "@/services";
import { setUserCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { Navigate, useLocation } from "react-router-dom";

function SignIn() {
  const token = useAppSelector((state) => state.authState.token);
  const location = useLocation();

  //Login API
  const [loginRequest, { isLoading, data }] = useLoginMutation();

  //Get User Permission Api
  const [
    userPermissionRequest,
    { isLoading: permissionLaoder, data: userPermissionsData },
  ] = useGetSingleUserPermissionMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [formData, setFormData] = useState(null);
  const dispatch = useAppDispatch();
  const [refresh, setRefresh] = useState(false);
  const offsetXRef = useRef(0);
  const actionRef = useRef<any>(null);

  useEffect(() => {
    if (refresh) {
      actionRef.current?.refresh();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!data) return;

    if (data.error) {
      messageApi.open({
        type: "error",
        content: "You have entered wrong credentials",
      });
    } else {
      messageApi.open({
        type: "success",
        content: "You logged in successfully!",
      });
      // const res = userPermissionRequest({
      //   userGuid: data?.user?.userGuid,
      // })
      //   .unwrap()
      //   .then((payload) => {
      //     dispatch(
      //       setUserCredentials({
      //         user: payload?.user,
      //         token: data?.token,
      //       }),
      //     );
      //   });
      dispatch(
        setUserCredentials({
          user: data?.user,
          token: data?.token,
        }),
      );
    }
  }, [data]);

  // const handleLogin = async (formData: any) => {
  //   try {
  //     const loginResponse = await loginRequest(formData);

  //     if (loginResponse?.data?.error === 0) {
  //       messageApi.open({
  //         type: "success",
  //         content: "You logged in successfully!",
  //       });
  //       const userPermissionResponse = await userPermissionRequest({
  //         userGuid: loginResponse?.data?.user?.userGuid,
  //       });

  //       dispatch(
  //         setUserCredentials({
  //           user: userPermissionRequest?.data?.user,
  //           token: loginResponse?.data?.token,
  //         }),
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const xOffset = 5;

  return token ? (
    <Navigate to={"/dashboard"} state={{ from: location }} replace />
  ) : (
    <div className={styles.container}>
      {contextHolder}
      <Form
        onFinish={(data) => {
          setFormData(data);
          setShowPuzzle(true);
        }}
      >
        <div className={styles.bg_img} />
        <div className={styles.login_card_container}>
          <div className={styles.login_card}>
            <Logo className={styles.logo} />
            <img className={styles.img} src={datareport} alt={"Data report"} />
            <div className={styles.input_container}>
              <label style={{ color: "white" }}>Username</label>
              <Form.Item
                name={"userName"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your username",
                  },
                ]}
              >
                <Input
                  placeholder=""
                  style={{ color: "white" }}
                  className={styles.input_bg}
                  suffix={<CloseCircleOutlined style={{ color: "white" }} />}
                />
              </Form.Item>
            </div>
            <div className={styles.input_container}>
              <label style={{ color: "white" }}>Password</label>
              <Form.Item
                name={"password"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your password",
                  },
                ]}
              >
                <Input
                  placeholder=""
                  className={styles.input_bg}
                  type={showPassword ? "text" : "password"}
                  suffix={
                    showPassword ? (
                      <EyeOutlined
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ color: "white" }}
                      />
                    ) : (
                      <EyeInvisibleOutlined
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ color: "white" }}
                      />
                    )
                  }
                />
              </Form.Item>
            </div>

            <Button
              htmlType="submit"
              type="primary"
              loading={isLoading}
              className={styles.primary_btn}
            >
              Login
            </Button>
          </div>
        </div>
      </Form>
      {showPuzzle && (
        <div className={styles.puzzle_overlay}>
          <div className={styles.puzzle_container}>
            <SliderCaptcha
              actionRef={actionRef}
              onVerify={async (data) => {
                if (
                  data.x >= offsetXRef.current - xOffset &&
                  data.x < offsetXRef.current + xOffset
                ) {
                  setShowPuzzle(false);
                  loginRequest(formData);
                  // await handleLogin(formData);
                  return Promise.resolve();
                }

                setRefresh(true);
                messageApi.open({
                  type: "error",
                  content: "Puzzle verification failed. Please try again.",
                });
                return Promise.reject();
              }}
              request={() =>
                createPuzzle(`https://picsum.photos/320/240`).then((res) => {
                  offsetXRef.current = res.x;

                  return {
                    bgUrl: res.bgUrl,
                    puzzleUrl: res.puzzleUrl,
                  };
                })
              }
              mode="embed"
              autoRequest={true}
              tipText={{
                default: "Slide to verify",
                loading: "Loading...",
                moving: "Moving...",
                verifying: "Verifying...",
                success: "Success!",
                error: "Error!",
                errors: "Errors!",
                loadFailed: "Load failed!",
              }}
              autoRefreshOnError={true}
              errorHoldDuration={500}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
