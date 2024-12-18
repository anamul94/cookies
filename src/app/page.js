import Navbar from './components/Navbar';
import Package from './components/package';
import { API_BASE_URL } from '../app/constants/api';

async function getPackages() {
  try {
    const res = await fetch(`${API_BASE_URL}/packages`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch packages');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

export default async function Home() {
  const packages = await getPackages();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Packages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Package key={pkg.id} {...pkg} />
          ))}
        </div>
      </div>
    </main>
  );
}
  