import logo from "../assets/logo.png";
export function Footer() {
  return (
    <footer className="bg-[var(--color-background)] rounded-lg shadow-sm m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href=""
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-8" alt="News Portal Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-[var(--color-text)]">
              News Portal
            </span>
          </a>

          <ul className="flex flex-col md:flex-row items-center text-center mb-6 text-sm font-medium text-[var(--color-text)] sm:mb-0">
            <li>
              <a href="#" className="hover:underline mx-2">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline mx-2">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline mx-2">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline mx-2">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        <span className="block text-sm text-[var(--color-accent)] sm:text-center">
          © {new Date().getFullYear()}{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            News Portal
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
