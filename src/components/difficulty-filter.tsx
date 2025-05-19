"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function DifficultyFilter() {
  const [difficulties, setDifficulties] = useState({
    easy: true,
    medium: true,
    hard: true,
  })

  const handleDifficultyChange = (difficulty: keyof typeof difficulties) => {
    setDifficulties({
      ...difficulties,
      [difficulty]: !difficulties[difficulty],
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="easy" checked={difficulties.easy} onCheckedChange={() => handleDifficultyChange("easy")} />
        <Label htmlFor="easy" className="text-sm">
          Easy
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="medium" checked={difficulties.medium} onCheckedChange={() => handleDifficultyChange("medium")} />
        <Label htmlFor="medium" className="text-sm">
          Medium
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="hard" checked={difficulties.hard} onCheckedChange={() => handleDifficultyChange("hard")} />
        <Label htmlFor="hard" className="text-sm">
          Hard
        </Label>
      </div>
    </div>
  )
}
