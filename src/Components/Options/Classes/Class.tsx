import classnames from 'classnames';
import React, { useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';
import { useClass, useClassStudent } from '../../helpers/Context';
import { DeleteModal, EditModal } from '../../helpers/Modal';
import { ClassType } from '../../helpers/types';
import ClassExport from '../LehrerOffice/ClassExport';
import ClassImport from '../LehrerOffice/ClassImport';
import { clearStudents } from '../LehrerOffice/importHelpters';

export default function Class({ id, name, active }: ClassType) {
  const [showContent, changeContent] = useState(false);
  const [showEdit, changeEdit] = useState(false);
  const [showDelete, changeDelete] = useState(false);

  const [editName, changeName] = useState(name);

  const { all: classes, update: changeClass, remove: deleteClass } = useClass();
  const { all: students, remove: removeStudent } = useClassStudent(id);

  return (
    <div
      className={classnames('rounded w-full mb-1.5 p-3', {
        'text-white/20 bg-base-200': !active,
        'bg-primary text-white': active,
      })}
    >
      <div
        className={classnames('flex justify-between items-center gap-4')}
        onClick={() => changeContent(!showContent)}
      >
        <div className='text-lg font-bold flex-grow overflow-hidden'>
          {name}
        </div>

        <div className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
          {active ? (
            <BiShow
              size='1.5em'
              onClick={() => changeClass({ id, name, active: false })}
            />
          ) : (
            <BiHide
              size='1.5em'
              className='text-white/40'
              onClick={() => changeClass({ id, name, active: true })}
            />
          )}
        </div>
      </div>
      {showContent && (
        <div className='mt-2 flex gap-2 flex-wrap'>
          <div className='btn opacity-70' onClick={() => changeEdit(true)}>
            Bearbeiten
          </div>
          <ClassExport
            name='Export'
            className='btn-info opacity-70'
            classId={id}
          />
          <ClassImport
            name='Überschreiben'
            className='btn-info opacity-70'
            classId={id}
          />
          {classes.length > 1 && (
            <div
              className='btn btn-error opacity-70'
              onClick={() => changeDelete(true)}
            >
              Löschen
            </div>
          )}

          <EditModal
            title='Klasse bearbeiten'
            changeName={changeName}
            name={editName}
            open={showEdit}
            toggle={() => {
              changeName(name);
              changeEdit((old) => !old);
            }}
            submit={() => changeClass({ id, name: editName, active })}
          />

          <DeleteModal
            title='Klasse löschen'
            name={name}
            open={showDelete}
            toggle={() => {
              changeDelete((old) => !old);
            }}
            submit={() => {
              clearStudents(students, removeStudent);
              deleteClass(id);
            }}
          />
        </div>
      )}
    </div>
  );
}
