"use client";

import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean; // Tambahkan ini
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = "Cari atau pilih...",
  onChange,
  className = "",
  defaultValue,
  disabled = false, // Tambahkan ini
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  // Set default value saat mount
  React.useEffect(() => {
    if (defaultValue) {
      const found = options.find((opt) => opt.value === defaultValue);
      if (found) {
        setSelected(found);
      }
    }
  }, [defaultValue, options]);

  // Filter options berdasarkan input
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
    setSearch(""); // reset search setelah pilih
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Input search / display */}
      <div
        className={`flex h-11 cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-3 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900 ${
          disabled ? "cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <span
          className={
            selected ? "text-gray-900 dark:text-white" : "text-gray-400"
          }
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className="ml-2 text-gray-400">▼</span>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute right-0 left-0 z-10 mt-1 rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {/* Search input */}
          <input
            type="text"
            placeholder="Ketik untuk mencari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-gray-200 px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            disabled={disabled}
          />

          {/* Options */}
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                Tidak ada hasil
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
