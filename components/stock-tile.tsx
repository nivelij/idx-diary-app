'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface StockData {
  ticker: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  potential_range: string
}

export function StockTile({ stock }: { stock: StockData }) {
  const isATH = stock.potential_range === 'ATH'
  const hasRange = stock.potential_range && stock.potential_range !== ''

  const getBorderAndBgClasses = () => {
    if (stock.sentiment === 'bullish') {
      return 'border-bullish/30 bg-bullish/10'
    } else if (stock.sentiment === 'bearish') {
      return 'border-bearish/30 bg-bearish/10'
    } else {
      return 'border-neutral/30 bg-neutral/10'
    }
  }

  const getTextColorClass = () => {
    if (stock.sentiment === 'bullish') {
      return 'text-bullish-foreground'
    } else if (stock.sentiment === 'bearish') {
      return 'text-bearish-foreground'
    } else {
      return 'text-neutral-foreground'
    }
  }

  const renderIcon = () => {
    if (stock.sentiment === 'bullish') {
      return <TrendingUp className={`h-4 w-4 ${getTextColorClass()}`} />
    } else if (stock.sentiment === 'bearish') {
      return <TrendingDown className={`h-4 w-4 ${getTextColorClass()}`} />
    } else {
      return <Minus className={`h-4 w-4 ${getTextColorClass()}`} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border-2 p-3 transition-all ${getBorderAndBgClasses()}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {renderIcon()}
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
          <span className={`text-xs font-medium ${getTextColorClass()}`}>
            {stock.potential_range}
          </span>
        </div>
      )}
    </motion.div>
  )
}
