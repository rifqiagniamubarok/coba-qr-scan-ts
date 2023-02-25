import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import QrScanner from 'qr-scanner';

function App() {
  const webcamRef = useRef<Webcam>(null);
  const [fileImage, setFileImage] = useState<Blob>();

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: { exact: 'environment' },
    // facingMode: 'user',
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
          setFileImage(file);
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
        console.log(res.data);
      })
      .catch((err) => {
        console.log('no data');
      });
  };

  return (
    <div className="">
      <p>Coba scan</p>
      <Webcam
        audio={false}
        // height={400}
        // width={600}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Capture</button>
      {fileImage && <img src={URL.createObjectURL(fileImage)} alt="name" />}
      {fileImage && (
        <button onClick={() => readCodeImage(fileImage)}>Scan</button>
      )}
    </div>
  );
}

export default App;
