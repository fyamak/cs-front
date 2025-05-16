export interface IOrganization {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface IAddOrganizationForm {
    name: string;
    email: string;
    phone: string;
    address: string;
}