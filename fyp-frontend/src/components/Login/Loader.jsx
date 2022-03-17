import LinearProgress from '@mui/material/LinearProgress';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Loader = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress color="secondary" />
    </div>
  );
};

export default Loader;
