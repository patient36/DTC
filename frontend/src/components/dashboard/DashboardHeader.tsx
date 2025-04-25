import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  name: string;
}

export const DashboardHeader = ({ name }: DashboardHeaderProps) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center"
  >
    <h1 className="text-4xl font-bold mb-2">
      Welcome, <span className="text-cyan-400">{name}</span>
    </h1>
    <p className="text-gray-300">Digital Time Capsule Dashboard</p>
  </motion.header>
);