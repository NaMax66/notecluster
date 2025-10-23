import React from 'react';
import type { Cluster } from '../types';
import ClusterCard from './ClusterCard';
import Loader from './Loader';
import { exportToHtml, exportToCsv } from '../utils/exportUtils';
import { GoogleDocsIcon, GoogleSheetsIcon } from './icons';

interface ResultsDisplayProps {
  clusters: Cluster[] | null;
  originalNotes: string[];
  isLoading: boolean;
  loaderText: string;
  resultsTitle: string;
  noClustersText: string;
  notesInClusterTitle: string;
  exportToDocsText: string;
  exportToSheetsText: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    clusters, 
    originalNotes, 
    isLoading,
    loaderText,
    resultsTitle,
    noClustersText,
    notesInClusterTitle,
    exportToDocsText,
    exportToSheetsText,
}) => {
  if (isLoading) {
    return <Loader loaderText={loaderText} />;
  }

  if (!clusters) {
    return null;
  }
  
  if (clusters.length === 0) {
    return <p className="text-center text-stone-400 mt-8">{noClustersText}</p>;
  }
  
  const handleExport = (format: 'html' | 'csv') => {
    if (!clusters) return;

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'html') {
        content = exportToHtml(clusters, originalNotes);
        mimeType = 'text/html';
        filename = 'flow-analysis.html';
    } else {
        content = exportToCsv(clusters, originalNotes);
        mimeType = 'text/csv;charset=utf-8;';
        filename = 'flow-analysis.csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-center sm:text-left text-stone-300">{resultsTitle}</h2>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => handleExport('html')}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-300 bg-stone-800/80 rounded-md hover:bg-stone-700/80 disabled:opacity-50 transition-colors"
                    title={exportToDocsText}
                 >
                    <GoogleDocsIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{exportToDocsText}</span>
                </button>
                <button
                    onClick={() => handleExport('csv')}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-300 bg-stone-800/80 rounded-md hover:bg-stone-700/80 disabled:opacity-50 transition-colors"
                    title={exportToSheetsText}
                 >
                    <GoogleSheetsIcon className="w-4 h-4" />
                     <span className="hidden sm:inline">{exportToSheetsText}</span>
                </button>
            </div>
        </div>
        <div className="space-y-6">
            {clusters.map((cluster, index) => (
                <ClusterCard 
                    key={index} 
                    cluster={cluster} 
                    originalNotes={originalNotes}
                    notesInClusterTitle={notesInClusterTitle}
                />
            ))}
        </div>
    </div>
  );
};

export default ResultsDisplay;