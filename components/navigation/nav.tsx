import { auth } from "@/server/auth";
import UserButton from "./user-button";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

async function Nav() {
  const session = await auth();
  //   console.log(user);

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li>
            <Link
              href="/"
              className="text-rose-500 text-2xl font-bold tracking-tight hover:opacity-80 transition-all duration-150"
            >
              SJ<span className="text-orange-500 underline">&tore</span>
            </Link>
          </li>
          {!session ? (
            <li>
              <Button asChild>
                <Link href="/auth/login" className="flex gap-2">
                  <LogIn size={16} /> <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Nav;
