import { useReducedMotion } from "framer-motion";

// One timing curve for the whole site. Every surface that animates reads from
// here, so an entrance on /fit reads like an entrance on the home page. Motions
// that are deliberately different (a spring on a modal, a hover lift) say so at
// their call site rather than quietly inventing a fourth easing.
// Typed as a 4-tuple rather than number[]: framer-motion's cubic-bezier easing wants
// exactly four stops, and a widened array fails the type check at every call site.
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// The durations are near-identical on purpose: anything past about half a second
// stops reading as a response and starts reading as a wait.
export const DURATION = 0.45;
export const HOVER = { duration: 0.2, ease: EASE };

const step = index => Math.min(Math.max(index, 0), 8) * 0.055;

export function enter(index = 0) {
  return { duration: DURATION, delay: step(index), ease: EASE };
}

export const rise = { opacity: 0, y: 18, filter: "blur(6px)" };
export const settled = { opacity: 1, y: 0, filter: "blur(0px)" };

// Hover transitions are omitted entirely under reduced motion rather than set to
// duration 0: passing `undefined` to whileHover is what actually disables it.
export function hover(reduce: boolean) {
  return reduce ? undefined : HOVER;
}

// Motion is a state transition, not decoration: it shows that values arrived and
// which sources were chosen. Under reduced motion every variant collapses to an
// instant, fully-visible element.
export function useStage() {
  const reduce = useReducedMotion();
  return {
    reduce,
    rise: () => (reduce ? settled : rise),
    settle: settled,
    transition: (index = 0) => (reduce ? { duration: 0 } : enter(index)),
  };
}
