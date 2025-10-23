
import React from 'react';
import { WarningIcon } from './icons';

interface ErrorMessageProps {
  message: string;
  errorPrefixText: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, errorPrefixText }) => {
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-4 flex items-center" role="alert">
      <WarningIcon className="w-5 h-5 mr-3"/>
      <div>
        <span className="font-semibold">{errorPrefixText}</span>
        <span className="ml-2">{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
