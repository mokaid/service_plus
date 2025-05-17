import { type FC, type PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGoogleMap } from "@react-google-maps/api";

type Props = PropsWithChildren<{
  position: google.maps.ControlPosition;
  zIndex?: number;
}>;

export const GoogleMapControl: FC<Props> = ({
  position,
  children,
  zIndex = 0,
}) => {
  const map = useGoogleMap();
  const containerRef = useRef(document.createElement("div"));

  useEffect(() => {
    if (map === null) {
      return;
    }

    const container = containerRef.current;
    const controlsContainer = map.controls[position];

    controlsContainer.push(container);

    return () => {
      let index = -1;

      controlsContainer.forEach((el, i) => {
        if (container === el) {
          index = i;
        }
      });

      if (index !== -1) {
        controlsContainer.removeAt(index);
      }
    };
  }, [map, position]);

  useEffect(() => {
    containerRef.current.style.zIndex = `${zIndex}`;
  }, [zIndex]);

  return createPortal(children, containerRef.current);
};
