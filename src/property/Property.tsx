import * as React from "react";
import classNames from "classnames";
import FontProperty from "./FontProperty";
import ColorProperty from "./ColorProperty";
import { RightCloseIcon, SetIcon } from "../svgIcons";
import BordersProperty from "./BordersProperty";
import ShadowProperty from "./ShadowProperty";
import BlurProperty from "./BlurProperty";
import { useContext, useEffect, useState } from "react";
import { decodeStr } from "../utils/decodeStr";
import Context from "../context";
import { toUnitNB } from "../utils";
export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
  value: string;
};
export type TGradient = {
  from: { x: number; y: number };
  points: any[];
  to: { x: number; y: number };
  type: "linear" | "radial" | "circle" | "diamond";
};
export type Font = {
  content: string;
  size: number;
  spacing: string;
  align: "left" | "right";
  color: Color;
  verticalAlignment: "top" | "middle" | "bottom";
  lineHeight: number;
  family: string;
  style: "Medium";
  paragraphSpacing?: number;
};
type Frame = {
  x: number;
  y: number;
  _x: number;
  _y: number;
  width: number;
  height: number;
  _width: number;
  _height: number;
  rx: number;
  ry: number;
};
type Style = {
  opacity: 1;
  radius: number[];
};
export type Layer = {
  name: string;
  type: string;
  sharedStyle: null;
  font: Font;
  id: 3;
  frame: Frame;
  style: Style;
  idx: 3;
  _rect: {
    x: 210;
    y: 158;
    width: 192;
    height: 32;
    halfWidth: 96;
    halfHeight: 16;
    centerX: 306;
    centerY: 174;
  };
};
interface PropertyProps {
  current: Layer;
  width: number;
  height: number;
  platform: string;
  ratio: number;
  onModalVisibleChange: () => void;
}
const getLayerAttr = (style: any, key: any) =>
  style && style[key] ? style[key] : [];
const Property: React.FC<PropertyProps> = ({
  current,
  platform,
  ratio,
  width,
  height,
  onModalVisibleChange,
}) => {
  const { artSize } = useContext(Context);
  const layerColors = getLayerAttr(current.style, "fills");
  const layerBorders = getLayerAttr(current.style, "borders");
  const layerShadows = getLayerAttr(current.style, "shadows");
  const layerBlurs = getLayerAttr(current.style, "blurs");
  const [visible, setVisible] = useState<boolean>(true);
  const unitResult =
    toUnitNB(width, artSize!) + " x " + toUnitNB(height, artSize!);
  useEffect(() => {
    if (!current) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [current]);
  return (
    <div
      className={classNames("property right rel-property_index", {
        close: !visible || !current,
        open: !(!visible || !current),
      })}
    >
      <div className="page-design-info">
        <div className="left_title">{decodeStr(current.name)}</div>
        <div className="close_icon">
          <button
            className="button-module base_set_icon rel-btn--icon rel-btn--medium"
            data-guide="page-set_project"
            onClick={() => setVisible(false)}
          >
            <RightCloseIcon />
          </button>
        </div>
      </div>
      <div className="page-unit-info">
        <div className="left_title">
          <span title="iOS@1x" className="unit_name overflow-text">
            {platform}
            {platform === "iOS" && (
              <span className="unit_device">@{ratio}x</span>
            )}
          </span>
        </div>
        <div className="right_title">
          <span className="unit_result overflow-text">{unitResult}</span>
          <button
            className="button-module base_set_icon rel-btn--icon rel-btn--medium"
            data-guide="page-set_project"
            onClick={onModalVisibleChange}
          >
            <SetIcon />
          </button>
        </div>
      </div>
      <div className="property-base-wrap rel-property_content">
        <div className="content scrollbar">
          <div className="property-base group">
            <div>
              <div className="l">位置</div>
              <div title="210px" className="r text">
                <span className="text-tip">X</span>
                {toUnitNB(current.frame.x, artSize!)}
              </div>
              <div title="158px" className="r text" style={{ marginLeft: 16 }}>
                <span className="text-tip">Y</span>
                {toUnitNB(current.frame.y, artSize!)}
              </div>
            </div>
            <div>
              <div className="l">大小</div>
              <div title="192px" className="r text">
                <span className="text-tip">宽</span>
                {toUnitNB(current.frame.width, artSize!)}
              </div>
              <div title="32px" className="r text" style={{ marginLeft: 16 }}>
                <span className="text-tip">高</span>
                {toUnitNB(current.frame.height, artSize!)}
              </div>
            </div>
            {current.style?.opacity && (
              <div>
                <div className="l l-opacity">不透明度</div>
                <div className="r text">{current.style.opacity * 100}%</div>
              </div>
            )}

            {current.style?.radius && (
              <div>
                <div className="l ">圆角</div>
                <div className="r text overflow-text">
                  {current.style.radius
                    .map((i) => toUnitNB(i, artSize!))
                    .join(" ")}
                </div>
              </div>
            )}
          </div>
          {(current.style || current.font) && (
            <div>
              <div className="property-title">样式信息</div>
              <div>
                {current.font && <FontProperty font={current.font} />}
                {layerColors.length > 0 && (
                  <ColorProperty layerColors={layerColors} />
                )}
                {layerBorders.length > 0 && (
                  <BordersProperty layerBorders={layerBorders} />
                )}
                {layerShadows.length > 0 && (
                  <ShadowProperty layerShadows={layerShadows} />
                )}
                {layerBlurs.length > 0 && (
                  <BlurProperty layerBlurs={layerBlurs} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;