
import { useState } from "react";
import { TeamMember } from "@/types/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePicker } from "@/components/ui/image-picker";
import { TeamMemberFormProps } from "./types";

export const TeamMemberForm = ({ member, onSave, onCancel, uploading, onImageUpload }: TeamMemberFormProps) => {
  const [form, setForm] = useState<Partial<TeamMember>>(member || {});

  const handleSubmit = async () => {
    await onSave(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nom du membre"
        />
      </div>
      
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select
          value={form.role || 'REDACTRICE'}
          onValueChange={(value) => setForm({ ...form, role: value as TeamMember['role'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CEO">CEO</SelectItem>
            <SelectItem value="DG">DG</SelectItem>
            <SelectItem value="SG">SG</SelectItem>
            <SelectItem value="REDACTRICE">REDACTRICE</SelectItem>
            <SelectItem value="COMMUNICATRICE">COMMUNICATRICE</SelectItem>
            <SelectItem value="COMMUNICATEUR">COMMUNICATEUR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="image">Image</Label>
        <ImagePicker
          value={form.image || undefined}
          onChange={(file) => {
            const tempId = member?.id || crypto.randomUUID();
            onImageUpload(file, tempId);
          }}
          loading={uploading}
          onRemove={form.image ? () => setForm({ ...form, image: null }) : undefined}
        />
      </div>

      {member && (
        <div>
          <Label htmlFor="order">Ordre d'affichage</Label>
          <Input
            id="order"
            type="number"
            value={form.order_index || member.order_index}
            onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) })}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={handleSubmit}
          className="flex-1"
        >
          {member ? 'Sauvegarder' : 'Créer'}
        </Button>
        <Button 
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Annuler
        </Button>
      </div>
    </div>
  );
};
