"use server"
import { SendMail } from "./nodemailer";

var mailOptions = {
    from: '',
    text: 'A mail',
    to: [""],
    subject: ""
};

export async function FailedOrderMail(data: { transaction_id: string, product_name: string, price: string, quantity: string, total: string, email: string }) {
    mailOptions.to = [data.email, "Owner_mail_id_here"];
    mailOptions.subject = 'Failed Transaction';
    mailOptions.text = `The order was not recieved by us as the payment was not succesful, The Transaction ID: ${data.transaction_id}\nProduct Name: ${data.product_name}\nPrice: ${data.price}\nQuantity: ${data.quantity}\nTotal: ${data.total}`;
    await SendMail(mailOptions);
    return
}

export async function OrderMail(data: { transaction_id: string, product_name: string, price: string, quantity: string, total: string, email: string }) {
    mailOptions.to = [data.email, "Owner_mail_id_here"];
    mailOptions.subject = 'Order Confirmation';
    mailOptions.text = `We have Recieved Your Order, The Transaction ID: ${data.transaction_id}\nProduct Name: ${data.product_name}\nPrice: ${data.price}\nQuantity: ${data.quantity}\nTotal: ${data.total}`;
    await SendMail(mailOptions);
    return
}

export async function UpdateOrderStatus(data: { transaction_id: string, product_name: string, price: string, quantity: string, total: string, email: string }) {
    mailOptions.to = [data.email, "Owner_mail_id_here"];
    mailOptions.subject = 'New Order Status Update';
    mailOptions.text = `There is a new update with your order. Make sure to check your Orders Now!. The Transaction ID: ${data.transaction_id}\nProduct Name: ${data.product_name}\nPrice: ${data.price}\nQuantity: ${data.quantity}\nTotal: ${data.total}`;
    await SendMail(mailOptions);
    return
}