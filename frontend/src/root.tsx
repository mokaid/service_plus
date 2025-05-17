import {
  type FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import {
  px2remTransformer,
  StyleProvider,
  type Transformer,
} from "@ant-design/cssinjs";
import { App, ConfigProvider, theme, type ThemeConfig } from "antd";
import Cookies from "js-cookie";

import { DEFAULT_APP_THEME } from "./const/app";
import { APP_THEME_COOKIE } from "./const/cookies";
import { router } from "./routes/router";
import { store } from "./store/store";
import { ThemeContext, type ThemeContextType } from "./theme";

import "antd/dist/reset.css";
import "./styles/global.css";

const styleTransformers: Transformer[] = [px2remTransformer({ rootValue: 16 })];

const initialAppTheme =
  (Cookies.get(APP_THEME_COOKIE) as ThemeContextType["appTheme"]) ||
  DEFAULT_APP_THEME;

export const Root: FC = () => {
  const [appTheme, setAppTheme] = useState(initialAppTheme);
  const themeAlgorithm = useMemo(
    () => (appTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm),
    [appTheme],
  );

  const toggleAppTheme = useCallback(() => {
    setAppTheme((prevAppTheme) => {
      const nextAppTheme = prevAppTheme === "light" ? "dark" : "light";

      Cookies.set(APP_THEME_COOKIE, nextAppTheme, {
        expires: 365,
      });

      return nextAppTheme;
    });
  }, []);

  const themeContext = useMemo<ThemeContextType>(
    () => ({ appTheme, toggleAppTheme }),
    [appTheme, toggleAppTheme],
  );

  const themeConfig = useMemo<ThemeConfig>(
    () => ({
      algorithm: themeAlgorithm,
      token: {
        borderRadius: 30,
        fontWeightStrong: 500,
        fontFamily:
          "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      },
      components: {
        Typography: {
          titleMarginBottom: 0,
          titleMarginTop: 0,
        },
      },
    }),
    [themeAlgorithm],
  );

  useLayoutEffect(() => {
    const metaTag = document.querySelector("meta[name=color-scheme]")!;

    metaTag.setAttribute("content", appTheme);
    document.documentElement.style.setProperty("--color-scheme", appTheme);
  }, [appTheme]);

  return (
    <ThemeContext.Provider value={themeContext}>
      <StyleProvider transformers={styleTransformers}>
        <ConfigProvider theme={themeConfig}>
          <Provider store={store}>
            <App>
              <RouterProvider router={router} />
            </App>
          </Provider>
        </ConfigProvider>
      </StyleProvider>
    </ThemeContext.Provider>
  );
};
