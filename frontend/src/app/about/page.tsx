"use client"

import React, { useMemo } from "react";
import { motion } from "framer-motion";

const generateParticles = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        moveDistance: Math.random() * 50 + 50,
        duration: Math.random() * 10 + 5,
    }));

const AboutPage: React.FC = () => {
    const particles = useMemo(() => generateParticles(200), []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white flex items-center justify-center p-6">
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

            <div className="relative z-10 max-w-3xl bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Welcome to our Digital Time Capsule platform — a place where moments, dreams, and memories are carefully preserved for the future.
                    We believe that the stories we live today deserve to be experienced again tomorrow, untouched by time.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Our platform empowers you to create secure, personal time capsules containing messages, photos, videos, and thoughts.
                    Set a future date to open your capsule, or share it with loved ones when the time feels right.
                    Whether it's a letter to your future self, a collection of milestones, or words left for someone special — every capsule becomes a bridge across time.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Privacy and security are at the heart of what we do. Your memories are stored with care, encrypted and protected, until the moment you choose to relive them.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    Thank you for allowing us to be a part of your journey. Together, let's turn fleeting moments into lasting legacies.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;