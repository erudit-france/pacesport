import { useState, useRef, forwardRef } from 'react';
import { Autocomplete, Loader, Select } from '@mantine/core';
import { GoSearch } from "react-icons/go";
import { Group, Avatar, Text } from '@mantine/core';
import Link from 'next/link';

const AutoCompleteItem = forwardRef(
  ({ description, value, image, ...others }, ref) => (
    <div ref={ref} {...others} onClick={() => console.log('opening link')}>
      <Group noWrap>
        <Avatar className='tw-shadow-md p-2' size="md"  radius="xl" />
        <div>
            <Text size="md">{value}</Text>
        </div>
      </Group>
    </div>
  )
);

AutoCompleteItem.displayName = 'AutoCompleteItem';

export default function SearchUser() {
  const timeoutRef = useRef(-1);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleChange = (val) => {
    window.clearTimeout(timeoutRef.current);
    setValue(val);
    setData([]);

    if (val.trim().length === 0) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        setData([''].map((provider) => `${val} ${provider}`));
      }, 100);
    }
  };

  const ref = useRef(null);
  console.log(data)
  return (
    <Select className="tw-m-1.5 tw-my-3" 
    value={value}
    data={data}
    onChange={handleChange} />
  );
}