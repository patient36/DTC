'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import Image from 'next/image'
import { FiImage, FiVideo, FiDownload, FiFile } from 'react-icons/fi'
import { formatFileSize } from '@/utils/formatSize'
import { IoMdRefresh } from 'react-icons/io'

interface FileOpenerProps {
  type: string
  path: string
  size: number // Size in bytes
  isInModal?: boolean
}

const FileOpener = forwardRef<HTMLVideoElement, FileOpenerProps>(
  ({ type, path, size, isInModal = false }, ref) => {
    const [key, setKey] = useState(0)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [unsupported, setUnsupported] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
      const isSupported = type.startsWith('image') || type.startsWith('video')
      if (!isSupported) {
        setUnsupported(true)
        setLoading(false)
        return
      }

      if (type.startsWith('video') && videoRef.current) {
        const video = videoRef.current

        if (!isInModal) {
          // Disable video functionality outside modals
          video.controls = false
          video.autoplay = false
          video.muted = true
          video.removeAttribute('controls')
          video.style.pointerEvents = 'none'
        } else {
          // Enable full functionality in modals
          video.controls = true
          video.style.pointerEvents = 'auto'
        }
      }
    }, [type, isInModal])

    const handleRetry = () => {
      setKey(prev => prev + 1)
      setError(false)
      setLoading(true)
    }

    const handleDownload = () => {
      const link = document.createElement('a')
      link.href = path
      link.download = `file.${type.split('/')[1] || 'download'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const isImage = type.startsWith('image')
    const isVideo = type.startsWith('video')
    const fileType = type.split('/')[1]?.toUpperCase() || 'FILE'
    const formattedSize = formatFileSize(size)

    return (
      <div className="relative w-full h-full bg-black/30 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
        {/* Main content area */}
        <div className="relative w-full h-full pt-8 pb-10 bg-black/70 flex items-center justify-center">
          {unsupported ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 p-4">
              <FiFile className="mx-auto text-blue-300" size={32} />
              <p className="text-sm font-medium text-blue-100 mt-2">Unsupported file type</p>
              <p className="text-xs text-blue-300 mt-1">Preview not available</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 p-4">
              <p className="text-sm font-medium text-blue-100">Failed to load content</p>
              <button
                onClick={handleRetry}
                className="px-3 py-1.5 cursor-pointer bg-amber-600/70 hover:bg-amber-600/60 rounded-md text-blue-100 text-xs flex items-center gap-1 transition-colors mt-2"
              >
                <IoMdRefresh />
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center text-blue-300">
                {isImage ? <FiImage size={24} /> : <FiVideo size={24} />}
                <span className="mt-2 text-xs">Loading {fileType}...</span>
              </div>
            </div>
          ) : null}

          {isImage ? (
            <Image
              key={key}
              src={path}
              alt=""
              fill
              className={`object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
              onError={() => {
                setError(true)
                setLoading(false)
              }}
              onLoad={() => setLoading(false)}
            />
          ) : isVideo ? (
            <video
              key={key}
              ref={(el) => {
                videoRef.current = el
                if (typeof ref === 'function') {
                  ref(el)
                } else if (ref) {
                  ref.current = el
                }
              }}
              controls={isInModal}
              playsInline
              muted={!isInModal}
              className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
              onError={() => {
                setError(true)
                setLoading(false)
              }}
              onLoadedData={() => setLoading(false)}
              onClick={(e) => !isInModal && e.preventDefault()}
              onPlay={(e) => !isInModal && (e.target as HTMLVideoElement).pause()}
              disablePictureInPicture
              disableRemotePlayback
            >
              <source src={path} type={type} />
            </video>
          ) : null}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            {isImage ? (
              <FiImage className="text-blue-300 group-hover:text-blue-100 transition-colors" size={14} />
            ) : isVideo ? (
              <FiVideo className="text-blue-300 group-hover:text-blue-100 transition-colors" size={14} />
            ) : (
              <FiFile className="text-blue-300 group-hover:text-blue-100 transition-colors" size={14} />
            )}
            <span className="text-xs text-blue-200 group-hover:text-blue-100 transition-colors">
              {fileType}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-300 group-hover:text-blue-100 transition-colors">
              {formattedSize}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDownload()
              }}
              className="text-blue-300 hover:text-blue-100 transition-colors"
              title="Download"
            >
              <FiDownload size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }
)

FileOpener.displayName = 'FileOpener'
export default FileOpener