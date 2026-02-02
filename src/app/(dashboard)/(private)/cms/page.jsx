import CmsList from '@views/apps/cms/list'
import { viewCmsData, updateCms } from '@/app/server/actions/cms'
import Can from '@/libs/can'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('cms');

const CmsListApp = async () => {
    return (
        <Can permission='cms.list' showUnauthorized={true}>
            <CmsList viewCmsByIdData={viewCmsData} updateCmsPages={updateCms} />
        </Can>
    )
}

export default CmsListApp
