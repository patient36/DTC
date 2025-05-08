'use client'
import { useRouter } from 'next/navigation'
import { FiInbox, FiClock, FiPlusCircle, FiLock } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { GiTimeBomb } from 'react-icons/gi'
import { useCapsules } from '@/hooks/queries/useCapsules'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/gloabal/Spinner'
import { useAuth } from '@/hooks/auth/useAuth'

const generateParticles = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    moveDistance: Math.random() * 50 + 50,
    duration: Math.random() * 10 + 5,
  }));

const CapsulesPage = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [particles, setParticles] = useState<{ id: number, top: number, left: number, size: number, moveDistance: number, duration: number }[]>([])
  useEffect(() => { setParticles(generateParticles(200)) }, [])

  const { capsulesData, capsulesLoading, capsulesError, capsulesErrorDetail } = useCapsules()

  useEffect(() => {
    if (!capsulesLoading && !isAuthenticated) {
      router.push('/');
    }
    if (!capsulesLoading && capsulesError) {
      const isPaymentRequired = capsulesErrorDetail instanceof Error &&
        capsulesErrorDetail.message === 'Payment required';

      if (isPaymentRequired) {
        router.push('/payment');
      } else {
        console.error('Error fetching capsules:', capsulesErrorDetail);
      }
    }
  }, [capsulesLoading, isAuthenticated, capsulesError, capsulesErrorDetail]);

  if (capsulesError) {
    const isPaymentRequired =
      capsulesErrorDetail instanceof Error &&
      capsulesErrorDetail.message === 'Payment required';

    if (!isPaymentRequired) {
      console.error('Error fetching capsules:', capsulesErrorDetail);
    }

    return null;
  }

  if (capsulesLoading || !isAuthenticated) {
    return <LoadingSpinner />
  }

  const stats = [
    {
      title: 'Delivered Capsules',
      count: capsulesData?.delivered.total || 0,
      description: 'Time messages successfully received from your past',
      icon: <FiInbox className="text-blue-400 text-3xl" />,
      accessible: true,
      route: 'capsules/delivered',
      color: 'from-blue-500/20 to-blue-900/40'
    },
    {
      title: 'Pending Transmission',
      count: capsulesData?.pending.total || 0,
      description: 'Capsules in temporal transit - awaiting delivery date',
      icon: <FiClock className="text-yellow-400 text-3xl" />,
      accessible: false,
      color: 'from-amber-500/20 to-amber-900/40'
    }
  ]

  return (
    <div className="min-h-screen bg-[url('/textures/starfield.jpg')] bg-cover bg-fixed px-6 pt-12">

      <div className="fixed inset-0 overflow-hidden">
        {particles.map(({ id, top, left, size, moveDistance, duration }) => (
          <motion.div
            key={id}
            className="absolute bg-white rounded-full"
            style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
            animate={{ opacity: [0.2, 0.8, 0.2], y: [0, moveDistance] }}
            transition={{ duration, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <GiTimeBomb className="text-5xl text-yellow-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
            Temporal Capsule Network
          </h1>
          <p className="text-gray-400 mt-2">Secure communication across time</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(({ title, count, description, icon, accessible, route, color }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`h-full bg-gradient-to-br ${color} border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all ${accessible ? 'cursor-pointer hover:border-blue-400/50' : ''
                }`}
              onClick={() => accessible && route && router.push(route)}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gray-800/50 backdrop-blur-sm">
                    {icon}
                  </div>
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
                <p className="text-gray-300 text-sm mb-6">{description}</p>
                <div className="mt-auto">
                  <div className="flex items-end justify-between">
                    <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                      {count}
                    </p>
                    {!accessible && (
                      <div className="flex items-center gap-2 text-yellow-400/80 text-xs bg-yellow-900/20 px-3 py-1 rounded-full">
                        <FiLock />
                        <span>Temporal Lock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* New Capsule Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-gradient-to-br from-green-500/10 to-emerald-900/30 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={() => router.push('/capsules/new')}
          >
            <div className="p-6 h-full flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4 p-4 rounded-full bg-emerald-900/20 border border-emerald-400/30"
              >
                <FiPlusCircle className="text-4xl text-emerald-400" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white mb-2">Create New Capsule</h2>
              <p className="text-gray-300 text-sm">
                Send a message through time to your future self
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-amber-500 text-sm"
        >
          <p>Temporal Network v2.4.7 • Secure Time Transmission Protocol</p>
        </motion.div>
      </div>
    </div>
  )
}

export default CapsulesPage