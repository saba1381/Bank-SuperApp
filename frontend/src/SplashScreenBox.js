import { motion } from 'framer-motion';

export default function SplashScreenBox() {
  return (
    <div className='flex justify-center items-center h-screen w-full bg-gradient-to-r from-purple-500 to-blue-200 dark:bg-gradient-to-r'>
      <motion.div
        className='flex gap-2 text-3xl sm:text-5xl font-semibold'
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-700 drop-shadow-sm dark:bg-gradient-to-r'>
          همراه
        </span>
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-800 drop-shadow-sm'>
          بانک
        </span>
      </motion.div>
    </div>
  );
}
