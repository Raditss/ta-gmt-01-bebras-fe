import { ContentCard } from "@/components/ui/content-card"

interface ProblemCardProps {
  id: string
  title: string
  author: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
}

export function ProblemCard({ id, title, author, difficulty, category }: ProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  return (
    <ContentCard
      id={id}
      title={title}
      author={author}
      tags={[
        {
          label: category,
          variant: "outline",
          className: "bg-gray-100",
        },
        {
          label: difficulty,
          className: getDifficultyColor(difficulty),
        },
      ]}
      footer={{
        action: {
          label: "View Problem",
          href: `/problems/${id}`,
          className: "bg-[#F8D15B] text-black hover:bg-[#E8C14B]",
        },
      }}
    />
  )
}
