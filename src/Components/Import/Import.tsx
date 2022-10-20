import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudent } from '../helpers/Context';
import { importStudentClick } from '../Options/LehrerOffice/ClassImport';
import { debounce } from 'ts-debounce';

export default function Import() {
  const { all: stundents, loading, update, remove } = useStudent();
  const navigate = useNavigate();
  const { data } = useParams();

  const importData = useCallback(
    debounce(async () => {
      if (!data || loading) return;
      return importStudentClick(data, stundents, update, remove).then(() =>
        navigate('/')
      );
    }, 500),
    [data, loading, stundents, update, remove, navigate]
  );

  useEffect(() => {
    importData().catch((err) => {});
    return importData.cancel;
  }, [importData]);

  return <div className='p-4 text-xl'>Importiere die Klasse ...</div>;
}
