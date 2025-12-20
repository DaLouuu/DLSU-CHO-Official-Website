"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VoiceFilterProps {
  activeVoice: string | null
  setActiveVoice: (voice: string | null) => void
}

export function VoiceFilter({ activeVoice, setActiveVoice }: VoiceFilterProps) {
  return (
    <Tabs
      value={activeVoice || "all"}
      onValueChange={(value) => setActiveVoice(value === "all" ? null : value)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
        <TabsTrigger value="all" className="data-[state=active]:bg-[#09331f] data-[state=active]:text-white">
          All
        </TabsTrigger>
        <TabsTrigger value="soprano" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
          Soprano
        </TabsTrigger>
        <TabsTrigger value="alto" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
          Alto
        </TabsTrigger>
        <TabsTrigger value="tenor" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
          Tenor
        </TabsTrigger>
        <TabsTrigger value="bass" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
          Bass
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
