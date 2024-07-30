"use server";

import sha256 from "crypto-js/sha256";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function Pay(price: number) {
    const totalPrice = Number(price);
    const transactionId = uuidv4();
    const payload = {
        merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
        merchantTransactionId: transactionId,
        merchantUserId: "MUID123",
        amount: totalPrice * 100,
        redirectUrl: `http://localhost:3000/${transactionId}`,
        redirectMode: "REDIRECT",
        mobileNumber: 123,
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const checksum =
        sha256(base64Payload + "/pg/v1/pay" + process.env.NEXT_PUBLIC_SALT_KEY) +
        "###" +
        process.env.NEXT_PUBLIC_SALT_INDEX;

    const options = {
        method: "POST",
        url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
        },
        data: {
            request: base64Payload,
        },
    };

    const response = await axios.request(options);
    if (response.data.code == "PAYMENT_INITIATED") {
        console.log("Response:", response.data.data)
    }
    console.log("Data: ",response.data)
    const redirectURL = response.data.data.instrumentResponse.redirectInfo.url;
    return redirectURL;
}

export async function checkPaymentStatus(trID: string) {
    trID = "c59dffaf-1ba0-477c-9327-04fd90cfe807"
    try {
        const checksum =
            sha256(
                `/pg/v1/status/${process.env.NEXT_PUBLIC_MERCHANT_ID}/${trID}` +
                process.env.NEXT_PUBLIC_SALT_KEY
            ) +
            "###" +
            process.env.NEXT_PUBLIC_SALT_INDEX;
        const options = {
            method: "GET",
            url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${process.env.NEXT_PUBLIC_MERCHANT_ID}/${trID}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": process.env.NEXT_PUBLIC_MERCHANT_ID,
            },
        };
        const response = await axios.request(options);
        console.log(response.data)
        if (response.data.code == "PAYMENT_SUCCESS") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
