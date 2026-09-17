import LogoutButton from '../(auth)/logout-button';

export default function DashboardNavbar() {
    return (
        <nav className="flex items-center justify-between border-b px-6 py-4">
            <h1 className="text-xl font-bold">BoardFlow</h1>

            <LogoutButton />
        </nav>
    );
}
