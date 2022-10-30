import React, { createContext, useContext, useEffect, useState } from 'react';
import IndexedDB from './db';
import { ClassType, ThopicType } from '../types';

const IndexDBContext = createContext<{
  loading: boolean;
  indexDB: IndexedDB;
}>({
  loading: true,
  indexDB: {} as IndexedDB,
});

const groupThemes: ThopicType[] = [
  {
    id: 1,
    name: 'Deutsch',
    active: true,
  },
  {
    id: 2,
    name: 'Mathe',
    active: true,
  },
  {
    id: 3,
    name: 'Sport',
    active: true,
  },
];

const defaultClasses: ClassType[] = [
  {
    id: 1,
    name: 'Klasse 1',
    active: true,
  },
];

export const studentDB = 'studentDB';
export const thopicDB = 'thopicDB';
export const classDB = 'classDB';

const indexDB = new IndexedDB('group generator');

export const AppContextProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, changeLoading] = useState(true);

  useEffect(() => {
    indexDB
      .createObjectStore([studentDB, thopicDB, classDB])
      .then(async (res) => {
        if (res === false) {
          console.error('Not able to load DB');
        } else {
          //insert base
          const thopics = await indexDB.getAllValue(thopicDB);
          if (thopics.length === 0) {
            await indexDB.putBulkValue(thopicDB, groupThemes);
          }

          const classes = await indexDB.getAllValue(classDB);
          if (classes.length === 0) {
            await indexDB.putBulkValue(classDB, defaultClasses);
          }

          //migrate to classes
          const students = await indexDB.getAllValue(studentDB);
          const noClass = students
            .filter((s: any) => !s.classId)
            .map((s: any) => ({ ...s, classId: 1 }));
          if (noClass.length > 0) {
            await indexDB.putBulkValue(studentDB, noClass);
          }

          changeLoading(false);
        }
      });
  }, []);

  return (
    <IndexDBContext.Provider value={{ loading, indexDB }}>
      {children}
    </IndexDBContext.Provider>
  );
};

//Hooks

export const useIndexDBContext = () => {
  return useContext(IndexDBContext);
};

export const useAllItems = <T extends {}>(db: string) => {
  const [load, changeLoading] = useState(true);
  const [data, changeData] = useState<T[]>([]);
  const { loading, indexDB } = useIndexDBContext();

  useEffect(() => {
    if (loading || !indexDB) return;
    changeLoading(true);
    indexDB
      .getAllValue(db)
      .then((data: T[]) => changeData(data))
      .finally(() => changeLoading(false));
  }, [loading, indexDB, db]);

  return { loading: load || loading, data };
};

export const useItem = <T extends {}>(db: string, id: number) => {
  const [load, changeLoading] = useState(true);
  const [data, changeData] = useState<T[]>([]);
  const { loading, indexDB } = useIndexDBContext();

  useEffect(() => {
    changeLoading(true);
    if (loading || !indexDB) return;

    indexDB
      .getValue(db, id)
      .then((res: T[]) => changeData(res))
      .finally(() => changeLoading(false));
  }, [loading, indexDB, db, id]);

  return { loading: load || loading, data };
};

export const useChangeItem = <T extends { id: number }>(
  db: string
): [typeof putData, { loading: boolean; data: T[] }] => {
  const [load, changeLoading] = useState(true);
  const [data, changeData] = useState<T[]>([]);
  const { loading, indexDB } = useIndexDBContext();

  const putData = async (item: T): Promise<T> => {
    if (loading || !indexDB) throw new Error('Not loaded');
    changeLoading(true);
    const data = await indexDB.putValue(db, item);
    changeData((oldData) => [...oldData.filter((d) => d.id !== item.id), data]);
    changeLoading(false);
    return data;
  };

  return [putData, { loading: load || loading, data }];
};

export const useDeleteItem = <T extends { id: number }>(
  db: string
): [typeof deleteData, { loading: boolean; data: T[] }] => {
  const [load, changeLoading] = useState(true);
  const [data, changeData] = useState<T[]>([]);
  const { loading, indexDB } = useIndexDBContext();

  const deleteData = async (id: number) => {
    changeLoading(true);
    await indexDB.deleteValue(db, id);
    changeData((oldData) => oldData.filter((d) => d.id !== id));
    changeLoading(false);
  };

  return [deleteData, { loading: load || loading, data }];
};
