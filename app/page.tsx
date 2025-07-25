import Dashboard from './components/Dashboard';

export default function HomePage() {
  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Status Armazém</h1>
          <p className="text-lg text-gray-500">Visão geral da programação de giro e estoque.</p>
        </header>

        <Dashboard />

      </div>
    </main>
  );
}