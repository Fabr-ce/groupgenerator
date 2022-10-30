import React, { useEffect, useState } from 'react';
import { useClass, useOptions, useStudent } from '../../helpers/Context';
import { importFromLehrerOffice } from './importHelpters';
import { Modal } from '../../helpers/Modal';
import { encode, minifyObj } from './minifyObj';
import { exportStudents } from './exportStudents';
import ExportComponent from './ExportComponent';
import { Loading } from '../../helpers/Loading';

export default function LehrerOfficeImport() {
  const {
    all: students,
    loading,
    specificLoading,
    remove,
    update,
  } = useStudent();
  const { all: classes, update: updateClass } = useClass();
  const { options } = useOptions();

  const [loadingImport, changeLoading] = useState(false);
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
      changeLoading(true);
      let classId = options.classId;
      let studentList = students;

      if (options.multipleClass) {
        classId = classes[classes.length - 1].id + 1;
        await updateClass({
          id: classId,
          active: true,
          name: 'Klasse ' + classId,
        });
        studentList = [];
      }
      await importFromLehrerOffice(studentList, classId, update, remove);
    } catch (err: any) {
      changeErr(err.message);
    } finally {
      changeLoading(false);
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
            {loadingImport ? (
              <Loading />
            ) : (
              <>
                {err && <div className='alert alert-error'>{err}</div>}
                {!err && (
                  <>
                    <div className='alert alert-success'>
                      Deine Klasse wurde erfolgreich erstellt.
                    </div>
                    {qrCode && <ExportComponent value={qrCode} />}
                  </>
                )}
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
