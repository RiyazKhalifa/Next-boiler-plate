import { cookies } from 'next/headers';
import enCommon from '@/../public/locales/en/common.json';
import arCommon from '@/../public/locales/ar/common.json';

const enMetaData = enCommon.metadata;
const arMetaData = arCommon.metadata;

const translations = { en: enMetaData, ar: arMetaData };

export const translateMetadata = async (key, type = 'page') => {
    const cookieStore = await cookies();
    const locale = cookieStore.get('lang')?.value || 'ar';

    const localeMeta = translations[locale] || translations.ar;
    const metadataTitle = localeMeta?.[key] ?? '';

    if (type === 'mainLayout') {
        return {
            title: {
                default: metadataTitle,
                template: `%s - ${metadataTitle}`,
            },
            icons: {
                icon: '/favicon.ico',
            },
        };
    }

    return {
        title: metadataTitle,
    };
};
