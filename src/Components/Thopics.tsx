import React, { useState } from 'react';
import { EditModal } from './Modal';
import { Thopic } from './Thopic';
import { Loading } from './Loading';
import { useThopic } from './DataContext';

export default function Thopics() {
  const { all: thopics, loading, update: updateThopic } = useThopic();
  const [newThopic, changeNew] = useState({ modal: false, name: '' });

  return (
    <div>
      <h3 className='text-xl font-bold mb-2'>Themen</h3>
      {loading ? (
        <Loading />
      ) : (
        thopics.map((thopic) => <Thopic key={thopic.id} {...thopic} />)
      )}
      <div
        className='btn btn-block text-lg'
        onClick={() => changeNew({ name: '', modal: true })}
      >
        Neues Thema
      </div>
      <EditModal
        title='Thema hinzufügen'
        changeName={(s) => changeNew((old) => ({ ...old, name: s }))}
        name={newThopic.name}
        open={newThopic.modal}
        toggle={() => {
          changeNew({ name: '', modal: false });
        }}
        submit={() => {
          if (newThopic.name.trim() === '') return;
          updateThopic({
            id: thopics[thopics.length - 1]?.id + 1 || 1,
            name: newThopic.name,
            active: true,
          });
        }}
      />
    </div>
  );
}
