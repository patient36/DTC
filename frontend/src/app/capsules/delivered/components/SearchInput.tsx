// components/SearchInput.tsx
import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => (
  <div className="relative w-64">
    <input
      type="text"
      placeholder="Search capsules..."
      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
  </div>
);