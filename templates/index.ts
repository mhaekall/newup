import Template1 from "./template1/Template"
import Template2 from "./template2/Template"
import Template3 from "./template3/Template"
import type { Template } from "@/types"

// Register all templates here
export const templates: Template[] = [
  {
    id: "template1",
    name: "Basic Template",
    component: Template1,
  },
  {
    id: "template2",
    name: "Modern Template",
    component: Template2,
  },
  {
    id: "template3",
    name: "iOS-Style Template",
    component: Template3,
  },
]

// Get template by ID
export function getTemplateById(id: string): Template {
  const template = templates.find((t) => t.id === id)
  if (!template) {
    // Default to first template if not found
    return templates[0]
  }
  return template
}
