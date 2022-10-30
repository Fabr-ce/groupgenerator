import React, { useMemo, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import { ThopicType } from '../helpers/types';
import { Link } from 'react-router-dom';
import { Student } from './Student';
import { EditModal } from '../helpers/Modal';
import { Loading } from '../helpers/Loading';
import {
  useClass,
  useClassStudent,
  useThopic,
} from '../helpers/Context/DataContext';
import { BsPersonPlusFill } from 'react-icons/bs';
import { useOptions } from '../helpers/Context';

export default function Students() {
  const { filtered: thopics, loading: loadT } = useThopic();
  const { filtered: classes, loading: loadC } = useClass();
  const { options, changeOption } = useOptions();

  const {
    all: students,
    update: updateStudent,
    loading: loadS,
  } = useClassStudent(options.classId);

  const [selectedThopic, changeThopic] = useState<ThopicType['id'] | null>(
    null
  );

  const [newStudent, changeNew] = useState({ modal: false, name: '' });

  const activeCount = useMemo(
    () => students.filter((s) => s.active).length,
    [students]
  );

  return (
    <div className='p-3 mt-5 pb-10'>
      <div className='mb-5 flex items-center max-w-xs mx-auto'>
        <Link to='/'>
          <MdOutlineArrowBack size='2.5em' />
        </Link>{' '}
        <h2 className='text-2xl font-bold text-center pl-4'>
          Klasse bearbeiten
        </h2>
      </div>

      {loadS || loadT || loadC ? (
        <Loading />
      ) : (
        <div className='max-w-xs mx-auto'>
          {options.multipleClass && classes.length > 1 && (
            <select
              className='select select-bordered w-full mb-5'
              value={options.classId}
              onChange={(e) =>
                changeOption('classId', parseInt(e.target.value))
              }
            >
              {classes.map((cla) => (
                <option key={cla.id} value={cla.id}>
                  {cla.name}
                </option>
              ))}
            </select>
          )}
          <div className='font-bold text-lg pb-3'>
            {activeCount}/{students.length} Schüler/innen anwesend
          </div>
          {students.length > 0 && (
            <div className='form-control mb-3'>
              <select
                className='select select-bordered w-full'
                value={selectedThopic || ''}
                onChange={(e) => changeThopic(parseInt(e.target.value) || null)}
              >
                <option value=''>Alle Themen</option>
                {thopics.map((thopic) => (
                  <option key={thopic.id} value={thopic.id}>
                    {thopic.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {students.map((p) => (
            <Student
              {...p}
              key={p.id}
              selectedThopic={selectedThopic}
              thopics={thopics}
            />
          ))}
          <div
            className='btn btn-block text-lg'
            onClick={() => changeNew({ name: '', modal: true })}
          >
            <BsPersonPlusFill size='1.5em' />
          </div>
          <EditModal
            title='Schüler hinzufügen'
            changeName={(s) => changeNew((old) => ({ ...old, name: s }))}
            name={newStudent.name}
            open={newStudent.modal}
            toggle={() => {
              changeNew({ name: '', modal: false });
            }}
            submit={() => {
              if (newStudent.name.trim() === '') return;
              updateStudent({
                id: students[students.length - 1]?.id + 1 || 1,
                name: newStudent.name,
                classId: options.classId,
                active: true,
                skills: {},
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
