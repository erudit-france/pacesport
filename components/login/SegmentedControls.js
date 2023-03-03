import { createStyles, SegmentedControl, rem } from '@mantine/core';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `1rem solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]}`,
  },

  indicator: {
    backgroundImage: theme.fn.gradient({ from: 'pink', to: 'orange' }),
  },

  control: {
    border: '0 !important',
  },

  label: {
    '&, &:hover': {
      '&[data-active]': {
        color: theme.white,
      },
    },
  },
}));

export function SegmentedControls({ tabHandler }) {
  const { classes } = useStyles();
  const [value, setValue] = useState('Connexion');
  const changeHandler = (value) => {
    setValue(value)
    tabHandler(value)
  }

  return (
    <SegmentedControl
      value={value}
      onChange={changeHandler}
      radius="xl"
      size="md"
      data={['Connexion', 'Inscription']}
      color="pink"
      classNames={classes}
    />
  );
}