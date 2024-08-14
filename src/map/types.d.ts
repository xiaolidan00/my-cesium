export type PosType = {
  lng: number;
  lat: number;
  height: number;
};
export type OrientType = {
  heading: number;
  pitch: number;
  roll: number;
};

export type SizeType = {
  height: number;
  width: number;
  depth: number;
};

export type SizeCylinderType = {
  height: number;
  top: number;
  bottom: number;
};

export type SizeRectType = {
  height: number;
  depth: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};
export type SizePlaneType = {
  height: number;
  width: number;
};

export type PosArrType = [number, number, number];
