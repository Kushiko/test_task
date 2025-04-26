import { useEffect, useState } from 'react';
import { Multiselect } from './Multiselect.tsx';

export type Option = import('./Multiselect.tsx').Option;

export default function App() {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>([]);

  useEffect(() => {
    fetch('https://timeapi.io/api/timezone/availabletimezones')
      .then((res) => res.json())
      .then((data: string[]) => {
        const formatted = data.map((item) => ({ label: item, value: item }));
        setOptions(formatted);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <Multiselect
        options={options}
        selectedOptions={selected}
        onSelectionChange={setSelected}
        placeholder="Search timezones..."
      />
    </div>
  );
}
