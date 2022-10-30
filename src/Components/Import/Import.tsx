import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClass, useOptions, useStudent } from '../helpers/Context';
import { importStudentClick } from '../Options/LehrerOffice/ClassImport';
import { debounce } from 'ts-debounce';

export default function Import() {
  const { all: students, loading: loadS, update, remove } = useStudent();
  const { all: classes, update: updateClass, loading: loadC } = useClass();
  const { options } = useOptions();
  const navigate = useNavigate();
  const { data } = useParams();

  const loading = loadS || loadC;

  const importData = useCallback(
    debounce(async () => {
      if (!data || loading) return;
      let classId = options.classId;
      let studentList = students;

      if (options.multipleClass) {
        classId = classes[classes.length - 1].id + 1;
        await updateClass({
          id: classId,
          active: true,
          name: 'Klasse ' + classId,
        });
        studentList = [];
      }
      await importStudentClick(data, studentList, classId, update, remove);

      navigate('/');
    }, 500),
    [data, loading, students, classes, update, remove, updateClass, navigate]
  );

  useEffect(() => {
    importData().catch((err) => {});
    return importData.cancel;
  }, [importData]);

  return <div className='p-4 text-xl'>Importiere die Klasse ...</div>;
}
