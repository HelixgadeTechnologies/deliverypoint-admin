import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background-light font-display">
      <div className="w-full max-w-lg text-center">
        <div className="relative w-full h-48 mb-8 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300"></div>
          <div className="truck-animation absolute bottom-1">
            <div className="relative w-32 h-20 bg-primary rounded-lg">
              <div className="absolute top-2 left-2 w-12 h-10 bg-white rounded"></div>
              <div className="absolute -bottom-4 left-4 w-8 h-8 bg-gray-800 rounded-full border-4 border-gray-300"></div>
              <div className="absolute -bottom-4 right-4 w-8 h-8 bg-gray-800 rounded-full border-4 border-gray-300"></div>
            </div>
          </div>
          {/* delivery box icon */}
          {/* <div className="box-animation absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-amber-500 rounded-lg shadow-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </div>
          </div> */}
        </div>
        <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Page not found.
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Looks like the delivery truck couldn&apos;t find this address. Let&apos;s get you back on the right road.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary/90 transition-colors duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}