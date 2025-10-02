import { Categories } from '@/components/categories'
import { SearchInput } from '@/components/search-input'
import { Companions } from '@/components/companions'
import { listCategories, listCompanions } from '@/lib/data-store'

import { getTranslator } from 'next-intl/server'

interface RootPageProps {
  params: {
    locale: string
  }
  searchParams: {
    categoryId?: string
    name?: string
  }
}

const RootPage = async ({
  params: { locale },
  searchParams,
}: RootPageProps) => {
  const data = listCompanions({
    categoryId: searchParams.categoryId,
    name: searchParams.name,
  })

  const t = await getTranslator(locale, 'common')

  const categories = listCategories()

  return (
    <div className="h-full p-4 space-y-2">
      <h1>{t('welcome', { firstname: 'Friend' })}</h1>
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  )
}

export default RootPage
