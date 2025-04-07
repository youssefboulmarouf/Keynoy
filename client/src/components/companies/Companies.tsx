import React from "react";
import Breadcrumb from "../common/Breadcrumb";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Partenaire",
    },
];

interface CompaniesProps {
    type: string;
}

const Companies: React.FC<CompaniesProps> = ({type}) => {
    return (
        <>
            <Breadcrumb title={type} items={bCrumb} />
            {'Companies ' + type}
        </>
    );
};

export default Companies;
