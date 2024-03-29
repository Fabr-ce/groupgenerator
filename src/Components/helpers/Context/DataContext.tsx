import { useState, createContext, useContext, useEffect, useMemo } from 'react';
import {
  classDB,
  studentDB,
  thopicDB,
  useAllItems,
  useChangeItem,
  useDeleteItem,
} from './IndexdbContext';
import { ClassType, StudentType, ThopicType } from '../types';

interface ItemType {
  id: number;
  active: boolean;
}

interface ItemContext<T extends ItemType> {
  all: T[];
  filtered: T[];
  loading: boolean;
  specificLoading: number | false;
  update: (item: T) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const StudentContext = createContext<ItemContext<StudentType>>({
  all: [],
  filtered: [],
  loading: true,
  specificLoading: false,
  update: async () => {},
  remove: async () => {},
});

const ThopicContext = createContext<ItemContext<ThopicType>>({
  all: [],
  filtered: [],
  loading: true,
  specificLoading: false,
  update: async () => {},
  remove: async () => {},
});

const ClassContext = createContext<ItemContext<ClassType>>({
  all: [],
  filtered: [],
  loading: true,
  specificLoading: false,
  update: async () => {},
  remove: async () => {},
});

export const DataProvider = ({ children }: { children: JSX.Element }) => {
  const student = useItems<StudentType>(studentDB);
  const thopic = useItems<ThopicType>(thopicDB);
  const classe = useItems<ClassType>(classDB);

  return (
    <ClassContext.Provider value={classe}>
      <StudentContext.Provider value={student}>
        <ThopicContext.Provider value={thopic}>
          {children}
        </ThopicContext.Provider>
      </StudentContext.Provider>
    </ClassContext.Provider>
  );
};

const useItems = <T extends ItemType>(db: string) => {
  const { data: pureItems, loading } = useAllItems<T>(db);
  const [pureUpdateItem] = useChangeItem<T>(db);
  const [pureDeleteItem] = useDeleteItem<T>(db);

  //perform lazy update
  const [specificLoading, changeSpecific] =
    useState<ItemContext<T>['specificLoading']>(false);
  const [items, changeItems] = useState(pureItems);

  useEffect(() => {
    changeItems(pureItems);
  }, [pureItems]);

  const updateItem = (item: T) => {
    changeItems((oldItems) => {
      const newItems = [...oldItems];
      const currentInd = newItems.findIndex((it) => it.id === item.id);
      if (currentInd > -1) {
        newItems[currentInd] = item;
      } else {
        newItems.push(item);
      }
      return newItems;
    });
  };

  const update = async (item: T) => {
    changeSpecific(item.id);
    await pureUpdateItem(item);
    updateItem(item);
    changeSpecific(false);
  };

  const remove = async (id: number) => {
    changeSpecific(id);
    await pureDeleteItem(id);
    changeItems((oldItems) => oldItems.filter((item) => item.id !== id));
    changeSpecific(false);
  };

  const filtered = items.filter((item) => item.active);

  return { all: items, filtered, loading, specificLoading, update, remove };
};

export const useStudent = () => {
  return useContext(StudentContext);
};

export const useClassStudent = (classId?: number) => {
  const { all: oldAll, filtered: oldFiltered, ...rest } = useStudent();
  const all = useMemo(
    () => oldAll.filter((s) => !classId || s.classId === classId),
    [oldAll, classId]
  );
  const filtered = useMemo(
    () => oldFiltered.filter((s) => !classId || s.classId === classId),
    [oldFiltered, classId]
  );
  return { all, filtered, ...rest };
};

export const useThopic = () => {
  return useContext(ThopicContext);
};

export const useClass = () => {
  return useContext(ClassContext);
};
