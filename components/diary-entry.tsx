'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StockTable } from './stock-table'
import { motion } from 'framer-motion'
import { StockTile } from './stock-tile' // Added import for StockTile

interface StockData {
  ticker: string
  sentiment: 'bullish' | 'bearish'
  potential_range: string
}

interface DiaryEntryData {
  date: string
  summary: string[]
  stocks: StockData[]
}

export function DiaryEntry({ entry, index }: { entry: DiaryEntryData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="border shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary mb-1"></div>
              <div className="w-px h-8 bg-primary/30"></div>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {entry.date}
            </h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Summary Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Summary
            </h3>
            <ul className="space-y-2">
              {entry.summary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                  <span className="text-primary mt-1.5">•</span>
                  <span>{item.replace(/^-\s*/, '').trim()}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Stocks Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Stock Insights
            </h3>
            <StockTable stocks={entry.stocks} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default DiaryEntry
