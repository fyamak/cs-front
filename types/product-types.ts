export interface IProduct {
    id: number,
    sku: string,
    name: string,
    totalQuantity: number,
    categoryId: number
}

export interface IProductCard {
    sku: string,
    name: string,
    totalQuantity: number,
    categoryName: string
}


export interface IAddProductForm {
    sku: string;
    productName: string;
    categoryId: string | null;
    isCategoryUpdated: boolean;
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