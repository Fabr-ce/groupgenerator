import React from 'react';
import { useStudent } from '../helpers/Context/DataContext';
import { StudentType, ThopicType } from '../helpers/types';

enum LevelName {
  G,
  M,
  E,
}

export const levels = [LevelName.G, LevelName.M, LevelName.E];
export const levelNames = ['G', 'M', 'E'];

export const levelNumbers = levels.length;
export const defaultLevel = LevelName.M;

export const ThopicSelector = ({
  thopicId,
  student,
}: {
  thopicId: ThopicType['id'];
  student: StudentType;
}) => {
  const { skills } = student;
  const { update } = useStudent();
  const handleSkill = (thopicId: ThopicType['id']) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSkill = { ...skills, [thopicId]: parseInt(e.target.value) };
      update({ ...student, skills: newSkill });
    };
  };

  return (
    <div className='form-control' onClick={(e) => e.stopPropagation()}>
      <select
        className='select select-bordered w-full'
        value={skills[thopicId] !== undefined ? skills[thopicId] : defaultLevel}
        onChange={handleSkill(thopicId)}
      >
        {levels.map((level) => (
          <option key={level} value={level}>
            {levelNames[level]}
          </option>
        ))}
      </select>
    </div>
  );
};
