import { MdOutlineArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import ClassExport from './LehrerOffice/ClassExport';
import ClassImport from './LehrerOffice/ClassImport';
import LehrerOfficeImport from './LehrerOffice/LehrerOfficeImport';
import { useOptions } from '../helpers/Context';
import Thopics from './Thopics';
import Classes from './Classes';

export default function Options() {
  const { options } = useOptions();

  return (
    <div className='p-3 mt-5 pb-10'>
      <div className='mb-5 flex items-center max-w-xs mx-auto'>
        <Link to='/'>
          <MdOutlineArrowBack size='2.5em' />
        </Link>{' '}
        <h2 className='text-2xl font-bold text-center pl-4'>Einstellungen</h2>
      </div>

      <div className='max-w-xs mx-auto'>
        <div className='border-y py-3'>
          <Thopics />
        </div>
        <div className='border-b py-3'>
          <Classes />
        </div>
        <div className='border-b py-3'>
          <a
            href='https://youtu.be/vEoSnBtR-_4'
            className='btn'
            target='_blank'
            rel='noreferrer'
          >
            Erklärungs Video
          </a>
        </div>
        <div className='border-b py-3'>
          <LehrerOfficeImport />
        </div>

        <div className='border-b py-3'>
          <ClassImport />
        </div>
        {!options.multipleClass && (
          <div className='border-b py-3'>
            <ClassExport />
          </div>
        )}
      </div>
    </div>
  );
}
