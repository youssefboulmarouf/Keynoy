import React, {useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Grid, Tabs} from "@mui/material";
import Tab from "@mui/material/Tab";
import {TabContext, TabPanel} from "@mui/lab";
import Box from "@mui/material/Box";
import ColorComponent from "./colors/ColorComponent";
import CityComponent from "./cities/CityComponent";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Configuration",
    },
];

const Configuration: React.FC = () => {
    const [value, setValue] = useState(1);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    return (
        <>
            <Breadcrumb title="Configuration" items={bCrumb} />
            <Grid container mt={3}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Couleurs" value={1} />
                                <Tab label="Villes" value={2} />
                            </Tabs>
                        </Box>
                        <TabPanel value={1}>
                            <ColorComponent/>
                        </TabPanel>
                        <TabPanel value={2}>
                            <CityComponent/>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>
        </>
    );
}

export default Configuration;