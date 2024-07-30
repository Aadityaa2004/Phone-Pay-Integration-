import { redirect } from "next/navigation";
import { Pay, checkPaymentStatus } from "./lib/utils/pay";

export default function Home() {
  return (
    <>
      Hello There
      <form action={async () => {
        "use server";
        const url = await Pay(100);
        redirect(url);
      }}>
        <button type="submit">Pay</button>
      
      </form>
    </>
  );
}
