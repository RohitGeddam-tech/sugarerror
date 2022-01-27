import React, { useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification({ message, type, callback }) {
  const notify = useCallback(
    type => {
      switch (type) {
        case 'success': {
          toast.success(message, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          setTimeout(() => {
            callback && callback();
          }, 1500);
          break;
        }
        case 'error':
          toast.error(message, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          break;
        case 'info':
          toast.info(message, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          break;
        case 'warn':
          toast.warn(message, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          break;
        default:
          break;
      }
    },
    [callback, message],
  );

  useEffect(() => {
    if (message && type) notify(type);
  }, [message, notify, type]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default Notification;
