import { useState, createContext, useContext, useEffect } from 'react';
import { useClass, useThopic } from './DataContext';
import { GroupSelection, GroupType } from '../types';

export interface Options {
  groupSize: number;
  groupNumber: number;
  groupType: GroupType;
  thopicId: number;
  groupSelection: GroupSelection;
  multipleClass: boolean;
  classId: number;
}

type OptionsProviderType = {
  options: Options;
  changeOption: (name: string, value: any) => void;
};

const defaultOptions: Options = {
  groupSize: 3,
  groupNumber: 3,
  groupType: GroupType.Heterogene,
  thopicId: 1,
  groupSelection: GroupSelection.GroupSize,

  multipleClass: false,
  classId: 1,
};

const OptionsContext = createContext<OptionsProviderType>(
  {} as OptionsProviderType
);

export const OptionsProvider = ({ children }: { children: JSX.Element }) => {
  const [options, changeOptions] = useState<Options>(defaultOptions);

  const changeOption = (name: string, value: any) => {
    if (!Object.keys(defaultOptions).includes(name)) return;
    if (name === 'multipleClass') value = value ? 1 : 0;
    localStorage.setItem(name, value);
    changeOptions((old) => ({ ...old, [name]: value }));
  };

  const { all: thopics } = useThopic();
  const { all: classes } = useClass();

  useEffect(() => {
    for (const key in defaultOptions) {
      const val = parseInt(localStorage.getItem(key) || '');
      if (val) {
        changeOptions((old) => ({ ...old, [key]: val }));
      }
    }
  }, []);

  useEffect(() => {
    if (thopics.length === 0) return;
    const thopicsIds = thopics.map((t) => t.id);
    if (!thopicsIds.includes(options.thopicId))
      changeOption('thopicId', thopicsIds[0]);
  }, [thopics, options.thopicId]);

  useEffect(() => {
    if (classes.length === 0) return;
    const classIds = classes.map((t) => t.id);
    if (!classIds.includes(options.classId))
      changeOption('classId', classIds[0]);
  }, [classes, options.classId]);

  return (
    <OptionsContext.Provider value={{ options, changeOption }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  return useContext(OptionsContext);
};
