import React from "react";
import Breadcrumb from "../common/Breadcrumb";

const bCrumb = [
    {
        to: "/",
        title: "Dashboard",
    }
];

const Dashboard: React.FC = () => {
    return (
        <>
            <Breadcrumb title="Dashboard" items={bCrumb} />
            {'Dashboard'}
        </>
    );
};

export default Dashboard;
