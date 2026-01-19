'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

interface StockData {
  ticker: string
  sentiment: 'bullish' | 'bearish'
  potential_range: string
}

export function StockTable({ stocks }: { stocks: StockData[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ticker
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sentiment
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Potential Range
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, idx) => {
            const isBullish = stock.sentiment === 'bullish'
            const isATH = stock.potential_range === 'ATH'

            return (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-semibold text-sm text-foreground">
                    {stock.ticker}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {isBullish ? (
                    <Badge className="bg-bullish text-bullish-foreground border-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 w-fit">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Bullish
                    </Badge>
                  ) : (
                    <Badge className="bg-bearish text-bearish-foreground border-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 w-fit">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Bearish
                    </Badge>
                  )}
                </td>
                <td className="py-3 px-4">
                  {isATH ? (
                    <Badge className="bg-ath-badge text-ath-foreground border-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 w-fit">
                      <Crown className="h-3 w-3" />
                      ATH
                    </Badge>
                  ) : (
                    <span className="text-sm text-foreground">
                      {stock.potential_range}
                    </span>
                  )}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
