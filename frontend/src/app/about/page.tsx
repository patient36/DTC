import React from "react";

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Welcome to our Digital Time Capsule platform! We are dedicated to
                    helping you preserve and share your most cherished memories, thoughts,
                    and aspirations with the future. Our platform allows you to create
                    personalized time capsules that can be securely stored and opened at
                    a specific date or shared with loved ones.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Whether it's a message to your future self, a collection of photos
                    and videos, or a heartfelt letter to someone special, our platform
                    ensures your memories are safe and accessible when the time is right.
                    Join us in creating a bridge between the present and the future.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    Thank you for trusting us to safeguard your stories. Together, let's
                    make history personal and meaningful.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;