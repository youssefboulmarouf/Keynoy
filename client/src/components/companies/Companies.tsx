import React from "react";

interface CompaniesProps {
    type: string;
}

const Companies: React.FC<CompaniesProps> = ({type}) => {
    return (
        <>{'Companies ' + type}</>
    );
};

export default Companies;
