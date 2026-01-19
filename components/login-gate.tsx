'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { motion } from 'framer-motion'

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN

export function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token === SECRET_TOKEN) {
      onSuccess()
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold">IDX - Daily Summary</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your secret token to access your insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter secret token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className={`text-center text-lg ${
                    error ? 'border-destructive focus-visible:ring-destructive' : ''
                  }`}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-destructive text-center"
                  >
                    Invalid token. Please try again.
                  </motion.p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Access Diary
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
