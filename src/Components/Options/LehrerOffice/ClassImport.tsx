import classNames from 'classnames';
import React, { useState } from 'react';
import { useClass, useClassStudent, useOptions } from '../../helpers/Context';
import { Modal } from '../../helpers/Modal';
import { StudentType } from '../../helpers/types';
import { renewStudents } from './importHelpters';
import { decode, parseStr } from './minifyObj';

export const importStudentClick = async (
  data: string,
  students: StudentType[],
  classId: number,
  update: (item: StudentType) => Promise<void>,
  remove: (id: number) => Promise<void>
) => {
  let resultStudents = [];
  try {
    const decodedStr = decode(data);
    const decodeObj = JSON.parse(decodedStr);
    resultStudents = parseStr(decodeObj);
  } catch (err) {
    throw new Error(
      'Fehler beim Laden der Daten. Kopiere deine Klasse bitte nochmals.'
    );
  }

  await renewStudents(students, resultStudents, classId, update, remove);
};

export default function ClassImport({
  name,
  className,
  classId,
}: {
  name?: string;
  className?: string;
  classId?: number;
}) {
  const { all: students, update, remove } = useClassStudent(classId);
  const { all: classes, update: updateClass } = useClass();
  const { options } = useOptions();

  const [open, changeOpen] = useState(false);
  const [success, changeSuccess] = useState(false);
  const [error, changeError] = useState('');
  const [data, changeData] = useState('');
  const toggle = () => {
    changeOpen(!open);
    changeSuccess(false);
    changeError('');
  };

  return (
    <div>
      <div
        className={classNames('btn', className)}
        onClick={() => {
          toggle();
        }}
      >
        {name ? name : 'Klasse importieren'}
      </div>
      <Modal title='Klasse importieren' toggle={toggle} open={open}>
        {success ? (
          <>
            <div className='alert alert-success mb-2'>
              Deine Klasse wurde erfolgreich importiert
            </div>
            <button className='btn btn-primary' onClick={toggle}>
              Schliessen
            </button>
          </>
        ) : (
          <form
            className='p-2'
            onSubmit={async (e) => {
              try {
                e.preventDefault();
                classId = classId || options.classId;
                let studentList = students;

                if (options.multipleClass && !classId) {
                  classId = classes[classes.length - 1].id + 1;
                  await updateClass({
                    id: classId,
                    active: true,
                    name: 'Klasse ' + classId,
                  });
                  studentList = [];
                }
                await importStudentClick(
                  data,
                  studentList,
                  classId,
                  update,
                  remove
                );

                changeSuccess(true);
              } catch (err: any) {
                changeError(err.message);
              }
            }}
          >
            {error && <div className='alert alert-error mb-2'>{error}</div>}
            <div className='alert alert-info mb-2'>
              Wenn die eine Klasse kopiert hast (z.B auf IOS Geräten), kannst du
              sie in das Textfeld einfügen.
            </div>
            <input
              autoFocus
              className='input mb-2 w-full'
              onChange={(e) => changeData(e.target.value)}
            ></input>
            <button type='submit' className='btn btn-primary'>
              Importieren
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
