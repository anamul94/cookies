'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#2563EB]">
            <div className="max-w-7xl max-h-50 mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Cookie</h3>
                        <p className="text-blue-100 text-sm">
                            Empowering businesses with innovative solutions for seamless customer service management.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-blue-100 hover:text-white text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className="text-blue-100 hover:text-white text-sm">
                                    Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/trial" className="text-blue-100 hover:text-white text-sm">
                                    Free Trial
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-blue-100 hover:text-white text-sm">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Developer Info */}
                    <div className="">
                        <h3 className="text-white text-2xl font-bold mb-4">Developer</h3>
                        <p className="text-blue-100 text-base mb-2">
                            Developed by{" "}
                            <span className="text-white font-semibold">Anamul Haque</span>
                        </p>
                        {/* Contact Links */}
                        <div className="flex flex-col space-y-3 mt-4">
                            <a
                                href="https://github.com/anamul94"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors duration-300"
                            >
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.302 3.438 9.8 8.207 11.387.6.11.82-.26.82-.577v-2.155c-3.338.726-4.043-1.61-4.043-1.61-.546-1.385-1.332-1.753-1.332-1.753-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.805 1.304 3.49.997.108-.775.42-1.305.762-1.605-2.665-.303-5.466-1.333-5.466-5.933 0-1.31.467-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.53 11.53 0 013.003-.404c1.02.005 2.045.137 3.003.404 2.295-1.552 3.297-1.23 3.297-1.23.648 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.478 5.92.43.372.813 1.102.813 2.222v3.293c0 .318.217.694.825.577C20.565 22.095 24 17.599 24 12.297 24 5.67 18.627.297 12 .297z" />
                                    </svg>
                                </span>
                                <span>GitHub</span>
                            </a>

                            <a
                                href="https://www.linkedin.com/in/md-anamul-haque94/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors duration-300"
                            >
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20.447 20.452h-3.554v-5.568c0-1.328-.026-3.042-1.855-3.042-1.856 0-2.141 1.45-2.141 2.949v5.661h-3.549V9h3.414v1.561h.048c.476-.9 1.635-1.849 3.366-1.849 3.601 0 4.267 2.37 4.267 5.452v6.288zM5.337 7.433c-1.145 0-2.072-.927-2.072-2.072S4.192 3.289 5.337 3.289s2.072.927 2.072 2.072-0.927 2.072-2.072 2.072zM7.119 20.452H3.558V9h3.561v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.547C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.274V1.727C24 .774 23.2 0 22.225 0z" />
                                    </svg>
                                </span>
                                <span>LinkedIn</span>
                            </a>

                            <a
                                href="mailto:example@email.com"
                                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors duration-300"
                            >
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.326-8-5.326V6h16zM4 18V9.489l7.386 4.91a1 1 0 001.228 0L20 9.489V18H4z" />
                                    </svg>
                                </span>
                                <span>Email: anamul.ice14@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-blue-500">
                    <p className="text-center text-blue-100 text-sm">
                        © {new Date().getFullYear()} Cookie. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
