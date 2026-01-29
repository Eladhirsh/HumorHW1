import { supabase } from '@/lib/supabase';

type HumorTheme = {
  id: number;
  created_datetime_utc: string;
  name: string;
  description: string | null;
};

export default async function Home() {
  const { data: themes, error } = await supabase
    .from('humor_themes')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-red-500">Error loading themes</h1>
        <p className="mt-4 text-gray-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 md:p-24">
      <h1 className="text-4xl font-bold mb-8">Humor Themes</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {themes?.map((theme: HumorTheme) => (
          <div
            key={theme.id}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{theme.name}</h2>
            {theme.description && (
              <p className="mt-2 text-gray-600">{theme.description}</p>
            )}
            <p className="mt-4 text-sm text-gray-400">
              Created: {new Date(theme.created_datetime_utc).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {(!themes || themes.length === 0) && (
        <p className="text-gray-500">No themes found.</p>
      )}
    </main>
  );
}
