import { TaskStats } from "@/components/task-stats"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { TaskList } from "@/components/task-list"
import { TaskBoard } from "@/components/task-board"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks</p>
        </div>
        <CreateTaskDialog />
      </div>

      <TaskStats />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <TaskList />
        </TabsContent>
        <TabsContent value="board" className="space-y-4">
          <TaskBoard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
