'use client'
import { useRouter } from 'next/navigation'
import { FiInbox, FiClock, FiPlusCircle, FiAlertCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { GiTimeBomb } from 'react-icons/gi'

const CapsulesPage = () => {
  const router = useRouter()

  const stats = [
    {
      title: 'Delivered Capsules',
      count: 10,
      description: 'Time messages successfully received from your past',
      icon: <FiInbox className="text-blue-400 text-3xl" />,
      accessible: true,
      route: 'capsules/delivered',
      color: 'from-blue-500/20 to-blue-900/40'
    },
    {
      title: 'Pending Transmission',
      count: 5,
      description: 'Capsules in temporal transit - awaiting delivery date',
      icon: <FiClock className="text-yellow-400 text-3xl" />,
      accessible: false,
      color: 'from-amber-500/20 to-amber-900/40'
    }
  ]

  return (
    <div className="min-h-screen bg-[url('/textures/starfield.jpg')] bg-cover bg-fixed px-6 pt-12">
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              y: [`${Math.random() * 50}px`, `${Math.random() * 50 + 50}px`]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
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

        {/* Dashboard Grid */}
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
                        <FiAlertCircle />
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