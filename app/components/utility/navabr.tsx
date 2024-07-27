// "use client";
// import { useSession } from "next-auth/react"

const NavBar = () => {
    // const { data: session, status } = useSession()

    return (
        <div className="fixed bg-slate-100 w-full h-20">
            <div className="w-full flex justify-around items-center h-full">
                <div>Item</div>
                <div>Item</div>
                <div>Item</div>
            </div>
        </div>
    );
};

export default NavBar;