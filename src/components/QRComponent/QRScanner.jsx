
import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import InvalidQrDialog from "../dialogs/joinGroup/InvalidQrDialog";



function QRScanner({ onScan }) {
  const [scanResult, setScanResult] = useState(null);
  const [closeScanner, setCloseScanner] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const webcamRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  const scanQRCode = useCallback(async () => {
    if (!webcamRef.current || closeScanner) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Use decodeFromImageElement instead of decodeFromImage
      const result = await codeReader.current.decodeFromImageElement(img);
      
      if (result) {
        const text = result.getText();
        if (text.length >= 6 && text.length <= 8) {
          setScanResult(text);
          onScan(text);
          setCloseScanner(true);
        } else {
          setAlertDialog(true);
        }
      }
    } catch (error) {
      console.error("Scanning error:", error);
    }
  }, [closeScanner, onScan]);

  useEffect(() => {
    if (!closeScanner) {
      const scanInterval = setInterval(scanQRCode, 500);
      return () => clearInterval(scanInterval);
    }
  }, [closeScanner, scanQRCode]);

  return (
    <div className="absolute inset-0">
      {alertDialog && ( <InvalidQrDialog onCancel={() => setAlertDialog(false)}/>)
        }
      {!closeScanner && (
        <Webcam 
          ref={webcamRef} 
          screenshotFormat="image/jpeg"
          className="absolute inset-0 w-full h-full object-cover"
          videoConstraints={{ facingMode: "environment" }}
        />
      )}
      {scanResult && <p>Scanned Code: {scanResult}</p>}
    </div>
  );
}


export default QRScanner;

