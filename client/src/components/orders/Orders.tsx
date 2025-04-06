import React from "react";

interface OrdersProps {
    type: string;
}

const Orders: React.FC<OrdersProps> = ({type}) => {
    return (
        <>{'Orders ' + type}</>
    );
};

export default Orders;
