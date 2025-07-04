import { ActionType, ApiRequest, DataSourceObjects } from "@/models/api"
import { ICustomer } from "@/models/customer"
import { fetchApi } from "./fetchHelper"
import { serverUrl } from "./constants"

async function createCustomer(data: ICustomer) {
  try {
    const newCustomer = await fetchApi<any, ApiRequest>(
      serverUrl,
      {
        method: 'POST',
        body: {
            type: ActionType.create,
            object: DataSourceObjects.customer,
            data
        }
      }
    )
    console.log('Created customer:', newCustomer)
  } catch (error) {
    console.error('Fetch error:', error)
  }
}


async function getCustomers(data: ICustomer, actionType: ActionType) {
  try {
    const customers = await fetchApi<any, ApiRequest>(
      serverUrl,
      {
        method: 'GET',
        body: {
            type: actionType,
            object: DataSourceObjects.customer,
            data
        }
      }
    )
    console.log('customers', customers)
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

export {
    createCustomer,
    getCustomers
}