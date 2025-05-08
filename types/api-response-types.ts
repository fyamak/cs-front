import { IProduct } from "./product-types"

export interface IResponse {
    status: string,
    message: string,
    data: any
}

export interface IProductResponse{
    status: string,
    message: string,
    data: IProduct[]
}

export interface IAuthResponse {
    data: {
        accessToken: string,
        expiration: string,
        refreshToken: string
    }
    message: string,
    status: string
}