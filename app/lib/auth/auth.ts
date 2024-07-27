"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./authoptions";

export const IsAuthenticated = async () => {
    const session = await getServerSession(authOptions)
    if (session && session.user) {
        return true
    } else {
        return false
    }
}

export async function GetSession() {
    const session = await getServerSession(authOptions)
    return session
}

export const IsAdmin = async () => {
    const session = await getServerSession(authOptions)
    if (session && session.user && session.user.admin == true) return true
    else return false
}

export const AdminPage = async () => {
    if (await IsAdmin()) return true
    else redirect('/')
} 