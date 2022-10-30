import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Loading } from '../helpers/Loading';
import {
  useThopic,
  useOptions,
  useClass,
  useClassStudent,
} from '../helpers/Context/index';
import { GroupSelection, GroupType } from '../helpers/types';
import { IoMdSettings, IoMdSwap } from 'react-icons/io';

export default function Home() {
  const { options, changeOption } = useOptions();
  const { filtered: thopics, loading: loadT } = useThopic();
  const { filtered: classes, loading: loadC } = useClass();
  const {
    all,
    filtered: students,
    loading: loadS,
  } = useClassStudent(options.classId);

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

        {options.multipleClass && (loadC || classes.length > 1) && (
          <div className='form-control w-full pb-5'>
            <label className='label'>
              <span className='label-text'>Klasse</span>
            </label>
            {loadC ? (
              <Loading />
            ) : (
              <select
                className='select select-bordered w-full'
                value={options.classId}
                onChange={(e) =>
                  changeOption('classId', parseInt(e.target.value))
                }
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

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
                onChange={(e) => changeOption('groupSize', e.target.value)}
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
                onChange={(e) => changeOption('groupNumber', e.target.value)}
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
              changeOption('groupSelection', 1 - options.groupSelection)
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
              onClick={() => changeOption('groupType', GroupType.Heterogene)}
              className={classnames('btn flex-grow', {
                'btn-active': options.groupType === GroupType.Heterogene,
              })}
            >
              Heterogen
            </button>
            <button
              onClick={() => changeOption('groupType', GroupType.Homogene)}
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
              onChange={(e) =>
                changeOption('thopicId', parseInt(e.target.value))
              }
            >
              {thopics.map((thopic) => (
                <option key={thopic.id} value={thopic.id}>
                  {thopic.name}
                </option>
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
