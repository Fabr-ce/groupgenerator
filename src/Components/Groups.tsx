import React, { useCallback, useEffect, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import main from '../Logic/main';
import { useStudent } from './DataContext';
import { useOptions } from './OptionsContext';
import { StudentType } from './types';

export default function Groups() {
  const { options } = useOptions();
  const { filtered: students } = useStudent();
  const [groupAssignment, changeAssignment] = useState<StudentType[][]>([]);

  const generateAssignemnt = useCallback(() => {
    if (students.length === 0) return;
    const assignment = main({
      groupSize: options.groupSize,
      groupType: options.groupType,
      students,
      thopicId: options.thopicId,
    });
    changeAssignment(assignment);
  }, [students, options]);

  useEffect(() => {
    generateAssignemnt();
  }, [generateAssignemnt]);

  return (
    <div className='p-3 mt-5 pb-10'>
      <div className='mb-5 flex items-center max-w-xs mx-auto'>
        <Link to='/'>
          <MdOutlineArrowBack size='2.5em' />
        </Link>{' '}
        <h2 className='text-2xl font-bold text-center pl-4'>Gruppen</h2>
      </div>

      <div className='max-w-xs mx-auto'>
        {groupAssignment.map((group, ind) => (
          <div key={group[0].id} className='bg-primary rounded p-4 mb-3'>
            <h3 className='text-center text-2xl'>Gruppe {ind + 1}</h3>
            <div className='grid gap-4 grid-cols-3 mt-3'>
              {group.map((student) => (
                <div key={student.id} className='font-bold text-xl pb-1'>
                  {student.name}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className='btn btn-block' onClick={generateAssignemnt}>
          Durchmischen
        </div>
      </div>
    </div>
  );
}
