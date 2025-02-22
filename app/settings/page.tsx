import SettingsOptions from "@/components/setting-options";

export async function generateMetadata() {
    return { title: "Settings - Nextflix" };
}

export default async function SettingsPage() {
    return (
        <main className="p-4">
            <h1 className="text-3xl font-semibold">Settings</h1>
            <SettingsOptions />
        </main>
    )
}