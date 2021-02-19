import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CallTable from '../CallTable';
import {Call} from '../../Context/CallContext'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TabsWrappedLabel() {
  const classes = useStyles();
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
          <Tab
            value="one"
            label="Doc's Prediction"
            wrapped
            {...a11yProps('one')}
          />
          <Tab value="two" label="Day Trades" {...a11yProps('two')} />
          <Tab value="three" label="EODs" {...a11yProps('three')} />
          <Tab value="four" label="Options" {...a11yProps('four')}/>
          <Tab value="five" label="Swings" {...a11yProps('five')}/>
          <Tab value="six" label="Dividends" {...a11yProps('six')}/>
          <Tab value="seven" label="Shorts" {...a11yProps('seven')}/>
        </Tabs>
      </AppBar>
      <Call>
      <TabPanel value={value} index="one">
        <CallTable/>
      </TabPanel>
      <TabPanel value={value} index="two">
      <CallTable/>
      </TabPanel>
      <TabPanel value={value} index="three">
      <CallTable/>
      </TabPanel>
      <TabPanel value={value} index="four">
      <CallTable/>
      </TabPanel>
      <TabPanel value={value} index="five">
      <CallTable/>
      </TabPanel>
      <TabPanel value={value} index="six">
      <CallTable/>
      </TabPanel>
      <TabPanel value={value} index="seven">
      <CallTable/>
      </TabPanel>
      </Call>
    </div>
  );
}

