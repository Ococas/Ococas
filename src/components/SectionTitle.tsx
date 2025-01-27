import React from 'react';
import { Wine } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  icon?: React.ReactNode;
}

export function SectionTitle({ title, icon = <Wine className="w-6 h-6" /> }: SectionTitleProps) {
  return (
    <motion.div 
      className="flex flex-col items-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="flex items-center gap-4 mb-4"
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-red-600/50" />
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-red-600/50" />
      </motion.div>
      <h2 className="text-4xl font-serif text-center relative">
        {title}
        <motion.div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-red-600/20"
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </h2>
    </motion.div>
  );
}