import React from "react";
import {OrderLineJson, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Collapse, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface OrderLinesTableProps {
    openRow: boolean;
    rowToOpen: number;
    rowIndex: number;
    orderLines: OrderLineJson[];
    products: ProductJson[];
    productTypes: ProductTypeJson[];
}

const OrderLinesTable: React.FC<OrderLinesTableProps> = ({openRow, rowToOpen, rowIndex, orderLines, products, productTypes}) => {
    return (
        <Collapse in={openRow && rowToOpen === rowIndex} timeout="auto">
            <Box sx={{ paddingBottom: 2, paddingTop: 2}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography color="info" variant="body1">Id Produit</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="info" variant="body1">Nom Produit</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="info" variant="body1">Type Produit</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="info" variant="body1">Quantite</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="info" variant="body1">Prix Unitaire</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="info" variant="body1">Prix Total</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderLines.map((line) => (
                            <TableRow key={line.orderId + line.productId}>
                                <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                        {line.productId}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                        {products.find(p => p.id === line.productId)?.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                        {productTypes.find(pt => pt.id === products.find(p => p.id === line.productId)?.productTypeId)?.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                        {line.quantity}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                        {line.unitPrice}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                        {line.quantity * line.unitPrice}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Collapse>
    );
}

export default OrderLinesTable;