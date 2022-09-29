import { useState, createContext, useContext, useEffect } from 'react';
import { useThopic } from './DataContext';
import { GroupSelection, GroupType } from './types';

export interface Options {
  groupSize: number;
  groupNumber: number;
  groupType: GroupType;
  thopicId: number;
  groupSelection: GroupSelection;
}

type OptionsProviderType = {
  options: Options;
  changeOptions: (options: Options) => void;
};

const defaultOptions: Options = {
  groupSize: 3,
  groupNumber: 3,
  groupType: GroupType.Heterogene,
  thopicId: 1,
  groupSelection: GroupSelection.GroupSize,
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
