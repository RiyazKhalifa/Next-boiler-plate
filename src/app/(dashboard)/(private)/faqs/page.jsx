import FaqList from '@/views/apps/faq/list'
import { createFaq, viewFaqData, updateFaq } from '@/app/server/actions/faq'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('faqs');

const FaqListApp = async () => {
    return (
        <Can permission='faq.list' showUnauthorized={true}>
            <FaqList
                addFaq={createFaq}
                viewGetFaqData={viewFaqData}
                showEditRecords={updateFaq}
            />
        </Can>
    )
}

export default FaqListApp
