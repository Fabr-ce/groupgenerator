import { useState, createContext, useContext, useEffect } from 'react';
import { useThopic } from './DataContext';
import { GroupType } from './types';

interface Options {
  groupSize: number;
  groupType: GroupType;
  thopicId: number;
}

type OptionsProviderType = {
  options: Options;
  changeOptions: (options: Options) => void;
};

const defaultOptions: Options = {
  groupSize: 3,
  groupType: GroupType.Heterogene,
  thopicId: 1,
};

const OptionsContext = createContext<OptionsProviderType>(
  {} as OptionsProviderType
);

export const OptionsProvider = ({ children }: { children: JSX.Element }) => {
  const [options, changeOptions] = useState<Options>(defaultOptions);

  const { all: thopics } = useThopic();

  useEffect(() => {
    if (thopics.length === 0) return;
    const thopicsIds = thopics.map((t) => t.id);
    if (!thopicsIds.includes(options.thopicId))
      changeOptions((old) => ({ ...old, thopicId: thopicsIds[0] }));
  }, [thopics, options.thopicId]);

  return (
    <OptionsContext.Provider value={{ options, changeOptions }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  return useContext(OptionsContext);
};
