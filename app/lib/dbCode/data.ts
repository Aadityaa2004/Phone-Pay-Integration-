import { revalidatePath } from "next/cache"
import { GetSession, IsAdmin } from "../auth/auth"
import clientPromise from "./db"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { DeleteS3 } from "./s3"
import { checkPaymentStatus } from "../utils/pay"

export async function clidb(name: string) {
    const cl = await clientPromise
    return (await cl.db()).collection(name)
}

export async function GetTransaction() {
    const db = await clidb("Transactions")
    const user = await GetSession()
    if (user?.user.admin) {
        return JSON.stringify(db.find({}).sort({ _id: -1 }).toArray())
    } else {
        return JSON.stringify(db.find({ userId: user?.user.email }).sort({ _id: -1 }).toArray())
    }
}

export async function GetUserDetails(email: string) {
    const db = await clidb("users")
    return JSON.stringify(db.findOne({ email:email }))
}

export async function UpdateUserDetails(data: {
    email: string,
    name: string,
    phone: string,
    address: string
}) {
    const db = await clidb("users")
    await db.findOneAndUpdate({ email: data.email }, { $set: { name: data.name, phone: data.phone, address: data.address } })
}

export async function GetItems() {
    const db = await clidb("Items")
    return JSON.stringify(db.find({}).sort({ _id: -1 }).toArray())
}

export async function NewItem(data: {
    productName: string,
    price: number,
    details: string,
    images: string[]
}) {
    if (await IsAdmin()) {
        const db = await clidb("Items")
        await db.insertOne({ productName: data.productName, price: data.price, details: data.details, images: data.images })
        revalidatePath('/')
        redirect('/dashboard')
    }
}

export async function EditItem(data: {
    productName: string,
    price: number,
    details: string,
    _id: string
    images: string[]
}) {
    if (await IsAdmin()) {
        const db = await clidb("Items");
        await db.updateOne({ _id: new ObjectId(data._id) }, { $set: { productName: data.productName, price: data.price, details: data.details, images: data.images } });
        revalidatePath('/');
        redirect('/dashboard');
    }
}

export async function DeleteItem(data: {
    _id: string,
    images: string[]
}) {
    if (await IsAdmin()) {
        const db = await clidb("Items");
        const item = await db.findOne({ _id: new ObjectId(data._id) });
        if (item) {
            // Delete images from AWS S3
            for (const image of data.images) {
                await DeleteS3(image);
            }
            // Delete item from database
            await db.deleteOne({ _id: new ObjectId(data._id) });
            revalidatePath('/');
            redirect('/dashboard');
        }
    }
}

export async function GetOrder() {
    const db = await clidb("Orders");
    const user = await GetSession();
    if (user?.user.admin) {
        return JSON.stringify(db.find({}).sort({ _id: -1 }).toArray());
    } else {
        return JSON.stringify(db.find({ userId: user?.user.email }).sort({ _id: -1 }).toArray());
    }
}

export async function NewOrder(data: {
    userId: string,
    productId: string,
    quantity: number,
    amount: number,
    transactionId: string,
    placed: boolean,
    address: string,
    paymentStatus: boolean,
    deliveryStatus: boolean,
    tracking_id: string,
    placedAt: string
    deliveryPartner: string
}) {
    const db = await clidb("Orders");
    await db.insertOne({
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
        transactionId: data.transactionId,
        placed: data.placed,
        address: data.address,
        amount: data.amount,
        paymentStatus: data.paymentStatus,
        deliveryStatus: data.deliveryStatus,
        tracking_id: data.tracking_id,
        placedAt: data.placedAt,
        deliveryPartner: data.deliveryPartner
    });
    revalidatePath('/');
    redirect('/');
}

export async function CreateTransaction(data: {
    amount: number,
    transactionId: string,
}) {
    const status = await checkPaymentStatus(data.transactionId)
    const db = await clidb("Transactions")
    const user = await GetSession()
    await db.insertOne({
        userId: user?.user.email,
        amount: data.amount,
        transactionId: data.transactionId,
        status: status,
        createdAt: new Date().toISOString()
    })
    return status
}

export async function EditOrder(data: {
    userId: string,
    _id: string,
    productId: string,
    quantity: number,
    transactionId: string,
    placed: boolean,
    address: string,
    amount: number,
    paymentStatus: boolean,
    deliveryStatus: boolean,
    tracking_id: string,
    placedAt: string
    deliveryPartner: string
}) {
    const db = await clidb("Orders");
    await db.updateOne({ _id: new ObjectId(data._id) }, {
        $set: {
            transactionId: data.transactionId,
            placed: data.placed,
            paymentStatus: data.paymentStatus,
            deliveryStatus: data.deliveryStatus,
            tracking_id: data.tracking_id,
            deliveryPartner: data.deliveryPartner
        }
    });
}

export async function DeleteOrder(id: string) {
    const db = await clidb("Orders");
    await db.deleteOne({ _id: new ObjectId(id) });
}