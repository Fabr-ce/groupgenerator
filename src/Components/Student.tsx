import React, { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import classnames from 'classnames';
import { StudentType, ThopicType } from './types';
import { ThopicSelector } from './ThopicSelector';
import { DeleteModal, EditModal } from './Modal';
import { useStudent } from './DataContext';

export const Student = ({
  id,
  name,
  active,
  skills,
  thopics,
  selectedThopic,
}: StudentType & {
  selectedThopic: ThopicType['id'] | null;
  thopics: ThopicType[];
}) => {
  const [showContent, changeContent] = useState(false);
  const [showEdit, changeEdit] = useState(false);
  const [showDelete, changeDelete] = useState(false);

  const [editName, changeName] = useState(name);

  const { update: updateStudent, remove: deleteStudent } = useStudent();

  return (
    <div
      className={classnames('rounded w-full mb-2 p-4', {
        'text-white/20 bg-base-200': !active,
        'bg-primary text-white': active,
        'py-1.5': selectedThopic,
      })}
    >
      <div
        className={classnames('flex justify-between items-center gap-4')}
        onClick={() => changeContent(!showContent)}
      >
        <div className='text-lg font-bold flex-grow'>{name}</div>
        {selectedThopic && (
          <ThopicSelector
            thopicId={selectedThopic}
            student={{ id, name, active, skills }}
          />
        )}
        <div className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
          {active ? (
            <BiShow
              size='1.5em'
              onClick={() => updateStudent({ id, name, skills, active: false })}
            />
          ) : (
            <BiHide
              size='1.5em'
              className='text-white/40'
              onClick={() => updateStudent({ id, name, skills, active: true })}
            />
          )}
        </div>
      </div>
      {showContent && (
        <div className='mt-4'>
          {thopics.map((thopic) => (
            <div key={thopic.id} className='mb-2 flex justify-between'>
              <div className='align-center my-auto'>{thopic.name}</div>
              <ThopicSelector
                thopicId={thopic.id}
                student={{ id, name, active, skills }}
              />
            </div>
          ))}
          <div className='btn opacity-70 mr-2' onClick={() => changeEdit(true)}>
            Bearbeiten
          </div>
          <div
            className='btn btn-error opacity-70'
            onClick={() => changeDelete(true)}
          >
            Löschen
          </div>
          <EditModal
            title='Schüler/in bearbeiten'
            changeName={changeName}
            name={editName}
            open={showEdit}
            toggle={() => {
              changeName(name);
              changeEdit((old) => !old);
            }}
            submit={() => updateStudent({ id, name: editName, skills, active })}
          />
          <DeleteModal
            title='Schüler/in bearbeiten'
            name={name}
            open={showDelete}
            toggle={() => {
              changeDelete((old) => !old);
            }}
            submit={() => deleteStudent(id)}
          />
        </div>
      )}
    </div>
  );
};
