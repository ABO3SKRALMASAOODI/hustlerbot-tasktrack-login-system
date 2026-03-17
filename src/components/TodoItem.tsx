import { useState } from "react";
import { Todo } from "@/hooks/useTodos";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle, editDescription);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-4 space-y-3 border-primary/50 bg-primary/5">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          className="font-medium"
          autoFocus
        />
        <Input
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          className="text-sm"
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="gap-1"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="gap-1"
          >
            <Check className="w-4 h-4" />
            Save
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-4 transition-all duration-200 ${
        todo.completed ? "bg-muted opacity-75" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium leading-tight ${
              todo.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p className={`text-sm mt-1 ${todo.completed ? "text-muted-foreground" : "text-muted-foreground"}`}>
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TodoItem;
