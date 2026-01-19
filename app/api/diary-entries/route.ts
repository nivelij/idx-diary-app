import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace('sslmode=require', 'sslmode=verify-full'),
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET() {
  try {
    // Query to get last 7 days of entries, ordered by date descending
    const query = `
      SELECT
        summary_date,
        summary,
        tickers
      FROM telegram_my_daily_summary
      ORDER BY summary_date DESC
      LIMIT 7
    `

    const result = await pool.query(query)

    // Transform the data to match the expected format
    const entries = result.rows.map((row) => {
      // Format date from YYYY-MM-DD to "MMM DD, YYYY"
      const date = new Date(row.summary_date)
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

      // Parse summary - assuming it's either a JSON array or a string with bullet points
      let summaryArray: string[] = []
      if (typeof row.summary === 'string') {
        // If it's a string, split by newlines or bullet points
        summaryArray = row.summary
          .split(/\n|•/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      } else if (Array.isArray(row.summary)) {
        summaryArray = row.summary
      }

      // Parse tickers - should already be a JSON object
      const stocks = Array.isArray(row.tickers) ? row.tickers : []

      return {
        date: formattedDate,
        summary: summaryArray,
        stocks: stocks,
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch diary entries' },
      { status: 500 }
    )
  }
}
