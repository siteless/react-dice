import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  CSSProperties,
} from 'react';

const initialContextValue = {
  registerDie: ({
    handleRoll,
  }: {
    handleRoll: () => Promise<number | undefined>;
  }) => ({
    unregister: () => {},
  }),
  disabled: undefined as boolean | undefined,
};

export const DiceGroupContext = createContext<
  null | typeof initialContextValue
>(null);

const defaultStyle = {
  display: 'flex',
  gap: '10px',
};

export const DiceGroup = ({
  onChange,
  children,
  className,
  style = defaultStyle,
  disabled,
}: {
  onChange: (values: number[]) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}) => {
  const [registeredDice, setRegisteredDice] = useState<
    {
      handleRoll: () => any;
    }[]
  >([]);

  const registerDie = useCallback(
    ({ handleRoll }: { handleRoll: () => any }) => {
      const die = {
        handleRoll,
      };
      setRegisteredDice(last => [...last, die]);

      return {
        unregister: () => {
          setRegisteredDice(last => last.filter(d => d !== die));
        },
      };
    },
    [setRegisteredDice],
  );
  const [isRolling, setIsRolling] = useState(false);

  const handleRollGroup = async () => {
    if (isRolling || disabled) return;
    setIsRolling(true);
    const values = await Promise.all(
      registeredDice.map(die => {
        return die.handleRoll();
      }),
    );

    onChange?.(values);

    setIsRolling(false);
  };

  const contextValue = useMemo(
    () => ({
      registerDie,
      disabled,
    }),
    [registerDie, disabled],
  );

  return (
    <DiceGroupContext.Provider value={contextValue}>
      <div style={style} className={className} onClick={handleRollGroup}>
        {children}
      </div>
    </DiceGroupContext.Provider>
  );
};
