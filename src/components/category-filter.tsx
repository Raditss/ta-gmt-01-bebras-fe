"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CategoryFilter() {
  const [categories, setCategories] = useState({
    cipher: true,
    binaryTree: false,
    balanced: false,
    algorithms: false,
    dataStructures: false,
    dynamicProgramming: false,
  })

  const handleCategoryChange = (category: keyof typeof categories) => {
    setCategories({
      ...categories,
      [category]: !categories[category],
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="cipher" checked={categories.cipher} onCheckedChange={() => handleCategoryChange("cipher")} />
        <Label htmlFor="cipher" className="text-sm">
          Cipher
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="binaryTree"
          checked={categories.binaryTree}
          onCheckedChange={() => handleCategoryChange("binaryTree")}
        />
        <Label htmlFor="binaryTree" className="text-sm">
          Binary Tree
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="balanced"
          checked={categories.balanced}
          onCheckedChange={() => handleCategoryChange("balanced")}
        />
        <Label htmlFor="balanced" className="text-sm">
          Balanced
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="algorithms"
          checked={categories.algorithms}
          onCheckedChange={() => handleCategoryChange("algorithms")}
        />
        <Label htmlFor="algorithms" className="text-sm">
          Algorithms
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="dataStructures"
          checked={categories.dataStructures}
          onCheckedChange={() => handleCategoryChange("dataStructures")}
        />
        <Label htmlFor="dataStructures" className="text-sm">
          Data Structures
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="dynamicProgramming"
          checked={categories.dynamicProgramming}
          onCheckedChange={() => handleCategoryChange("dynamicProgramming")}
        />
        <Label htmlFor="dynamicProgramming" className="text-sm">
          Dynamic Programming
        </Label>
      </div>
    </div>
  )
}
