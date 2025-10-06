'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// ---- 型定義 ----
type QuizQuestion = {
  id: string
  order_index: number
  text: string
  scale_min_label?: string
  scale_max_label?: string
}

type Answers = Record<string, number>

// ---- コンポーネント本体 ----
export default function Quiz() {
  const [qs, setQs] = useState<QuizQuestion[]>([]) // ← 追加
  const [ans, setAns] = useState<Answers>({})

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index')
      setQs(data || [])
    })()
  }, [])

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      {qs.map((q) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {q.order_index}. {q.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <Button
                key={v}
                variant={ans[q.id] === v ? 'default' : 'secondary'}
                onClick={() => setAns((a) => ({ ...a, [q.id]: v }))}
              >
                {v}
              </Button>
            ))}
          </CardContent>
        </Card>
      ))}
      <Button
        className="w-full"
        onClick={() => alert('結果ロジックはPhase2で実装')}
      >
        結果を見る
      </Button>
    </main>
  )
}
