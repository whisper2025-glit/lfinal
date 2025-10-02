'use client'

import qs from 'query-string'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/companion'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface CategoriesProps {
  data: Category[]
}

export const Categories: React.FC<CategoriesProps> = ({ data }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = searchParams.get('categoryId')

  const onClick = (id: string | undefined) => {
    const query = { categoryId: id }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true },
    )

    router.push(url)
  }

  return (
    <div className="w-full overflow-x-auto space-x-2 flex p-1">
      <button
        onClick={() => onClick(undefined)}
        className={cn(
          `
          flex
          items-center
          text-center
          text-xs
          md:text-sm
          px-2
          md:px-4
          py-2
          md:py-3
          rounded-md
          bg-primary/10
          hover:opacity-75
          transition
          `,
          !categoryId ? 'bg-primary/25' : 'bg-primary/10',
        )}
      >
        Newest
      </button>
      {data.map((category) => (
        <button
          onClick={() => onClick(category.id)}
          key={category.id}
          className={cn(
            `
            flex
            items-center
            text-center
            text-xs
            md:text-sm
            px-2
            md:px-4
            py-2
            md:py-3
            rounded-md
            bg-primary/10
            hover:opacity-75
            transition
            `,
            category.id === categoryId ? 'bg-primary/25' : 'bg-primary/10',
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
