export interface ICustomer {
    customerId?: string,
    customerType?: CustomerType,
    salutation?: string,
    firstName?: string,
    lastName?: string,
    companyName?: string,
    // displayName?: 
    // currency?: 
    contactInfo?: ICustomerContact
    pan?: string,
    gstin?: string,
    // paymentTerms?:
    billingAddress?: IAddress,
    shippingAddress?: IAddress

}

interface IAddress {
    country?: string,
    street1?: string,
    street2?: string,
    city?: string,
    state?: string,
    pinCode?: string
}


interface ICustomerContact {
    email?: string,
    workPhone?: string,
    mobileNo?: string,
}

export enum CustomerType {
    Business = "Business",
    Individual = "Individual"
}
