import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 pt-20">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-auto-red/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-auto-red" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 font-['Montserrat',sans-serif]">Page Introuvable</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 px-8">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
