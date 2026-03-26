/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_CONTRACT_ADDRESS?: string;
    readonly VITE_CHAIN_ID?: string;
    readonly VITE_CHAIN_ID_HEX?: string;
    readonly VITE_CHAIN_NAME?: string;
    readonly VITE_RPC_URL?: string;
    readonly VITE_BLOCK_EXPLORER_URL?: string;
    readonly VITE_NATIVE_CURRENCY_NAME?: string;
    readonly VITE_NATIVE_CURRENCY_SYMBOL?: string;
    readonly VITE_NATIVE_CURRENCY_DECIMALS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare namespace JSX {
    interface IntrinsicElements {
        'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            icon?: string;
            width?: string | number;
            height?: string | number;
            mode?: string;
            style?: React.CSSProperties;
        };
    }
}
