import classNames from 'classnames';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { QRCode } from 'react-qrcode-logo';
import logo from './logo.png';

export default function ExportComponent({ value }: { value: string }) {
  const [copied, changeCopied] = useState(false);

  return (
    <div className='mt-4'>
      <div className='alert alert-info block'>
        Bei <span className='font-bold inline'>Android</span> Geräten kann der
        Qr-Code gescannt werden. Die Klasse wird dann automatisch mit dem App
        synchronisiert. <br />
        Bei <span className='font-bold inline'>IOS</span> Geräten muss die
        Klasse kopiert und mit "KLASSE IMPORTIEREN" importiert werden.
      </div>
      <div className='w-full flex justify-center'>
        <QRCode
          value={'https://groupgenerator.surge.sh/import/' + value}
          //value={'http://192.168.0.193:3000/import/' + value}
          logoImage={logo}
          size={285}
          quietZone={10}
          logoWidth={40}
          bgColor='#2A303C'
          fgColor='#fff'
          qrStyle='dots'
        />
      </div>
      <CopyToClipboard text={value} onCopy={() => changeCopied(true)}>
        <button
          className={classNames('btn btn-outline mt-2', {
            'btn-success': copied,
          })}
        >
          Klasse Kopieren (IOS)
        </button>
      </CopyToClipboard>
    </div>
  );
}
