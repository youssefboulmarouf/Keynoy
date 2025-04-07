import React from "react";
import Breadcrumb from "../common/Breadcrumb";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Product Types",
    },
];

const ProductTypes: React.FC = () => {
    return (
        <>
            <Breadcrumb title="Product Types" items={bCrumb} />
            {'ProductTypes'}
        </>
    );
};

export default ProductTypes;
