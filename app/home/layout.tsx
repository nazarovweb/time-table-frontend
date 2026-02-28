import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
                {children}
            </main>
            <Toast />
        </div>
    );
}
