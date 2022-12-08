import React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
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
      {value === index && (
        <Box sx={{ width: "100%", height: 300 }}>{children}</Box>
      )}
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
      name: "22/10",
      uv: 1,
    },
    {
      name: "Page B",
      uv: 2,
    },
    {
      name: "Page C",
      uv: 4,
    },
    {
      name: "Page D",
      uv: 1,
    },
    {
      name: "Page E",
      uv: 3,
    },
    {
      name: "Page F",
      uv: 4,
    },
    {
      name: "Page G",
      uv: 5,
    },
  ];

  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
        Analytics
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="GET" {...a11yProps(0)} />
            <Tab label="GET Single" {...a11yProps(1)} />
            <Tab label="PUT" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <p>rrkjrk</p>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <p>jrkjrk</p>
        </TabPanel>
      </Box>
    </CustomModal>
  );
};

export default ViewAnalytics;
