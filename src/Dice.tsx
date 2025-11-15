import React, {
  CSSProperties,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DiceGroupContext } from './DiceGroup';

const animationContrastKeyframesName =
  'scriptlessReactDiceAnimationContrastKeyframes';
const animationBlurKeyframesName = 'scriptlessReactDiceAnimationBlurKeyframes';
const animationScaleKeyframesName =
  'scriptlessReactDiceAnimationScaleKeyframes';

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

const pips = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

export type PipsType = (typeof pips)[number];

export type DicePropType = {
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  backgroundColor?: string;
  pipColor?: string;
  size?: number;
  pipSize?: number;

  initialValue?: number;
  onChange?: (value?: number) => void;
  getNextValue?: (() => number) | (() => Promise<number>);

  disabled?: boolean;
};

const dicePoseTransitions: Record<
  DiceValue,
  Record<DiceValue, Partial<Record<PipsType, PipsType | PipsType[]>>>
> = {
  '1': {
    '1': {
      a: 'a',
    },
    '2': {
      a: ['a', 'b'],
    },
    '3': {
      a: ['a', 'b', 'c'],
    },
    '4': {
      a: ['a', 'b', 'c', 'd'],
    },
    '5': {
      a: ['a', 'b', 'c', 'd', 'e'],
    },
    '6': {
      a: ['a', 'b', 'c', 'd', 'e', 'f'],
    },
  },
  '2': {
    '1': {
      a: 'a',
      b: 'a',
    },
    '2': {
      a: 'b',
      b: 'a',
    },
    '3': {
      a: 'c',
      b: ['a', 'b'],
    },
    '4': {
      a: ['b', 'c'],
      b: ['a', 'd'],
    },
    '5': {
      a: ['c', 'd'],
      b: ['a', 'b', 'e'],
    },
    '6': {
      a: ['d', 'e', 'f'],
      b: ['a', 'b', 'c'],
    },
  },
  '3': {
    '1': {
      a: 'a',
      b: 'a',
      c: 'a',
    },
    '2': {
      a: 'b',
      b: 'b',
      c: 'a',
    },
    '3': {
      a: 'c',
      b: 'b',
      c: 'a',
    },
    '4': {
      a: 'd',
      b: 'c',
      c: ['a', 'b'],
    },
    '5': {
      a: ['c', 'e'],
      b: 'd',
      c: ['a', 'b'],
    },
    '6': {
      a: ['c', 'e'],
      b: 'd',
      c: ['a', 'b', 'f'],
    },
  },
  '4': {
    '1': {
      a: 'a',
      b: 'a',
      c: 'a',
      d: 'a',
    },
    '2': {
      a: 'a',
      b: 'b',
      c: 'b',
      d: 'a',
    },
    '3': {
      a: 'c',
      b: 'b',
      c: 'a',
      d: 'a',
    },
    '4': {
      a: 'd',
      b: 'c',
      c: 'b',
      d: 'a',
    },
    '5': {
      a: ['d', 'e'],
      b: 'c',
      c: 'b',
      d: 'a',
    },
    '6': {
      a: ['d', 'e', 'f'],
      b: 'c',
      c: 'b',
      d: 'a',
    },
  },
  '5': {
    '1': {
      a: 'a',
      b: 'a',
      c: 'a',
      d: 'a',
      e: 'a',
    },
    '2': {
      a: 'b',
      b: 'a',
      c: 'a',
      d: 'a',
      e: 'a',
    },
    '3': {
      a: 'c',
      b: 'b',
      c: 'a',
      d: 'a',
      e: 'a',
    },
    '4': {
      a: 'd',
      b: 'c',
      c: 'b',
      d: 'a',
      e: 'a',
    },
    '5': {
      a: 'e',
      b: 'd',
      c: 'c',
      d: 'b',
      e: 'a',
    },
    '6': {
      a: 'f',
      b: 'e',
      c: 'd',
      d: 'c',
      e: ['a', 'b'],
    },
  },
  '6': {
    '1': {
      a: 'a',
      b: 'a',
      c: 'a',
      d: 'a',
      e: 'a',
      f: 'a',
    },
    '2': {
      a: 'b',
      b: 'a',
      c: 'a',
      d: 'b',
      e: 'b',
      f: 'a',
    },
    '3': {
      a: 'c',
      b: 'b',
      c: 'a',
      d: 'c',
      e: 'b',
      f: 'a',
    },
    '4': {
      a: 'd',
      b: 'c',
      c: 'b',
      d: 'a',
      e: 'b',
      f: 'd',
    },
    '5': {
      a: 'e',
      b: 'd',
      c: 'c',
      d: 'b',
      e: 'a',
      f: 'a',
    },
    '6': {
      a: 'f',
      b: 'e',
      c: 'd',
      d: 'c',
      e: 'b',
      f: 'a',
    },
  },
};

type PositionType = {
  x: number;
  y: number;
};

type DicePosesType = {
  [K in DiceValue]: {
    [P in PipsType]?: PositionType;
  };
};

const dicePoses: DicePosesType = {
  '1': {
    a: {
      x: 0.5,
      y: 0.5,
    },
  },
  '2': {
    a: {
      x: 0.3,
      y: 0.3,
    },
    b: {
      x: 0.7,
      y: 0.7,
    },
  },
  '3': {
    a: {
      x: 0.25,
      y: 0.25,
    },
    b: {
      x: 0.5,
      y: 0.5,
    },
    c: {
      x: 0.75,
      y: 0.75,
    },
  },
  '4': {
    a: {
      x: 0.25,
      y: 0.25,
    },
    b: {
      x: 0.75,
      y: 0.25,
    },
    c: {
      x: 0.25,
      y: 0.75,
    },
    d: {
      x: 0.75,
      y: 0.75,
    },
  },
  '5': {
    a: {
      x: 0.25,
      y: 0.25,
    },
    b: {
      x: 0.75,
      y: 0.25,
    },
    c: {
      x: 0.25,
      y: 0.75,
    },
    d: {
      x: 0.75,
      y: 0.75,
    },
    e: {
      x: 0.5,
      y: 0.5,
    },
  },
  '6': {
    a: {
      x: 0.25,
      y: 0.25,
    },
    b: {
      x: 0.75,
      y: 0.25,
    },
    c: {
      x: 0.25,
      y: 0.75,
    },
    d: {
      x: 0.75,
      y: 0.75,
    },
    e: {
      x: 0.25,
      y: 0.5,
    },
    f: {
      x: 0.75,
      y: 0.5,
    },
  },
};

const numberToDiceValue = (value: number) => {
  if (value < 1) return 1;
  if (value > 6) return 6;
  return value as DiceValue;
};

const defaultDiceSize = 66;
const defaultPipSize = 12;

const pipAnimationDuration = 240;
const pipTailAnimationDelay = Math.round(pipAnimationDuration / 6);

const anumationDurationBuffer = 2;
const totalAnimationDuration = pipAnimationDuration + pipTailAnimationDelay;

const createAndReArrangePips = (
  last: {
    animate: boolean;
    value?: DiceValue;
    pose: DicePosesType[DiceValue];
  },
  value?: DiceValue,
) => {
  if (!value || !last.value) return {};

  const transition = dicePoseTransitions[last.value][value];
  let transitionPose: DicePosesType[DiceValue] = {};

  for (const key of pips) {
    const pipTransition = transition[key];
    if (!pipTransition) continue;

    if (Array.isArray(pipTransition)) {
      pipTransition.forEach((splitToKey) => {
        transitionPose[splitToKey] = last.pose[key];
      });
    } else {
      transitionPose[pipTransition] = last.pose[key];
    }
  }

  return transitionPose;
};

const consolidateAndReArrangePips = (
  last: {
    animate: boolean;
    value?: DiceValue;
    pose: DicePosesType[DiceValue];
  },
  value?: DiceValue,
) => {
  if (!value || !last.value) return {};

  const finalPose = dicePoses[value];

  const transition = dicePoseTransitions[last.value][value];
  let transitionPose: DicePosesType[DiceValue] = {};

  for (const key of Object.keys(last.pose) as PipsType[]) {
    const pipTransition = transition[key];

    if (!pipTransition) continue;

    if (typeof pipTransition === 'string') {
      transitionPose[key] = finalPose[pipTransition];
    }
  }

  return transitionPose;
};

const defaultGetNextValue = () =>
  (Math.floor(Math.random() * 6) + 1) as DiceValue;

const getRollValues = ({
  startValue,
  endValue,
}: {
  startValue: DiceValue;
  endValue: DiceValue;
}): DiceValue[] => {
  const rollCount = Math.floor(Math.random() * 3) + 5; // 4 to 6 rolls
  const rolls: DiceValue[] = [startValue];

  // Generate rolls, ensuring each is different from the previous
  while (rolls.length < rollCount - 1) {
    let newRoll: DiceValue;
    do {
      newRoll = (Math.floor(Math.random() * 6) + 1) as DiceValue;
    } while (newRoll === rolls[rolls.length - 1]);

    rolls.push(newRoll);
  }

  // Handle the case where startValue and endValue are the same
  if (startValue === endValue && rolls.length > 1) {
    // Ensure at least one roll is different
    let differentRoll: DiceValue;
    do {
      differentRoll = (Math.floor(Math.random() * 6) + 1) as DiceValue;
    } while (differentRoll === startValue);
    rolls.splice(1, 0, differentRoll);
  }

  // Ensure the second-to-last roll is different from endValue
  if (rolls[rolls.length - 1] === endValue) {
    let differentRoll: DiceValue;
    do {
      differentRoll = (Math.floor(Math.random() * 6) + 1) as DiceValue;
    } while (differentRoll === endValue);
    rolls.push(differentRoll);
  }

  // Add the endValue as the last roll
  rolls.push(endValue);

  return rolls;
};

export const Dice = ({
  initialValue,
  disabled: propsDisabled,
  onChange,
  getNextValue = defaultGetNextValue,

  size: contentSize = defaultDiceSize,
  pipSize = defaultPipSize,

  borderColor = 'black',
  borderRadius = 8,
  borderWidth = 3,
  backgroundColor = 'white',
  pipColor = 'black',
}: DicePropType) => {
  const size = contentSize - (borderWidth || 0) * 2;

  const diceGroupContextValue = useContext(DiceGroupContext);
  const isManagedByDiceGroup = Boolean(diceGroupContextValue);

  const disabled = propsDisabled || diceGroupContextValue?.disabled;

  const [value, setValue] = useState<DiceValue>(
    typeof initialValue === 'number' ? numberToDiceValue(initialValue) : 1,
  );

  const [rolling, setRolling] = useState(false);

  const [renderPose, setRenderPose] = useState<{
    animate: boolean;
    value?: DiceValue;
    pose: DicePosesType[DiceValue];
  }>({
    animate: false,
    value: undefined,
    pose: {},
  });

  const [animateValuesQueue, setAnimateValuesQueue] = useState<
    (DiceValue | undefined)[]
  >(() =>
    typeof initialValue === 'number' ? [numberToDiceValue(initialValue)] : [],
  );

  const isRunningRef = useRef(false);

  useEffect(() => {
    if (isRunningRef.current || !animateValuesQueue.length) return;

    setRolling(true);
    isRunningRef.current = true;
    const value = animateValuesQueue[0];
    const finalPose = value ? dicePoses[value] : {};

    const animationSequence = async () => {
      // 1: create and re arrange pips if needed

      setRenderPose((last) => {
        const isReduction = (value || 0) < (last.value || value || 0);

        if (isReduction) return last;

        return {
          animate: false,
          pose: createAndReArrangePips(last, value),
          value: last.value,
        };
      });

      await new Promise((resolve) => requestAnimationFrame(resolve));

      // 2: animate pips to position
      setRenderPose((last) => {
        const isReduction = (value || 0) < (last.value || value || 0);

        if (isReduction)
          return {
            animate: true,
            pose: consolidateAndReArrangePips(last, value),
            value,
          };

        return {
          animate: true,
          pose: finalPose,
          value,
        };
      });

      await new Promise((resolve) =>
        setTimeout(resolve, totalAnimationDuration + anumationDurationBuffer),
      );

      await new Promise((resolve) => requestAnimationFrame(resolve));

      // 3: delete and re arrange pips if needed
      setRenderPose({
        animate: false,
        pose: finalPose,
        value,
      });

      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Clean up after animation
      isRunningRef.current = false;
      setRolling(false);
      setAnimateValuesQueue((last) => last.slice(1));

      if (animateValuesQueue.length === 1) {
        onChange?.(value);
        setValue(value!);
      }
    };

    animationSequence();
  }, [animateValuesQueue]);

  const getPipStyle = ({
    pipPose,
    scale = 1,
  }: {
    pipPose: PositionType;
    scale?: number;
  }) => ({
    borderRadius: '50%',
    position: 'absolute' as CSSProperties['position'],
    backgroundColor: pipColor,
    height: pipSize * scale,
    width: pipSize * scale,
    top: pipPose.y * size - (pipSize * scale) / 2,
    left: pipPose.x * size - (pipSize * scale) / 2,
  });

  const handleRoll = useCallback(async () => {
    if (disabled || rolling) return;

    let newValue = getNextValue();
    if (newValue instanceof Promise) newValue = await newValue;

    if (typeof newValue === 'number') {
      const newValueAsDiceValue = numberToDiceValue(newValue);

      const animateValues = getRollValues({
        startValue: value,
        endValue: newValueAsDiceValue,
      });
      setAnimateValuesQueue(animateValues);

      await new Promise((resolve) =>
        setTimeout(resolve, totalAnimationDuration * animateValues.length),
      );

      return newValueAsDiceValue;
    }
  }, [disabled, getNextValue, isManagedByDiceGroup, rolling, value]);

  useEffect(() => {
    if (!diceGroupContextValue?.registerDie) return;
    const { unregister } = diceGroupContextValue.registerDie({
      handleRoll,
    });

    return () => {
      unregister();
    };
  }, [diceGroupContextValue?.registerDie, handleRoll]);

  return (
    <>
      <div
        style={{
          height: size,
          width: size,
          cursor: disabled || rolling ? 'default' : 'pointer',
          display: 'inline-block',
          position: 'relative',
          overflow: 'hidden',
          borderColor,
          borderRadius,
          borderWidth,
          backgroundColor,
          borderStyle: 'solid',
          boxSizing: 'content-box',
        }}
        onClick={isManagedByDiceGroup ? undefined : handleRoll}
      >
        <div
          style={{
            animationDuration: totalAnimationDuration + 'ms',
            animationFillMode: 'forwards',
            animationName: renderPose.animate
              ? animationContrastKeyframesName
              : undefined,

            position: 'relative',
            backgroundColor,
          }}
        >
          <div
            style={{
              animationDuration: totalAnimationDuration + 'ms',
              animationFillMode: 'forwards',
              animationName: renderPose.animate
                ? animationBlurKeyframesName
                : undefined,

              position: 'relative',
              backgroundColor,
              height: size,
              width: size,
            }}
          >
            {pips.map((key) => {
              const pipPose = renderPose.pose[key];
              if (!pipPose)
                return (
                  <Fragment key={key}>
                    <div>
                      <div></div>
                    </div>
                  </Fragment>
                );

              const pipStyle = getPipStyle({ pipPose });
              return (
                <Fragment key={key}>
                  <div
                    style={{
                      ...pipStyle,
                      transition: renderPose.animate
                        ? `top ${pipAnimationDuration}ms ease, left ${pipAnimationDuration}ms ease`
                        : '',
                    }}
                  >
                    <div
                      style={{
                        borderRadius: '50%',
                        height: '100%',
                        width: '100%',
                        animationName: renderPose.animate
                          ? animationScaleKeyframesName
                          : undefined,
                        animationDuration: totalAnimationDuration + 'ms',
                        animationFillMode: 'forwards',
                        backgroundColor: pipColor,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      ...getPipStyle({ pipPose, scale: 0.8 }),
                      transition: renderPose.animate
                        ? `top ${pipAnimationDuration}ms ease ${pipTailAnimationDelay}ms, left ${pipAnimationDuration}ms ease ${pipTailAnimationDelay}ms`
                        : '',
                    }}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

