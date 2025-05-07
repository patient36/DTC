"use client"
import { useState } from "react";
import { useToken } from "@/hooks/admin/useAdmin";
import { toast } from 'react-toastify'
import { BsClipboard2 } from "react-icons/bs";
import { BsClipboard2Check } from "react-icons/bs";
import { motion } from 'framer-motion'

const TokenCard = () => {
    const { getAdminToken } = useToken();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const handleGetAdminToken = () => {
        getAdminToken(password, {
            onSuccess: ({ token }) => {
                setToken(token), toast.success('Token copied to clipboard'), navigator.clipboard.writeText(token), setTimeout(() => setToken(''), 10000)
            },
            onError: () => {
                toast.error("Failed to generate token")
            }
        });
    };

    const handleCopy = () => {
        if (!token) return;
        navigator.clipboard.writeText(token).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl"
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center text-white tracking-wide">🔐 Admin Token</h2>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    onClick={handleGetAdminToken}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-lg text-white font-medium transition duration-200"
                >
                    Generate Token
                </button>
                {token && (
                    <div className="relative bg-black/30 p-4 rounded-lg border border-white/20 text-sm space-y-3">
                        <pre className="whitespace-pre-wrap break-words">{token.slice(0, 10)}......</pre>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 ${copied ? 'text-cyan-400' : 'text-green-400'} hover:text-white transition absolute top-3 right-3 text-xs`}
                        >
                            {copied ?
                                <BsClipboard2Check className="text-cyan-400" /> : <BsClipboard2 className="text-green-400" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default TokenCard;