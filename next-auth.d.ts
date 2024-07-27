// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    // Adding the new field to the User interface
    interface User extends DefaultUser {
        admin: boolean;
    }

    // // Here I add the user object to the session object so I can access it easily.
    interface Session extends DefaultSession {
        user: User;
    }
}