import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import CustomModal from '../../../components/CustomModal';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
// import { CustomTooltip } from '../../../components/CustomChartComponents';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ width: '100%', height: 300 }}>{children}</Box>}
    </div>
  );
};

const ViewAnalytics = ({ open, setOpen }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const data = [
    {
      date: '22/10',
      requests: 1,
    },
    {
      date: '23/10',
      requests: 2,
    },
    {
      date: '24/10',
      requests: 4,
    },
    {
      date: '25/10',
      requests: 1,
    },
    {
      date: '26/10',
      requests: 3,
    },
    {
      date: '27/10',
      requests: 4,
    },
    {
      date: '28/10',
      requests: 5,
    },
  ];

  const tabData = [
    {
      method: 'GET',
      data: data,
      color: '#82ca9d',
    },
    {
      method: 'GET Single',
      data: data,
      color: '#A798FF',
    },
    {
      method: 'POST',
      data: data,
      color: '#FF9777',
    },
    {
      method: 'PUT',
      data: data,
      color: '#2499EF',
    },
    {
      method: 'DELETE',
      data: data,
      color: '#3f51b5',
    },
  ];

  return (
    <CustomModal open={open} setOpen={setOpen} width={600} title="Analytics">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="method analytics">
            {tabData.map((tab, idx) => (
              <Tab label={tab.method} {...a11yProps(idx)} key={idx} />
            ))}
          </Tabs>
        </Box>
        {tabData.map((tab, idx) => (
          <TabPanel value={value} index={idx} key={idx} style={{ marginTop: '10px' }}>
            <ResponsiveContainer>
              <BarChart data={tab.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey="requests" fill={tab.color} />
              </BarChart>
            </ResponsiveContainer>
          </TabPanel>
        ))}
      </Box>
    </CustomModal>
  );
};

export default ViewAnalytics;
