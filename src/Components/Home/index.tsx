import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Loading } from '../helpers/Loading';
import { useStudent, useThopic, useOptions } from '../helpers/Context/index';
import { GroupSelection, GroupType } from '../helpers/types';
import { IoMdSettings, IoMdSwap } from 'react-icons/io';

export default function Home() {
  const { options, changeOptions } = useOptions();
  const { filtered: thopics, loading: loadT } = useThopic();
  const { all, filtered: students, loading: loadS } = useStudent();

  const handleChange = (field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      changeOptions({ ...options, [field]: e.target.value });
  };

  return (
    <div className='p-3 mt-5'>
      <div className='max-w-xs mx-auto flex justify-between'>
        <h2 className='flex-grow text-2xl font-bold text-center mb-5'>
          Gruppen Generator
        </h2>
        <Link className='' to='/options'>
          <IoMdSettings size='2em' />
        </Link>
      </div>
      <div className='max-w-xs mx-auto'>
        <Link to='/students' className='btn btn-block bg-primary mb-4'>
          Klasse bearbeiten{' '}
          {!loadS && '(' + students.length + '/' + all.length + ')'}
        </Link>

        <div className='w-full flex gap-2 items-end'>
          {options.groupSelection === GroupSelection.GroupSize ? (
            <div className='form-control flex-grow'>
              <label className='label'>
                <span className='label-text'>
                  Wie viele Schüler/innen pro Gruppe?
                </span>
              </label>
              <select
                className='select select-bordered w-full'
                value={options.groupSize}
                onChange={handleChange('groupSize')}
              >
                {new Array(9).fill(0).map((z, i) => (
                  <option key={i}>{i + 2}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className='form-control flex-grow'>
              <label className='label'>
                <span className='label-text'>Wie viele Gruppen?</span>
              </label>
              <select
                className='select select-bordered w-full'
                value={options.groupNumber}
                onChange={handleChange('groupNumber')}
              >
                {new Array(9).fill(0).map((z, i) => (
                  <option key={i}>{i + 2}</option>
                ))}
              </select>
            </div>
          )}

          <div
            className='btn btn-square'
            onClick={() =>
              changeOptions({
                ...options,
                groupSelection: 1 - options.groupSelection,
              })
            }
          >
            <IoMdSwap size='2em' />
          </div>
        </div>

        <div className='pt-5'>
          <label className='label'>
            <span className='label-text'>Leistungsgruppen</span>
          </label>
          <div className='btn-group w-full'>
            <button
              onClick={() =>
                changeOptions({
                  ...options,
                  groupType: GroupType.Heterogene,
                })
              }
              className={classnames('btn flex-grow', {
                'btn-active': options.groupType === GroupType.Heterogene,
              })}
            >
              Heterogen
            </button>
            <button
              onClick={() =>
                changeOptions({
                  ...options,
                  groupType: GroupType.Homogene,
                })
              }
              className={classnames('btn flex-grow', {
                'btn-active': options.groupType === GroupType.Homogene,
              })}
            >
              Homogen
            </button>
          </div>
        </div>

        <div className='form-control w-full pt-5'>
          <label className='label'>
            <span className='label-text'>Gruppen-Thema</span>
          </label>
          {loadT ? (
            <Loading />
          ) : (
            <select
              className='select select-bordered w-full'
              value={options.thopicId}
              onChange={handleChange('thopicId')}
            >
              {thopics.map((thopic) => (
                <option key={thopic.id}>{thopic.name}</option>
              ))}
            </select>
          )}
        </div>

        <Link to='/groups' className='btn btn-block btn-primary mt-5'>
          Los
        </Link>
      </div>
    </div>
  );
}
