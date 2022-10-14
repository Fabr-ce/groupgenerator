import React, { useEffect, useState } from 'react';
import { useStudent } from '../../helpers/Context';
import { importFromLehrerOffice } from './importHelpters';
import { Modal } from '../../helpers/Modal';
import { encode, minifyObj } from './minifyObj';
import { exportStudents } from './exportStudents';
import ExportComponent from './ExportComponent';

export default function LehrerOfficeImport() {
  const {
    all: students,
    loading,
    specificLoading,
    remove,
    update,
  } = useStudent();
  const [open, changeOpen] = useState(false);
  const [confirmed, changeConfirmed] = useState(false);
  const [err, changeErr] = useState('');
  const toggle = () => {
    changeConfirmed(false);
    changeErr('');
    changeOpen(!open);
  };
  const [qrCode, changeQrCode] = useState('');

  const importFromLO = async () => {
    try {
      await importFromLehrerOffice(students, update, remove);
    } catch (err: any) {
      changeErr(err.message);
    }
  };

  useEffect(() => {
    if (!open || specificLoading || loading) return;
    const exportStd = exportStudents(students);
    const mini = minifyObj(exportStd);
    const encoded = encode(JSON.stringify(mini));
    changeQrCode(encoded);
  }, [students, open, loading, specificLoading]);

  return (
    <>
      <div
        className='btn'
        onClick={() => {
          toggle();
        }}
      >
        LehrerOffice Importieren
      </div>
      <Modal title='Klasse importieren' toggle={toggle} open={open}>
        {confirmed ? (
          <div className='p-2'>
            {err && <div className='alert alert-error'>{err}</div>}
            {!err && (
              <>
                <div className='alert alert-success'>
                  Deine Klasse wurde erfolgreich erstellt. <br />
                  Scanne den folgenden QR-Code dem App auf dem Handy um die
                  Klasse zu übertragen. Alertnativ kannst du die Klasse auch
                  Kopieren und versenden.
                </div>
                {qrCode && <ExportComponent value={qrCode} />}
              </>
            )}
          </div>
        ) : (
          <div className='p-2'>
            <div className='alert alert-warning'>
              Achtung: Bei dem Import wird deine aktuelle Klasse gelöscht. Sie
              wird durch die Klasse vom LehrerOffice ersetzt.
              <br />
              Willst du wirklich fortfahren?
            </div>
            <div className='flex justify-between mt-3'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  importFromLO();
                  changeConfirmed(true);
                }}
              >
                Importieren
              </button>
              <button className='btn' onClick={() => changeOpen(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
