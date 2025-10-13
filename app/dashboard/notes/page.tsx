import { NotesEditor } from "@/components/notes-editor"

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-muted-foreground">Create and manage your personal and shared notes</p>
      </div>

      <NotesEditor />
    </div>
  )
}
