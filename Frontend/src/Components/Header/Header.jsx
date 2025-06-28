import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

const Header = () => {
  return (
    <header>
      <SignedIn>
        <div className="flex align-center justify-between w-[100%]">
          <span>Welcome!</span>
          <div>
            <UserButton />
          </div>
          <div>
            <SignOutButton />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <SignInButton />
      </SignedOut>
    </header>
  );
};

export default Header;
