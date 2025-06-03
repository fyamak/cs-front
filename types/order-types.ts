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
    productName: string;
    organizationId: number;
    organizationName: string;
    quantity: number;
    price: number;
    date: string;
    type: string;
    isSuccessfull: boolean;
    detail: string;
    createdAt: string;
}

export interface IAddOrderForm{
    selectedProduct: number,
    selectedOrganization: number,
    quantity: number,
    price: string,
    date: string,
    orderType: string | null
}

export interface IOrderHistoryCard{
    productName: string,
    organizationName: string,
    quantity: number,
    price: number,
    type: string,
    isSuccessfull: boolean,
    detail: string
}

export interface IOrderCard {
  id: number,
  productName: string,
  organizationName: string,
  quantity: number,
  price: number,
  date: string,
  type: string
  onApprove: (id: number) => void,
  onReject: (id: number) => void,
  isProcessing: boolean
}