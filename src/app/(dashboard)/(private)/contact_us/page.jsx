import ContactList from '@/views/apps/contact/list'
import { getContactData, viewContactData, replyToContactData } from '@/app/server/actions/contact'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('contacts');

const ContactListApp = async () => {
    return (
        <Can permission='contact.list' showUnauthorized={true}>
            <ContactList
                viewGetContactData={viewContactData}
                replyToContactData={replyToContactData}
            />
        </Can>
    )
}

export default ContactListApp
