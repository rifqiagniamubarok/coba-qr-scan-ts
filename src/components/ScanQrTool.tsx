import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import QrScanner from 'qr-scanner';

type ScanQRToolProps = {
  width?: number;
  height?: number;
  onValueChange: (params?: string) => void;
};

const ScanQrTool = ({
  width = 300,
  height = 300,
  onValueChange,
}: ScanQRToolProps) => {
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: width,
    height: height,
    // facingMode: { exact: 'environment' },
    facingMode: 'user',
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    // console.log(imageSrc);
    // let file = base64toFIle('sds', 'name');
    // console.log(file);\
    if (imageSrc !== null && imageSrc !== undefined) {
      let arrs = imageSrc.split(',');
      if (arrs) {
        let val = arrs[0];
        let mimecol = val.match(/:(.*?);/);
        if (mimecol) {
          let mime = mimecol[1];
          let bstr = atob(arrs[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], 'name', { type: mime });

          readCodeImage(file);
        }
      }
    }
  }, [webcamRef]);

  function base64toFIle(dataurl: string, filename: string) {
    let arrs = dataurl.split(',');
    if (arrs) {
      let val = arrs[0];
      let mimecol = val.match(/:(.*?);/);
      if (mimecol) {
        let mime = mimecol[1];
        let bstr = atob(arrs[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }
    }
  }

  const readCodeImage = (file: Blob) => {
    if (!file) {
      return;
    }
    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then((res) => {
        onValueChange(res?.data);
      })
      .catch((err) => {
        console.log('no data');
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Coba scan</p>
      <Webcam
        audio={false}
        height={height}
        width={width}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
      />
    </div>
  );
};

export default ScanQrTool;
