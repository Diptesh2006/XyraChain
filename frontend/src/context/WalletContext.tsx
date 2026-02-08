import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface WalletContextType {
    account: string | null;
    provider: ethers.BrowserProvider | null;
    connectWallet: () => Promise<void>;
    isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    const checkConnection = async () => {
        if (window.ethereum) {
            try {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.listAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0].address);
                    setProvider(browserProvider);
                }
            } catch (err) {
                console.error("Error checking wallet connection:", err);
            }
        }
    };

    useEffect(() => {
        checkConnection();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount(null);
                    setProvider(null);
                }
            });
        }
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }
        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            setProvider(browserProvider);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    return (
        <WalletContext.Provider value={{ account, provider, connectWallet, isConnected: !!account }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
