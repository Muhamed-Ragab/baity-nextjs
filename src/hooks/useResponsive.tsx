'use client';

import { configResponsive, useResponsive as useResponsiveHook } from 'ahooks';

type ResponsiveKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type Responsive = Record<ResponsiveKeys, boolean>;

configResponsive({
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
});

export const useResponsive = (): Responsive => {
  const responsive = useResponsiveHook();

  return responsive as Responsive;
};
