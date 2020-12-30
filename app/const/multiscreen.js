import { Dimensions, Platform, PixelRatio,PlatformStatic,StatusBar } from 'react-native';
import { isIphoneX } from "react-native-iphone-x-helper";

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const { width, height } = Dimensions.get('window');
const SMALL_SCREEN = width < guidelineBaseWidth || height < guidelineBaseHeight;
const BIG_SCREEN = width > guidelineBaseWidth || height > guidelineBaseHeight;
const STANDARD_CREEN = width === guidelineBaseWidth || height === guidelineBaseHeight;
const SCALE = (size) => (width / guidelineBaseWidth) * size;
const VERTICAL_SCALE = (size) => (height / guidelineBaseHeight) * size;
const MODERATE_SCALE = (size, factor = 0.5) =>
  size + (SCALE(size) - size) * factor;
const MODERATE_VERTICAL_SCALE = (size, factor = 0.5) =>
  size + (VERTICAL_SCALE(size) - size) * factor;

//font
const FONT_SCALE = (size) => {
  const scale = width / guidelineBaseWidth;
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const standardLength = width > height ? width : height;
const offset =
  width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight;

const deviceHeight =
  isIphoneX() || Platform.OS === "android"
    ? standardLength - offset
    : standardLength;

export function RFPercentage(percent) {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}

export function RFValue(fontSize, standardScreenHeight = 680) {
  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
}

export {
  SMALL_SCREEN,
  BIG_SCREEN,
  STANDARD_CREEN,
  SCALE,
  VERTICAL_SCALE,
  MODERATE_SCALE,
  MODERATE_VERTICAL_SCALE,
  FONT_SCALE,
};
