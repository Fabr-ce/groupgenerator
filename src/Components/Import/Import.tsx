import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudent } from '../helpers/Context';
import { importStudentClick } from '../Options/LehrerOffice/ClassImport';
import { debounce } from 'ts-debounce';

export default function Import() {
  const { all: stundents, loading, update, remove } = useStudent();
  const navigate = useNavigate();
  const { data } = useParams();

  const importFunc = async () => {
    if (!data || loading) return;
    return importStudentClick(data, stundents, update, remove).then((res) =>
      navigate('/')
    );
  };

  const importData = debounce(importFunc, 500);

  useEffect(() => {
    importData().catch((err) => {});
    return importData.cancel;
  }, [data, loading, stundents, update, remove, navigate]);

  return <div className='p-4 text-xl'>Importiere die Klasse ...</div>;
}
