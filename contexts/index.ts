import * as React from "react";
import { Wallet } from "../modules";
export const WalletContext = React.createContext<Wallet | null>(null);
export const ScreenContext = React.createContext<string | null>(null);
