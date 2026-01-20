'use client'

import { useState, useEffect } from 'react'
import { LoginGate } from '@/components/login-gate'
import { DiaryCarousel } from '@/components/diary-carousel'
import { BookOpen } from 'lucide-react'
import DiaryEntry from '@/components/diary-entry' // Declare the DiaryEntry variable

interface StockData {
  ticker: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  potential_range: string
}

interface DiaryEntryData {
  date: string
  summary: string[]
  stocks: StockData[]
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntryData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check session storage on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('isAuthenticated') === 'true'
    if (isAuth) {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDiaryEntries()
    }
  }, [isAuthenticated])

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
  }

  const fetchDiaryEntries = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/diary-entries')
      if (!response.ok) {
        throw new Error('Failed to fetch diary entries')
      }
      const data = await response.json()
      setDiaryEntries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching diary entries:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <LoginGate onSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                IDX - Daily Summary
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">Error: {error}</p>
            <button
              onClick={fetchDiaryEntries}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && diaryEntries.length > 0 && (
          <DiaryCarousel entries={diaryEntries} />
        )}

        {!isLoading && !error && diaryEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No diary entries found</p>
          </div>
        )}
      </main>
    </div>
  )
}
