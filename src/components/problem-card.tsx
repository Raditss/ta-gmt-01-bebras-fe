import { ContentCard } from "@/components/ui/content-card"

interface ProblemCardProps {
  id: string
  title: string
  author: string
  difficulty: string
  category: string
}

export function ProblemCard({ id, title, author, difficulty, category }: ProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    const normalizedDifficulty = difficulty.toLowerCase();
    switch (normalizedDifficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Capitalize the first letter of difficulty for display
  const displayDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

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
          label: displayDifficulty,
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
