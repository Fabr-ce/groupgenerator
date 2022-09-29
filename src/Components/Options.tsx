import { MdOutlineArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
//import { useOptions } from './OptionsContext';
import Thopics from './Thopics';

export default function Options() {
  //const { options } = useOptions();
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
          <div className='btn '>LehrerOffice Importieren</div>
        </div>
      </div>
    </div>
  );
}
