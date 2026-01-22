'use client'

import { useState, useRef, useEffect } from 'react'
import { DiaryEntry } from './diary-entry'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Stock {
  ticker: string
  sentiment: 'bullish' | 'bearish'
  potential_range: string
}

interface Entry {
  date: string
  summary: string[]
  stocks: Stock[]
}

interface DiaryCarouselProps {
  entries: Entry[]
}

export function DiaryCarousel({ entries }: DiaryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragConstraints = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, entries.length - 1))
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const cardWidth = containerWidth > 768 ? Math.min(600, containerWidth - 80) : containerWidth - 32
  const gap = 24
  // Center the active card and show peeks on both sides
  const centerOffset = (containerWidth - cardWidth) / 2
  const offset = centerOffset - currentIndex * (cardWidth + gap)

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Navigation Buttons - Desktop */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="rounded-full bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          {entries.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-foreground'
                  : 'w-2 bg-muted-foreground/30'
              }`}
              aria-label={`Go to entry ${index + 1}`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={currentIndex === entries.length - 1}
          className="rounded-full bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Swipe Indicator */}
      <div className="md:hidden mb-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          <ChevronLeft className="h-3 w-3 animate-pulse" />
          <span>Swipe to navigate</span>
          <ChevronRight className="h-3 w-3 animate-pulse" />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden" ref={dragConstraints}>
        <motion.div
          className="flex gap-6"
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{
            left: centerOffset - (entries.length - 1) * (cardWidth + gap),
            right: centerOffset,
          }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            const threshold = 50
            if (info.offset.x < -threshold && currentIndex < entries.length - 1) {
              goToNext()
            } else if (info.offset.x > threshold && currentIndex > 0) {
              goToPrev()
            }
          }}
        >
          {entries.map((entry, index) => {
            const isActive = index === currentIndex
            return (
              <motion.div
                key={index}
                style={{
                  width: cardWidth,
                  flexShrink: 0,
                }}
                className={`transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <DiaryEntry entry={entry} index={index} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Pagination Dots - Mobile */}
      <div className="flex md:hidden justify-center gap-2 mt-6">
        {entries.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-foreground'
                : 'w-2 bg-muted-foreground/30'
            }`}
            aria-label={`Go to entry ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
