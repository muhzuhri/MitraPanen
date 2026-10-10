import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const floatingAnimation = (duration: number = 4, delay: number = 0) => ({
  y: [0, -12, 0],
  transition: {
    duration,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
    delay,
  },
});

export const subtleFloat = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

export const cardHover3D: Variants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};
