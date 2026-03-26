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
    disconnectWallet: () => void;
    isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    useEffect(() => {
        if (!window.ethereum) {
            return;
        }

        const browserProvider = new ethers.BrowserProvider(window.ethereum);

        const syncWalletState = async () => {
            try {
                const accounts = await browserProvider.send('eth_accounts', []);
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setProvider(browserProvider);
                } else {
                    setAccount(null);
                    setProvider(null);
                }
            } catch (error) {
                console.error('Error syncing wallet state:', error);
            }
        };

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setProvider(browserProvider);
            } else {
                setAccount(null);
                setProvider(null);
            }
        };

        const handleChainChanged = () => {
            void syncWalletState();
        };

        void syncWalletState();
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener?.('chainChanged', handleChainChanged);
        };
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }
        try {
            await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{
                    eth_accounts: {}
                }]
            });

            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            setProvider(browserProvider);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
    };

    return (
        <WalletContext.Provider value={{ account, provider, connectWallet, disconnectWallet, isConnected: !!account }}>
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
