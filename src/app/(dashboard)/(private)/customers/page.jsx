import CustomerList from '@views/apps/customer/list'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('customers');

const CustomerListApp = async () => {
    return (
        <Can permission='customer.list' showUnauthorized={true}>
            <CustomerList />
        </Can>
    )
}

export default CustomerListApp
