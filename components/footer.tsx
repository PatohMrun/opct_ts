"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
const Footer = () => {

    const pathname = usePathname();

    return ( 
        <footer className="bg-footerbg font-poppins flex justify-center items-center py-2">
            <div className=" my-4 px-6 border-r-2 border-white text-white">
                <h1 className="font-bold">OLDER PERSONS CASH TRANSFER</h1>
                <h2>Government of Kenya</h2>
                <p>Copyright &copy;{new Date().getFullYear()}</p>
            </div>

            <div className="px-6">
                <div className="flex flex-col text-white">
                    <Link href="/" className={`hover:text-secondary my-2 ${pathname === "/" ? "active" : "" }`}>Home</Link>
                    <Link href="/about" className={`hover:text-secondar my-2y ${pathname === "/about" ? "active" : "" }`}>About&nbsp;Us</Link>
                    <Link href="/faqs" className={`hover:text-secondary my-2 ${pathname === "/faqs" ? "active" : "" }`}>FAQs</Link>
                 </div>

            </div>  
        </footer>
     );
}
 
export default Footer;