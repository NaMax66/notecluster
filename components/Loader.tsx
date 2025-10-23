import React from 'react';

interface LoaderProps {
    loaderText: string;
}

const Loader: React.FC<LoaderProps> = ({ loaderText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-stone-400">{loaderText}</p>
    </div>
  );
};

export default Loader;