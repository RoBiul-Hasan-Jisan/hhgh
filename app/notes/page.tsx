'use client'

import React, { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button-custom'
import { Modal, ModalActions } from '@/components/ui/modal'
import { FormField, Input, Textarea } from '@/components/ui/form-field'
import { StickyNote, StickyNotesGrid } from '@/components/ui/sticky-note'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'] as const

export default function NotesPage() {
  const finance = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: 'yellow' as typeof NOTE_COLORS[number],
  })

  const handleOpenModal = (id?: string) => {
    if (id) {
      const note = finance.notes.find((n) => n.id === id)
      if (note) {
        setFormData({
          title: note.title,
          content: note.content,
          color: note.color as typeof NOTE_COLORS[number],
        })
        setEditingId(id)
      }
    } else {
      setFormData({
        title: '',
        content: '',
        color: 'yellow',
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleSaveNote = () => {
    if (!formData.title && !formData.content) return

    if (editingId) {
      finance.updateNote(editingId, {
        title: formData.title,
        content: formData.content,
        color: formData.color,
      })
    } else {
      finance.addNote({
        title: formData.title,
        content: formData.content,
        color: formData.color,
        pinned: false,
      })
    }

    setIsModalOpen(false)
  }

  const pinnedNotes = finance.notes.filter((n) => n.pinned)
  const unpinnedNotes = finance.notes.filter((n) => !n.pinned)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 px-4 py-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notes</h1>
              <p className="text-muted-foreground mt-1">Jot down your thoughts and ideas</p>
            </div>
            <Button onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>

          {pinnedNotes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Pinned
              </h2>
              <StickyNotesGrid>
                {pinnedNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <StickyNote
                      title={note.title}
                      content={note.content}
                      color={note.color as typeof NOTE_COLORS[number]}
                      pinned={note.pinned}
                      onClick={() => handleOpenModal(note.id)}
                      onPin={() =>
                        finance.updateNote(note.id, {
                          pinned: !note.pinned,
                        })
                      }
                      onDelete={() => finance.deleteNote(note.id)}
                    />
                  </motion.div>
                ))}
              </StickyNotesGrid>
            </div>
          )}

          {unpinnedNotes.length > 0 ? (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  All Notes
                </h2>
              )}
              <StickyNotesGrid>
                {unpinnedNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <StickyNote
                      title={note.title}
                      content={note.content}
                      color={note.color as typeof NOTE_COLORS[number]}
                      pinned={note.pinned}
                      onClick={() => handleOpenModal(note.id)}
                      onPin={() =>
                        finance.updateNote(note.id, {
                          pinned: !note.pinned,
                        })
                      }
                      onDelete={() => finance.deleteNote(note.id)}
                    />
                  </motion.div>
                ))}
              </StickyNotesGrid>
            </div>
          ) : pinnedNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No notes yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Create one to get started!</p>
            </div>
          ) : null}
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Note' : 'New Note'}
        description={editingId ? 'Update your note' : 'Create a new sticky note'}
      >
        <div className="space-y-4">
          <FormField label="Title">
            <Input
              placeholder="Add a title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </FormField>

          <FormField label="Content">
            <Textarea
              placeholder="Write your notes here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </FormField>

          <FormField label="Color">
            <div className="flex gap-2">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-foreground' : 'border-muted'
                  }`}
                  style={{
                    backgroundColor: {
                      yellow: '#fef08a',
                      pink: '#fbcfe8',
                      blue: '#bfdbfe',
                      green: '#bbf7d0',
                      purple: '#e9d5ff',
                      orange: '#fed7aa',
                    }[color],
                  }}
                />
              ))}
            </div>
          </FormField>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>{editingId ? 'Update Note' : 'Create Note'}</Button>
          </ModalActions>
        </div>
      </Modal>
    </div>
  )
}
