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
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <Link
        to="/"
        className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
      >
        ⚡ CODE GUNIE
      </Link>

      <nav className="flex items-center gap-4">
        <div className="flex gap-4 items-center">
          {isSignedIn && role === "admin" && (
            <Link
              to="/add-problem"
              className="text-sm px-4 py-2 text-slate-950 rounded font-bold hover:underline "
            >
              Add Problem
            </Link>
          )}
        </div>

        <Link
          to="/"
          className="text-gray-700 hover:text-indigo-600 font-medium"
        >
          Home
        </Link>

        <SignedIn>
          {/* Optionally show a user avatar */}
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </nav>
    </header>
  );
};

export default Header;
