import React from "react";
import Breadcrumb from "../common/Breadcrumb";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Commande",
    },
];

interface OrdersProps {
    type: string;
}

const Orders: React.FC<OrdersProps> = ({type}) => {
    return (
        <>
            <Breadcrumb title={type} items={bCrumb} />
            {'Orders ' + type}
        </>
    );
};

export default Orders;
