import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

interface Props {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const timerRef = useRef<number>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      onSearch(value);
    }, 400);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, onSearch]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search products..."
      className="search-input"
    />
  );
}
