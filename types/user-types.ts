export interface IUser {
    id: number,
    fullName: string,
    email: string,
    phoneNumber: string,
    currency: string,
    receiveEmail: boolean,
    receiveLowStockAlert: boolean,
    userType: string
}