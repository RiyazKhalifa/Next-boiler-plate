'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLoader } from '@/contexts/LoaderContext'

export default function GlobalLoader() {
    const { t } = useTranslation()
    const { loading } = useLoader()

    if (!loading) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(255,255,255,0.8)] backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="dot" />
                    <span className="dot dot-delay-1" />
                    <span className="dot dot-delay-2" />
                </div>

                <p className="text-CharredBrown font-medium text-lg">
                    {t('common.loader_text') || 'Loading...'}
                </p>
            </div>
            <style jsx>{`
                .dot {
                    width: 10px;
                    height: 10px;
                    background-color: #333; /* Default color, adjust as needed */
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .dot-delay-1 {
                    animation-delay: -0.32s;
                }
                .dot-delay-2 {
                    animation-delay: -0.16s;
                }
                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                    }
                    40% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    )
}
