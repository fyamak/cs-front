export interface ILoginForm{
    email: string,
    password: string
}

export interface IRegisterForm{
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string
}

export interface IUserForm{
    fullName: string,
    phoneNumber: string,
    receiveEmail: boolean,
    receiveLowStockAlert: boolean,
    localCurrency: string
}