import { useState, useRef, forwardRef } from 'react';
import { Autocomplete, Loader } from '@mantine/core';
import { GoSearch } from "react-icons/go";
import { Group, Avatar, Text } from '@mantine/core';
import Link from 'next/link';

const AutoCompleteItem = forwardRef(
  ({ description, value, image, ...others }, ref) => (
    <div ref={ref} {...others} onClick={() => console.log('opening link')}>
      <Group noWrap>
        <Avatar className='tw-shadow-md p-2' size="md"  radius="xl" src={"https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png"} />
        <div>
            <Text size="md">{value}</Text>
        </div>
      </Group>
    </div>
  )
);

AutoCompleteItem.displayName = 'AutoCompleteItem';

export default function SearchInput() {
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
        setData(['gmail.com', 'outlook.com', 'yahoo.com', 'yandex.com', 'hotmail.com', 'hostinger.com'].map((provider) => `${val}@${provider}`));
      }, 100);
    }
  };

  const ref = useRef(null);
  
  return (
    <Autocomplete
    className='focus:tw-border-red-600'
      onChange={(value) => console.log(value)}
      ref={ref}
      size={"lg"}
      dropdownPosition="bottom" 
      radius={"xl"}
      placeholder="Auchan Lyon 1..."
      itemComponent={AutoCompleteItem}
      rightSection={loading ? <Loader className="tw-mr-5" color='red' size={16} /> : <GoSearch className='tw-mr-5' />}
      value={value}
      data={data}
      onChange={handleChange}
    />
  );
}