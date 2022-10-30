import React, { useCallback, useEffect, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import main from '../../Logic/main';
import { useOptions, useStudent } from '../helpers/Context/index';
import { GroupSelection, StudentType } from '../helpers/types';

export default function Groups() {
  const { options } = useOptions();
  const { filtered: students } = useStudent();

  const [loading, changeLoading] = useState(true);

  const [groupAssignment, changeAssignment] = useState<StudentType[][]>([]);

  const generateAssignemnt = useCallback(() => {
    if (students.length === 0) return;
    const assignment = main({
      students,
      ...options,
    });

    changeAssignment(assignment);
    changeLoading(false);
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

        {groupAssignment.length > 0 && (
          <div className='btn btn-block' onClick={() => generateAssignemnt}>
            Durchmischen
          </div>
        )}
        {groupAssignment.length === 0 && students.length !== 0 && !loading && (
          <>
            {options.groupSelection === GroupSelection.GroupSize && (
              <div className='alert alert-warning'>
                Es wurde keine gute Aufteilung gefunden die {students.length}{' '}
                Schüler/innen in {options.groupSize}er Gruppen aufteilt.
              </div>
            )}
            {options.groupSelection === GroupSelection.GroupNumber && (
              <div className='alert alert-warning'>
                Es wurde keine gute Aufteilung gefunden die {students.length}{' '}
                Schüler/innen in {options.groupNumber} Gruppen aufteilt.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
