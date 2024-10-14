import type { ReactNode } from 'react';

interface Props {
  header?: string;
  children: ReactNode;
}

export const ErrorMessage = ({ header, children }: Props) => {
  return (
    <div className="container m-auto d-flex justify-content-center align-items-center vh-100">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#f8d7da', // Light red background
          border: '1px solid #f5c2c7',
          width: '400px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#dc3545', // Red background for the icon
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              color: 'white',
            }}
          >
            &#33; {/* Exclamation mark */}
          </span>
        </div>
        {header ?? (
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#721c24',
              marginBottom: '10px',
            }}
          >
            {header}
          </div>
        )}
        <div
          style={{
            fontSize: '16px',
            color: 'black',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
