
import { useState, useEffect } from "react";
import { TeamMember } from "@/types/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePicker } from "@/components/ui/image-picker";
import { TeamMemberFormProps } from "./types";
import { toast } from "sonner";

export const TeamMemberForm = ({ member, onSave, onCancel, uploading, onImageUpload }: TeamMemberFormProps) => {
  const [form, setForm] = useState<Partial<TeamMember>>(
    member ? { ...member } : { role: 'REDACTRICE', order_index: 0 }
  );
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    // Validate the form
    const isValid = Boolean(form.name && form.role);
    setFormValid(isValid);
  }, [form]);

  const handleSubmit = async () => {
    if (!formValid) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await onSave(form);
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const tempId = member?.id || crypto.randomUUID();
      const imageUrl = await onImageUpload(file, tempId);
      setForm({ ...form, image: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    }
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
          required
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
        <div className="relative w-32 h-32 mx-auto">
          <ImagePicker
            value={form.image || undefined}
            onChange={handleImageUpload}
            loading={uploading}
            onRemove={form.image ? () => setForm({ ...form, image: null }) : undefined}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="order">Ordre d'affichage</Label>
        <Input
          id="order"
          type="number"
          value={form.order_index || 0}
          onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) })}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={handleSubmit}
          className="flex-1"
          disabled={!formValid}
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
