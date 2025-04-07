import React from "react";
import Breadcrumb from "../common/Breadcrumb";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Products",
    },
];

const Products: React.FC = () => {
    return (
        <>
            <Breadcrumb title="Products" items={bCrumb} />
            {'Products'}
        </>
    );
};

export default Products;
