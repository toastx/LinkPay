import React from 'react'
import Image from 'next/image';
import Background from '@/public/desert.jpg'
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function LandingPage() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ['start start', 'end start']
    })
  
    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "150vh"])
  
    return (
      <div  className='h-screen overflow-hidden'>
        <motion.div style={{y}} className='relative h-full'>
            <span className=' text-black flex items-center justify-center h-[60vh] text-[7vw] uppercase text-center leading-none px-8'>Linkpay</span>
          <Image src={Background} fill alt="image" style={{objectFit: "cover", zIndex: -1}}/>
        </motion.div>
      </div>
    )
}