import Nav from "../../components/Navbar"
import { Outlet } from "react-router-dom"

const PrimaryLayout = () => {
    return (
        <main className="flex flex-col h-screen">
            <Nav />
            <div className="flex-1 flex flex-col">
                <Outlet />
            </div>
        </main>
    )
}

export default PrimaryLayout;