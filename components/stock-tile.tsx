'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface StockData {
  ticker: string
  sentiment: 'bullish' | 'bearish'
  potential_range: string
}

export function StockTile({ stock }: { stock: StockData }) {
  const isBullish = stock.sentiment === 'bullish'
  const isATH = stock.potential_range === 'ATH'
  const hasRange = stock.potential_range && stock.potential_range !== ''

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border-2 p-3 transition-all ${
        isBullish
          ? 'border-bullish/30 bg-bullish/10'
          : 'border-bearish/30 bg-bearish/10'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isBullish ? (
            <TrendingUp className="h-4 w-4 text-bullish-foreground" />
          ) : (
            <TrendingDown className="h-4 w-4 text-bearish-foreground" />
          )}
          <span className="font-bold text-sm text-card-foreground">
            {stock.ticker}
          </span>
        </div>
        
        {isATH && (
          <Badge className="bg-ath-badge text-ath-foreground border-ath-foreground/20 border flex items-center gap-1 text-xs font-semibold">
            <Crown className="h-3 w-3" />
            ATH
          </Badge>
        )}
      </div>

      {hasRange && !isATH && (
        <div className="mt-2">
          <span
            className={`text-xs font-medium ${
              isBullish ? 'text-bullish-foreground' : 'text-bearish-foreground'
            }`}
          >
            {stock.potential_range}
          </span>
        </div>
      )}
    </motion.div>
  )
}
