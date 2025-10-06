// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coffee, Utensils } from 'lucide-react'

export default function Home() {
return (
<main className="max-w-xl mx-auto p-6 space-y-6">
<h1 className="text-3xl font-bold">KCC Mita 2025</h1>
<p>QRから来たら、まずは診断かメニューへ👇</p>
<div className="grid grid-cols-1 gap-3">
<Link href="/quiz"><Button className="w-full" size="lg"><Coffee className="mr-2"/>MBTI診断へ</Button></Link>
<Link href="/menu"><Button variant="secondary" className="w-full" size="lg"><Utensils className="mr-2"/>メニューを見る</Button></Link>
</div>
</main>
)
}