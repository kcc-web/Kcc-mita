'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export type Cafe = {
id: string
name: string
category: 'coffee' | 'waffle'
price: number
status: 'available' | 'soldout'
flavor_notes: string[] | null
}

export default function MenuPage(){
const [items, setItems] = useState<Cafe[]>([])
useEffect(()=>{
(async()=>{
const { data, error } = await supabase
.from('cafes')
.select('id,name,category,price,status,flavor_notes')
.order('order_index', { ascending: true })
if(!error && data) setItems(data as Cafe[])
})()
},[])

return (
<main className="max-w-2xl mx-auto p-4 grid gap-4">
{items.map(it=> (
<Card key={it.id} className={it.status==='soldout'? 'opacity-50':''}>
<CardHeader>
<CardTitle className="flex items-center justify-between">
<span>{it.name}</span>
<span className="text-base">¥{it.price}</span>
</CardTitle>
</CardHeader>
<CardContent className="flex items-center gap-2 flex-wrap">
{it.status==='soldout' && <Badge variant="destructive">Sold Out</Badge>}
{it.flavor_notes?.map(n=> <Badge key={n} variant="secondary">{n}</Badge>)}
</CardContent>
</Card>
))}
</main>
)
}