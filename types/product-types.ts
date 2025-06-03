export interface IProduct {
    id: number,
    sku: string,
    name: string,
    totalQuantity: number,
    categoryName: string
}

export interface IProductCard {
    id: number,
    sku: string,
    name: string,
    totalQuantity: number,
    categoryName: string
}


export interface IAddProductForm {
    sku: string;
    productName: string;
    categoryId: string | null;
}

export interface ITransaction {
    id: number,
    productName: string,
    organizationName: string,
    quantity: number,
    price: number,
    date: string,
    type: string,
    detail: string,
    isSuccessfull: boolean
}

export interface ITransactionResponse {
    data: ITransaction[], 
    message: string, 
    pageNumber: number, 
    pageSize: number, 
    status: string, 
    totalCount: number
}


export interface IPagedProductResponse{
    data: IProduct[], 
    message: string, 
    pageNumber: number, 
    pageSize: number, 
    status: string, 
    totalCount: number
}