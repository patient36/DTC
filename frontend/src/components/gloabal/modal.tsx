'use client'

import { FaTimes } from 'react-icons/fa'
import { useEffect } from 'react'

const Modal = ({
    children,
    onClose,
}: {
    children: React.ReactNode
    onClose: () => void
}) => {
    useEffect(() => {
        const modalVideo = document.querySelector('video') as HTMLVideoElement | null

        if (modalVideo) {
            modalVideo.controls = true
        }

        document.querySelectorAll('video').forEach(video => {
            if (video !== modalVideo && !video.paused) {
                video.pause()
            }
        })

        return () => {
            if (modalVideo) {
                modalVideo.controls = false
            }
        }
    }, [])

    return (
        <div className="modal-container z-50 fixed top-0 left-0 min-h-screen w-screen bg-black/70 flex items-center justify-center">
            <button
                className="absolute z-[100] top-4 right-4 p-3 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 cursor-pointer transition duration-200 ease-in-out"
                onClick={onClose}
                title="Close"
            >
                <FaTimes size={20} />
            </button>
            {children}
        </div>
    )
}

export default Modal