import classNames from 'classnames';
import React, { useState } from 'react';
import { useStudent } from '../../helpers/Context';
import { Loading } from '../../helpers/Loading';
import { Modal } from '../../helpers/Modal';
import ExportComponent from './ExportComponent';
import { exportStudents } from './exportStudents';
import { minifyObj } from './minifyObj';

export default function ClassExport({
  name,
  className,
  classId,
}: {
  name?: string;
  className?: string;
  classId?: number;
}) {
  const { all: allStudents, loading } = useStudent();
  const students = allStudents.filter((s) => !classId || s.classId === classId);
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
        className={classNames('btn', className)}
        onClick={() => {
          if (loading) return;
          exportClass();
          toggle();
        }}
        disabled={loading}
      >
        {loading ? <Loading /> : name || 'Klasse Exportieren'}
      </button>
      <Modal title='Klasse Exportieren' toggle={toggle} open={open}>
        {qrCode && <ExportComponent value={qrCode} />}
      </Modal>
    </>
  );
}
