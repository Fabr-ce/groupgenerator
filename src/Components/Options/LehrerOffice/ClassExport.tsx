import React, { useState } from 'react';
import { useStudent } from '../../helpers/Context';
import { Loading } from '../../helpers/Loading';
import { Modal } from '../../helpers/Modal';
import ExportComponent from './ExportComponent';
import { exportStudents } from './exportStudents';
import { minifyObj } from './minifyObj';

export default function ClassExport() {
  const { all: students, loading } = useStudent();
  const [open, changeOpen] = useState(false);
  const toggle = () => changeOpen(!open);
  const [qrCode, changeQrCode] = useState('');

  const exportClass = () => {
    const exportStd = exportStudents(students);
    const mini = minifyObj(exportStd);
    const encoded = btoa(JSON.stringify(mini));
    changeQrCode(encoded);
  };

  return (
    <>
      <button
        className='btn'
        onClick={() => {
          if (loading) return;
          exportClass();
          toggle();
        }}
        disabled={loading}
      >
        {loading ? <Loading /> : 'Klasse Exportieren'}
      </button>
      <Modal title='Klasse Exportieren' toggle={toggle} open={open}>
        {qrCode && <ExportComponent value={qrCode} />}
      </Modal>
    </>
  );
}
