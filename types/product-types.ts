export interface IProduct {
    id: number,
    sku: string,
    name: string,
    totalQuantity: number,
    categoryId: number
}

export interface ICategory{
    id: number,
    name: string
}

export interface IOrder {
    id: number,
    productId: number,
    organizationId: number,
    quantity: number,
    price: number,
    date: string,
    type: string
}

export interface IOrderHistory {
    id: number;
    productId: number;
    organizationId: number;
    quantity: number;
    price: number;
    date: string;
    type: string;
    isSuccessfull: boolean;
    detail: string;
    createdAt: string;
}

export interface ITransaction {
    id: number,
    product: string,
    organization: string,
    type: string,
    price: number,
    quantity: number,
    date: string,
    remainingQuantity: number
}