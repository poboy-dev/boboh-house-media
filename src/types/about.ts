
export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface AboutContent {
  id: string;
  section: string;
  content: {
    text?: string;
    [key: string]: any;
  };
}
