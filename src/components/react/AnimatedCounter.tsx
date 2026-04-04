import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  ref?: React.Ref<HTMLDivElement>;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  prefix = '',
  suffix = '',
  decimals = 0,
  ref,
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    const isFloat = decimals > 0;
    return isFloat
      ? Number(latest.toFixed(decimals))
      : Math.round(latest);
  });

  useEffect(() => {
    const animation = motionValue.animate(value, {
      duration: duration / 1000,
      ease: 'easeOut',
    });

    return () => animation.stop();
  }, [value, motionValue, duration]);

  return (
    <motion.span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}
