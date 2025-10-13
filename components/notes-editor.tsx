"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Pin, Lock, Users, Building2, MoreVertical, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import type { Note } from "@/lib/types"

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Project Requirements",
    content:
      "Key requirements for the Q1 project:\n- User authentication\n- Dashboard analytics\n- Mobile responsive design",
    authorId: "1",
    orgId: "org-1",
    visibility: "team",
    pinned: true,
    tags: ["project", "requirements"],
    createdAt: new Date(2025, 0, 10),
    updatedAt: new Date(2025, 0, 12),
  },
  {
    id: "2",
    title: "Meeting Notes - Jan 13",
    content: "Team standup notes:\n- Sprint planning completed\n- New features discussed\n- Action items assigned",
    authorId: "1",
    orgId: "org-1",
    visibility: "team",
    pinned: false,
    tags: ["meeting", "standup"],
    createdAt: new Date(2025, 0, 13),
    updatedAt: new Date(2025, 0, 13),
  },
  {
    id: "3",
    title: "Personal Tasks",
    content: "Things to do:\n- Review code\n- Update documentation\n- Prepare presentation",
    authorId: "1",
    orgId: "org-1",
    visibility: "private",
    pinned: false,
    tags: ["personal", "tasks"],
    createdAt: new Date(2025, 0, 12),
    updatedAt: new Date(2025, 0, 13),
  },
  {
    id: "4",
    title: "Company Policies",
    content: "Important company policies and guidelines for all employees.",
    authorId: "2",
    orgId: "org-1",
    visibility: "org",
    pinned: true,
    tags: ["policy", "important"],
    createdAt: new Date(2025, 0, 5),
    updatedAt: new Date(2025, 0, 5),
  },
]

export function NotesEditor() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterVisibility, setFilterVisibility] = useState<"all" | "private" | "team" | "org">("all")

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter = filterVisibility === "all" || note.visibility === filterVisibility

    return matchesSearch && matchesFilter
  })

  const pinnedNotes = filteredNotes.filter((note) => note.pinned)
  const unpinnedNotes = filteredNotes.filter((note) => !note.pinned)

  const getVisibilityIcon = (visibility: Note["visibility"]) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-3 w-3" />
      case "team":
        return <Users className="h-3 w-3" />
      case "org":
        return <Building2 className="h-3 w-3" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleCreateNote = () => {
    setIsCreating(true)
    setSelectedNote(null)
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setIsCreating(false)
  }

  const handleTogglePin = (noteId: string) => {
    setNotes(notes.map((note) => (note.id === noteId ? { ...note, pinned: !note.pinned } : note)))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Notes List */}
      <div className="lg:col-span-1 space-y-4 overflow-hidden flex flex-col">
        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterVisibility} onValueChange={(value: any) => setFilterVisibility(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notes</SelectItem>
                <SelectItem value="private">{t("private")}</SelectItem>
                <SelectItem value="team">{t("team")}</SelectItem>
                <SelectItem value="org">{t("organization")}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateNote} className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              {t("createNote")}
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground px-1">
                <Pin className="h-3 w-3" />
                {t("pinned")}
              </div>
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={selectedNote?.id === note.id}
                  onSelect={handleSelectNote}
                  onTogglePin={handleTogglePin}
                  getVisibilityIcon={getVisibilityIcon}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}

          {/* Unpinned Notes */}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-2">
              {pinnedNotes.length > 0 && (
                <div className="text-sm font-medium text-muted-foreground px-1">All Notes</div>
              )}
              {unpinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={selectedNote?.id === note.id}
                  onSelect={handleSelectNote}
                  onTogglePin={handleTogglePin}
                  getVisibilityIcon={getVisibilityIcon}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notes found</p>
            </div>
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="lg:col-span-2">
        {selectedNote || isCreating ? (
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="space-y-4">
                <Input placeholder={t("noteTitle")} defaultValue={selectedNote?.title} className="text-xl font-bold" />
                <div className="flex items-center gap-2">
                  <Select defaultValue={selectedNote?.visibility || "private"}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-3 w-3" />
                          {t("private")}
                        </div>
                      </SelectItem>
                      <SelectItem value="team">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          {t("team")}
                        </div>
                      </SelectItem>
                      <SelectItem value="org">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          {t("organization")}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Add tags..." className="flex-1" defaultValue={selectedNote?.tags.join(", ")} />
                  <Button>{t("save")}</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 h-[calc(100%-10rem)] overflow-y-auto">
              <Textarea
                placeholder={t("noteContent")}
                defaultValue={selectedNote?.content}
                className="min-h-full resize-none border-0 focus-visible:ring-0 text-base"
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Select a note or create a new one</p>
              <Button onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                {t("createNote")}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function NoteCard({
  note,
  isSelected,
  onSelect,
  onTogglePin,
  getVisibilityIcon,
  formatDate,
}: {
  note: Note
  isSelected: boolean
  onSelect: (note: Note) => void
  onTogglePin: (id: string) => void
  getVisibilityIcon: (visibility: Note["visibility"]) => React.ReactNode
  formatDate: (date: Date) => string
}) {
  return (
    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer transition-colors ${
          isSelected ? "border-emerald-500 bg-accent" : "hover:bg-accent/50"
        }`}
        onClick={() => onSelect(note)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {note.pinned && <Pin className="h-3 w-3 text-emerald-500 flex-shrink-0" />}
                <h3 className="font-medium truncate">{note.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onTogglePin(note.id)
                  }}
                >
                  <Pin className="h-4 w-4 mr-2" />
                  {note.pinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getVisibilityIcon(note.visibility)}
              <span className="capitalize">{note.visibility}</span>
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</span>
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Missing import
import { FileText } from "lucide-react"
