import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { verifyQRCode } from '../../services/mockApi';

declare global {
  interface Window {
    Html5Qrcode: any;
  }
}

interface QRScannerProps {
  bookingId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ bookingId, onSuccess, onCancel }) => {
  const [message, setMessage] = useState('Point camera at the QR code...');
  const [status, setStatus] = useState<'scanning' | 'verifying' | 'success' | 'error'>('scanning');
  const qrReaderId = "qr-reader";

  useEffect(() => {
    if (status !== 'scanning') return;

    let html5QrCode: any;
    const startScanner = async () => {
      try {
        const devices = await window.Html5Qrcode.getCameras();
        if (devices && devices.length) {
          html5QrCode = new window.Html5Qrcode(qrReaderId);
          html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            async (decodedText: string) => {
              await html5QrCode.stop();
              setStatus('verifying');
              setMessage('QR Code detected. Verifying...');
              
              const isValid = await verifyQRCode(bookingId, decodedText);

              if (isValid) {
                setStatus('success');
                setMessage('Verification successful! Pickup confirmed.');
                setTimeout(onSuccess, 1500);
              } else {
                setStatus('error');
                setMessage('Invalid QR Code. Please try again.');
                setTimeout(() => {
                  setStatus('scanning');
                  setMessage('Point camera at the QR code...');
                }, 2000);
              }
            },
            (errorMessage: string) => { /* ignore errors */ }
          ).catch((err: any) => {
            setStatus('error');
            setMessage('Error starting camera. Please grant permission.');
            console.error(err);
          });
        } else {
            setStatus('error');
            setMessage('No camera found on this device.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Could not get camera permissions.');
        console.error(err);
      }
    };
    
    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err: any) => console.error("Failed to stop QR scanner", err));
      }
    };
  }, [bookingId, onSuccess, status]);

  const getStatusColor = () => {
    switch (status) {
        case 'success': return 'text-green-400';
        case 'error': return 'text-red-400';
        case 'verifying': return 'text-yellow-400 animate-pulse';
        default: return 'text-slate-300';
    }
  }

  return (
    <Card className="max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Scan Pickup QR Code</h2>
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-slate-600 bg-slate-900 flex items-center justify-center">
        {status === 'scanning' && <div id={qrReaderId} className="w-full"></div>}
        {status === 'success' && <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
        {status === 'error' && <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
      </div>
      <p className={`mt-4 text-sm font-semibold h-5 ${getStatusColor()}`}>{message}</p>
      <Button onClick={onCancel} variant="secondary" className="mt-4" disabled={status === 'success'}>
        Cancel Scan
      </Button>
    </Card>
  );
};

export default QRScanner;