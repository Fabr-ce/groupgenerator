import React, { useState } from 'react';
import { useStudent } from '../../helpers/Context';
import { Modal } from '../../helpers/Modal';
import { StudentType } from '../../helpers/types';
import { renewStudents } from './importHelpters';
import { decode, parseStr } from './minifyObj';

export const importStudentClick = async (
  data: string,
  students: StudentType[],
  update: (item: StudentType) => Promise<void>,
  remove: (id: number) => Promise<void>
) => {
  const decodedStr = decode(data);
  const decodeObj = JSON.parse(decodedStr);
  const resultStudents = parseStr(decodeObj);
  await renewStudents(students, resultStudents, update, remove);
};

export default function ClassImport() {
  const { all: students, update, remove } = useStudent();
  const [open, changeOpen] = useState(false);
  const [data, changeData] = useState('');
  const toggle = () => changeOpen(!open);

  return (
    <div>
      <div
        className='btn'
        onClick={() => {
          toggle();
        }}
      >
        Klasse importieren
      </div>
      <Modal title='Klasse importieren' toggle={toggle} open={open}>
        <form
          className='p-2'
          onSubmit={async (e) => {
            e.preventDefault();
            await importStudentClick(data, students, update, remove);
            changeOpen(false);
          }}
        >
          <input
            className='input mb-2'
            onChange={(e) => changeData(e.target.value)}
          ></input>
          <button type='submit' className='btn btn-primary'>
            Importieren
          </button>
        </form>
      </Modal>
    </div>
  );
}
