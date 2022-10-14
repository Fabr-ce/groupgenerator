import React, { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import classnames from 'classnames';
import { DeleteModal, EditModal } from '../helpers/Modal';
import { ThopicType } from '../helpers/types';
import { useThopic } from '../helpers/Context/DataContext';

export const Thopic = ({ id, name, active }: ThopicType) => {
  const [showContent, changeContent] = useState(false);
  const [showEdit, changeEdit] = useState(false);
  const [showDelete, changeDelete] = useState(false);

  const [editName, changeName] = useState(name);

  const { update: changeThopic, remove: deleteThopic } = useThopic();

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
        <div className='text-lg font-bold flex-grow'>{name}</div>

        <div className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
          {active ? (
            <BiShow
              size='1.5em'
              onClick={() => changeThopic({ id, name, active: false })}
            />
          ) : (
            <BiHide
              size='1.5em'
              className='text-white/40'
              onClick={() => changeThopic({ id, name, active: true })}
            />
          )}
        </div>
      </div>
      {showContent && (
        <div className='mt-2'>
          {id > 3 && (
            <div
              className='btn opacity-70 mr-2'
              onClick={() => changeEdit(true)}
            >
              Bearbeiten
            </div>
          )}

          <div
            className='btn btn-error opacity-70'
            onClick={() => changeDelete(true)}
          >
            Löschen
          </div>
          <EditModal
            title='Thema bearbeiten'
            changeName={changeName}
            name={editName}
            open={showEdit}
            toggle={() => {
              changeName(name);
              changeEdit((old) => !old);
            }}
            submit={() => changeThopic({ id, name: editName, active })}
          />
          <DeleteModal
            title='Thema bearbeiten'
            name={name}
            open={showDelete}
            toggle={() => {
              changeDelete((old) => !old);
            }}
            submit={() => deleteThopic(id)}
          />
        </div>
      )}
    </div>
  );
};
