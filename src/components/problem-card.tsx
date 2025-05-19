import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProblemCardProps {
  id: string
  title: string
  author: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
}

export function ProblemCard({ id, title, author, difficulty, category }: ProblemCardProps) {
  const difficultyColor =
    difficulty === "Easy"
      ? "bg-green-100 text-green-800"
      : difficulty === "Medium"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <Badge variant="outline" className="bg-gray-100">
            {category}
          </Badge>
          <Badge className={difficultyColor}>{difficulty}</Badge>
        </div>
        <h3 className="font-medium line-clamp-2 mt-2">{title}</h3>
      </CardHeader>
      <CardContent className="pb-2 pt-0 flex-grow">
        <p className="text-sm text-gray-500">by {author}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/problems/${id}`} className="w-full">
          <Button className="w-full bg-[#F8D15B] text-black hover:bg-[#E8C14B]">View Problem</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
