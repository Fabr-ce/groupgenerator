import React, { useState } from 'react';
import { useClass, useOptions, useStudent } from '../../helpers/Context';
import { Loading } from '../../helpers/Loading';
import { EditModal } from '../../helpers/Modal';
import { createStudents } from '../LehrerOffice/importHelpters';
import { decode, parseStr } from '../LehrerOffice/minifyObj';
import Class from './Class';
import EnableMultipleClasses from './EnableMultipleClasses';

export default function Classes() {
  const { options } = useOptions();

  if (options.multipleClass) {
    return <ClassList />;
  } else {
    return <EnableMultipleClasses />;
  }
}

const ClassList = () => {
  const { all: classes, loading, update: updateClass } = useClass();
  const { update: updateStudent } = useStudent();
  const [newClass, changeNew] = useState({ modal: false, name: '' });

  return (
    <div>
      <h3 className='text-xl font-bold mb-2'>Klassen</h3>
      {loading ? <Loading /> : classes.map((c) => <Class key={c.id} {...c} />)}
      <div
        className='btn btn-block text-lg'
        onClick={() => changeNew({ name: '', modal: true })}
      >
        Neue Klasse
      </div>
      <EditModal
        title='Klasse hinzufügen'
        changeName={(s) => changeNew((old) => ({ ...old, name: s }))}
        name={newClass.name}
        open={newClass.modal}
        toggle={() => {
          changeNew({ name: '', modal: false });
        }}
        submit={async () => {
          if (newClass.name.trim() === '') return;
          let name = newClass.name;
          const classId = classes[classes.length - 1]?.id + 1 || 1;
          if (name.length > 20) {
            //check if we entered import code
            try {
              const decodedStr = decode(name);
              const decodeObj = JSON.parse(decodedStr);
              const newStudents = parseStr(decodeObj);
              try {
                await updateClass({
                  id: classId,
                  active: true,
                  name: 'Klasse ' + classId,
                });
                await createStudents(newStudents, classId, updateStudent);
                return;
              } catch (err) {
                return;
              }
            } catch (err) {}
            name = name.substring(0, 20);
          }
          updateClass({
            id: classId,
            name,
            active: true,
          });
        }}
      />
    </div>
  );
};
