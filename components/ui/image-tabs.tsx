"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
    const [activeTab, setActiveTab] = useState("organize");

    return (
        <section className="border-t bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* tabs*/}
                    <div className="flex justify-center gap-4 mb-8">
                        <Button 
                            onClick={() => setActiveTab("organize")} 
                            className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "organize" ? "bg-primary text-white" 
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Organize Aplications</Button>
                        <Button 
                            onClick={() => setActiveTab("get-hired")} 
                            className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "get-hired" ? "bg-primary text-white" 
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Get Hired</Button>
                        <Button 
                            onClick={() => setActiveTab ("manage-boards")} 
                            className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "manage-boards" ? "bg-primary text-white" 
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Manage Boards</Button>
                    </div>
                    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg border-gray-200 shadow-xl">
                        {activeTab === "organize" && (
                            <Image src="/hero-images/hero1.png" alt="Organize Applications" width={1200} height={800} />
                            )}
                        {activeTab === "get-hired" && (
                            <Image src="/hero-images/hero2.png" alt="Get Hired" width={1200} height={800} />
                            )}
                        {activeTab === "manage-boards" && (
                            <Image src="/hero-images/hero3.png" alt="Manage Boards" width={1200} height={800} />
                            )}
                    </div>
                </div>
            </div>
      </section>
    );
}