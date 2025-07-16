import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import useUserRole from "../../hooks/useUserRole";

const Header = () => {
  const { isSignedIn } = useUser();
  const { role } = useUserRole();

  // const isAdmin = user?.role === "admin";
  // console.log("user role : ", user?.publicMetadata?.role);
  // console.log("isadmin : ", isAdmin);

  return (
    <header className="fixed w-[100%] z-100 flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-slate-800 to-slate-950 ">
      <Link
        to="/"
        className="text-2xl font-bold text-indigo-100 hover:text-indigo-200 transition"
      >
        ⚡CODE GUNIE
      </Link>

      <nav className="flex items-center gap-4">
        <div className="flex gap-4 items-center">
          {isSignedIn && role === "admin" && (
            <Link
              to="/add-problem"
              className="text-sm px-4 py-2 text-white rounded font-bold hover:underline "
            >
              Add Problem
            </Link>
          )}
        </div>

        <Link to="/" className="text-white font-medium">
          Home
        </Link>

        <SignedIn>
          {/* Optionally show a user avatar */}
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="z-100 px-4 py-1 text-white font-bold cursor-pointer">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </nav>
    </header>
  );
};

export default Header;
