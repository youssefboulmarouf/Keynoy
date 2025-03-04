import { Request, Response } from "express";

export const getCustomers = (req: Request, res: Response) => {
    console.log("getProducts");
    res.json([{ id: 1, name: "Laptop" }, { id: 2, name: "Phone" }]);
};

export const getCustomerById = (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (productId === 0) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    console.log("getProductById: ", productId);
    res.status(201).json({ message: `Product Id : ${productId}` });
};

export const addCustomer = (req: Request, res: Response) => {
    console.log("addProduct");
    console.log("body: ", req.body);
    res.status(201).json({ message: `Product ${req.body.message} added successfully` });
};

export const updateCustomer = (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (productId === 0) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    console.log("body: ", req.body);
    res.status(201).json({ message: `Product ${req.body.message} updated successfully` });
}

export const deleteCustomer = (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (productId === 0) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    res.status(201).json({ message: `Product ${req.body.message} deleted successfully` });
}
