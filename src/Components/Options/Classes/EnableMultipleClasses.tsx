import React, { useState } from 'react';
import { useClass, useOptions } from '../../helpers/Context';
import { Modal } from '../../helpers/Modal';

export default function EnableMultipleClasses() {
  const { changeOption } = useOptions();
  const { update } = useClass();
  const [name, changeName] = useState('');
  const createClass = () => {
    changeOption('multipleClass', true);
    update({ id: 1, active: true, name });
  };
  const [open, changeOpen] = useState(false);
  return (
    <>
      <div className='btn' onClick={() => changeOpen(true)}>
        Mehrere Klassen
      </div>
      <Modal
        title='Mehrere Klassen hinzufügen'
        open={open}
        toggle={() => changeOpen((old) => !old)}
      >
        <div className='alert alert-info mt-2'>
          Betreust du mehrere Klassen?
          <br />
          Gib der aktuellen Klasse einen Namen und leg los!
        </div>
        <input
          className='input w-full mt-4'
          type='text'
          autoFocus
          placeholder='Klasse 1'
          value={name}
          onChange={(e) => changeName(e.target.value)}
        />
        <div className='flex w-full justify-between mt-4'>
          <div className='btn btn-primary' onClick={createClass}>
            Klasse erstellen
          </div>
          <div className='btn' onClick={() => changeOpen(false)}>
            Abbrechen
          </div>
        </div>
      </Modal>
    </>
  );
}
