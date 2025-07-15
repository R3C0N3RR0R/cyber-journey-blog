import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => a.localeCompare(b, 'fr'))
  return (
    <>
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Tous les tags</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Explorez les thématiques abordées sur le blog. Cliquez sur un tag pour découvrir tous les articles associés.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedTags.length === 0 && (
            <div className="col-span-full text-center text-gray-500">Aucun tag trouvé.</div>
          )}
          {sortedTags.map((t) => (
            <Link
              key={t}
              href={`/tags/${slug(t)}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-md hover:shadow-xl transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Voir les articles tagués ${t}`}
            >
              <span className="inline-block px-4 py-2 mb-2 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white text-lg font-semibold shadow group-hover:scale-105 transition-transform">
                {t.split('-').join(' ')}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {tagCounts[t]} article{tagCounts[t] > 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
