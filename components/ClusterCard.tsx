import React from 'react';
import type { Cluster } from '../types';
import { QuoteIcon } from './icons';

interface ClusterCardProps {
  cluster: Cluster;
  originalNotes: string[];
  notesInClusterTitle: string;
}

const ClusterCard: React.FC<ClusterCardProps> = ({ cluster, originalNotes, notesInClusterTitle }) => {
  return (
    <div className="bg-stone-900/70 p-6 rounded-xl border border-stone-800 transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20">
      <h3 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text mb-2">
        {cluster.title}
      </h3>
      <p className="text-stone-400 mb-6 italic">
        {cluster.description}
      </p>
      <div>
        <h4 className="font-semibold text-stone-300 mb-3">{notesInClusterTitle}</h4>
        <ul className="space-y-3">
          {cluster.note_numbers.map((noteNumber) => (
            <li key={noteNumber} className="flex items-start gap-3 pl-2 text-stone-300 border-l-2 border-stone-800">
              <QuoteIcon className="w-4 h-4 text-stone-500 flex-shrink-0 mt-1" />
              <span>{originalNotes[noteNumber - 1]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClusterCard;