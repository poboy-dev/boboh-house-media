import { Share2, Facebook, MessageCircle, Twitter, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  articleId?: string;
}

export const ShareButton = ({ 
  title, 
  description = '', 
  url = typeof window !== 'undefined' ? window.location.href : '',
  articleId
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  // Use Edge Function URL for social sharing if articleId is provided
  const ogUrl = articleId 
    ? `https://yxiocwtfejvgtupqtcnx.supabase.co/functions/v1/og-image?id=${articleId}`
    : url;

  const shareText = `${title}${description ? ` - ${description}` : ''}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${ogUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogUrl)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Impossible de copier le lien');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4 text-green-600" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="gap-2 cursor-pointer">
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2 cursor-pointer">
          <Twitter className="h-4 w-4 text-sky-500" />
          Twitter / X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Link className="h-4 w-4" />
          )}
          {copied ? 'Copié !' : 'Copier le lien'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
