
interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground">Aucun commentaire pour le moment.</p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{comment.author_name}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-foreground">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
