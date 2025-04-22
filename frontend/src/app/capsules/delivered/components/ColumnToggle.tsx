// components/ColumnToggle.tsx
import { FiCheck } from 'react-icons/fi';
import { ColumnKey } from '../types';

interface ColumnToggleProps {
    column: ColumnKey;
    isVisible: boolean;
    onToggle: (column: ColumnKey) => void;
}

export const ColumnToggle = ({ column, isVisible, onToggle }: ColumnToggleProps) => (
    <button
        onClick={() => onToggle(column)}
        className={`px-3 py-1.5 text-xs rounded-full flex items-center transition-all ${isVisible
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
            } hover:bg-cyan-500/20 hover:text-cyan-300`}
    >
        {isVisible && <FiCheck className="w-3 h-3 mr-1" />}
        {column.charAt(0).toUpperCase() + column.slice(1)}
    </button>
);