import React from "react";
import Breadcrumb from "../common/Breadcrumb";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Charges",
    },
];

const Expenses: React.FC = () => {
    return (
        <>
            <Breadcrumb title="Charges" items={bCrumb} />
            {'Expenses'}
        </>
    );
};

export default Expenses;
