import { IDesign } from "./design";

enum OrderType {
    Customer = "Customer",
    Stock = "Stock",
    Rework = "Reword"
}

interface IOrder extends IDesign {
    orderId?: string;
    orderType?: OrderType,
    customer?: string,
    orderDate?: string,
    dueDate?: string,
    specialRemarks?: string
}

export {
    OrderType, 
    IOrder
}