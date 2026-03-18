import {
    HugeiconsIcon,
} from '@hugeicons/react';
import {
    GameController03Icon,
    Film01Icon,
    Coffee01Icon,
    Book02Icon,
    BookOpen01Icon,
    Briefcase01Icon,
    FavouriteIcon,
    Calendar03Icon,
    HelpCircleIcon,
    Tag01Icon,
    Music,
    Palette,
    Video,
    Monitor,
    Code,
    Newspaper
} from '@hugeicons/core-free-icons';

// Define the type for the icon if you are using TypeScript
// Use "any" if you don't want to import the specific internal type

type IconSvgObject = ([string, {
    [key: string]: string | number;
}])[] | readonly (readonly [string, {
    readonly [key: string]: string | number;
}])[];

interface Category {
    id: string;
    label: string;
    icon: IconSvgObject;
}

export const categories: Category[] = [
    { id: "music", label: "Music", icon: Music },
    { id: "gaming", label: "Gaming", icon: GameController03Icon },
    { id: "art", label: "Art & Design", icon: Palette },
    { id: "creative", label: "Creative & Media", icon: Film01Icon },
    { id: "culture", label: "Culture & Lifestyle", icon: Coffee01Icon },
    { id: "books", label: "Books & Literature", icon: Book02Icon },
    { id: "movies", label: "Movies & TV", icon: Video },
    { id: "tech", label: "Technology", icon: Monitor },
    { id: "development", label: "Development", icon: Code },
    { id: "learning", label: "Learning & Education", icon: BookOpen01Icon },
    { id: "career", label: "Careers & Jobs", icon: Briefcase01Icon },
    { id: "health", label: "Health & Wellness", icon: FavouriteIcon },
    { id: "news", label: "News & Discussions", icon: Newspaper },
    { id: "events", label: "Events & Meetups", icon: Calendar03Icon },
    { id: "support", label: "Help & Support", icon: HelpCircleIcon },
    { id: "other", label: "Other / Misc", icon: Tag01Icon },
];
