
import { Button } from "./ui/button";
import {Briefcase, Home} from "lucide-react";
import Link from "next/link";


export default function NavBar(){
    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 items-center px-4 justify-between ">
                <Link href="/" className="flex items-center gap-2 font-semibold text-primary hover:primary/70 mr-4">
                    <Briefcase /> 
                    Job tracker
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-gray-700 hover:text-black">
                            Log in
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )

}