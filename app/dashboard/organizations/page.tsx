// This is the organizations page
// D:\Website\Hệ thống quản lý\CRM_LifeOS\app\organizations\page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Building2, Users, Calendar, X } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description: string;
  members: number;
  createdAt: string;
  role: "Admin" | "Owner" | "Leader" | "Staff";
}

export default function OrganizationsPage() {
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "1",
      name: "LifeOS HQ",
      description: "Trụ sở chính, quản lý toàn bộ hệ thống.",
      members: 12,
      createdAt: "2025-10-01",
      role: "Admin",
    },
    {
      id: "2",
      name: "Phòng Kỹ thuật",
      description: "Phụ trách phát triển hệ thống CRM + AI.",
      members: 8,
      createdAt: "2025-10-05",
      role: "Leader",
    },
  ]);

  const [newOrg, setNewOrg] = useState({ name: "", description: "" });

  const handleAdd = () => {
    if (!newOrg.name.trim()) return;
    setOrganizations([
      ...organizations,
      {
        id: Date.now().toString(),
        name: newOrg.name,
        description: newOrg.description,
        members: 1,
        createdAt: new Date().toISOString().slice(0, 10),
        role: "Owner",
      },
    ]);
    setNewOrg({ name: "", description: "" });
    setOpen(false);
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold flex items-center gap-2"
        >
          <Building2 className="w-7 h-7 text-primary" />
          Danh sách tổ chức
        </motion.h1>

        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm tổ chức
        </Button>
      </div>

      {/* Organizations List */}
      <ScrollArea className="h-[70vh] rounded-lg border p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{org.name}</span>
                    <Badge variant="outline">{org.role}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{org.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-4 h-4 text-primary" />
                    {org.members} thành viên
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-4 h-4 text-primary" />
                    Tạo ngày: {org.createdAt}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Dialog thêm tổ chức */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Thêm tổ chức mới</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Tên tổ chức"
              value={newOrg.name}
              onChange={(e) =>
                setNewOrg((p) => ({ ...p, name: e.target.value }))
              }
            />
            <Input
              placeholder="Mô tả"
              value={newOrg.description}
              onChange={(e) =>
                setNewOrg((p) => ({ ...p, description: e.target.value }))
              }
            />
            <Button className="w-full" onClick={handleAdd}>
              Tạo tổ chức
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
