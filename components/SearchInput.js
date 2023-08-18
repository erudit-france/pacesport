import { useState, useRef, forwardRef } from 'react';
import { Autocomplete, Loader } from '@mantine/core';
import { GoSearch } from "react-icons/go";
import { Group, Avatar, Text } from '@mantine/core';
import Link from 'next/link';

const AutoCompleteItem = forwardRef(
  ({ description, value, image, ...others }, ref) => (
    <div ref={ref} {...others} onClick={() => console.log('opening link')}>
      <Group noWrap>
        <Avatar className='tw-shadow-md p-2' size="md"  radius="xl" src={""} />
        <div>
            <Text size="md">{value}</Text>
        </div>
      </Group>
    </div>
  )
);

AutoCompleteItem.displayName = 'AutoCompleteItem';

export default function SearchInput({className}) {
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
        setData([''].map((provider) => `${val}`));
      }, 100);
    }
  };

  const ref = useRef(null);
  
  return (
    <Autocomplete
    className={`focus:tw-border-[#d61515] ${className}`}
      ref={ref}
      size={"md"}
      dropdownPosition="bottom" 
      radius={"xl"}
      placeholder="Nom de l'association..."
      itemComponent={AutoCompleteItem}
      rightSection={loading ? <Loader className="tw-mr-5" color='red' size={16} /> : <GoSearch className='tw-mr-5' />}
      value={value}
      data={data}
      onChange={handleChange}
    />
  );
}