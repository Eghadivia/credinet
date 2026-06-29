"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

interface ExpandableSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function ExpandableSearch({
  searchQuery,
  setSearchQuery,
}: ExpandableSearchProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpenSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="hidden xl:flex items-center">
      {!openSearch && (
        <button
          onClick={() => setOpenSearch(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center 
                     bg-gray-100 hover:bg-gray-200 transition"
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {openSearch && (
        <div className="relative flex items-center ml-2 transition-all duration-200">
          <Search className="absolute left-3 text-black w-5 h-5" aria-hidden />

          <input
            type="search"
            autoFocus
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
             h-10 w-[280px] pl-10 pr-4 text-black
             bg-transparent
             border-0
             border-b 
           border-gray-300
             focus:outline-none 
         focus:border-gray-300
            "
          />
        </div>
      )}
    </div>
  );
}
