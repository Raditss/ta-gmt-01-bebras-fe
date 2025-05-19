import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface ContentCardProps {
  id: string
  title: string
  author: string
  tags: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'outline'
    className?: string
  }>
  footer?: {
    text?: string
    action?: {
      label: string
      href: string
      className?: string
    }
  }
}

export function ContentCard({ id, title, author, tags, footer }: ContentCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant={tag.variant || 'outline'}
              className={tag.className}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
        <h3 className="font-medium line-clamp-2 mt-2">{title}</h3>
      </CardHeader>
      <CardContent className="pb-2 pt-0 flex-grow">
        <p className="text-sm text-gray-500">by {author}</p>
      </CardContent>
      {footer && (
        <CardFooter className="pt-2">
          {footer.action ? (
            <Link href={footer.action.href} className="w-full">
              <Button className={`w-full ${footer.action.className || ''}`}>
                {footer.action.label}
              </Button>
            </Link>
          ) : (
            footer.text && <p className="text-sm text-gray-500">{footer.text}</p>
          )}
        </CardFooter>
      )}
    </Card>
  )
} 