"use server";

import axios from "axios";


const convertToKobo = (naira: number) => {
    return Math.round(naira * 100);
};

const getSecretKey = () => {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) {
        console.error("PAYSTACK_SECRET_KEY is not defined in environment variables");
    }
    return key;
};

export const getBankCodeAction = async (bankName: string): Promise<string | null> => {
    const url = "https://api.paystack.co/bank";

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${getSecretKey()}`,
            },
        });

        const banks = response.data.data;
        const bank = banks.find(
            (b: any) => b.name.toLowerCase() === bankName.toLowerCase()
        );

        return bank ? bank.code : null;
    } catch (error: any) {
        console.error("Paystack Get Banks Error:", error?.response?.data || error);
        throw new Error("Failed to fetch bank list");
    }
};

export const createTransferRecipientAction = async ({
    accountNumber,
    accountName,
    bankCode,
}: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
}) => {
    const url = "https://api.paystack.co/transferrecipient";
    console.log("Secret Key", getSecretKey())
    try {
        const response = await axios.post(
            url,
            {
                type: "nuban",
                name: accountName,
                account_number: accountNumber,
                bank_code: bankCode,
                currency: "NGN",
            },
            {
                headers: {
                    Authorization: `Bearer ${getSecretKey()}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Paystack Create Recipient Error:", error?.response?.data || error);
        throw new Error("Failed to create transfer recipient");
    }
};

export const initiateWithdrawalAction = async ({
    amount,
    recipient,
    reason,
    reference,
}: {
    amount: number;
    recipient: string;
    reason: string;
    reference: string;
}) => {
    const url = "https://api.paystack.co/transfer";

    try {
        const response = await axios.post(
            url,
            {
                source: "balance",
                amount: convertToKobo(amount),
                recipient: recipient,
                reason: reason,
                reference: reference,
            },
            {
                headers: {
                    Authorization: `Bearer ${getSecretKey()}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Paystack Transfer Error:", error?.response?.data || error);
        throw new Error("Withdrawal failed");
    }
};

export const finalizeTransferAction = async ({
    transferCode,
    otp,
}: {
    transferCode: string;
    otp: string;
}) => {
    const url = "https://api.paystack.co/transfer/finalize_transfer";

    try {
        const response = await axios.post(
            url,
            {
                transfer_code: transferCode,
                otp: otp,
            },
            {
                headers: {
                    Authorization: `Bearer ${getSecretKey()}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Paystack Finalize Transfer Error:", error?.response?.data || error);
        throw new Error("Failed to finalize transfer");
    }
};
