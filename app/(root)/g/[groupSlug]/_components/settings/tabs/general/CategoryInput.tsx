'use client';

import {
    Tags,
    TagsContent,
    TagsEmpty,
    TagsGroup,
    TagsInput,
    TagsItem,
    TagsList,
    TagsTrigger,
    TagsValue,
} from '@/components/ui/tags';
import { categories } from '@/constants';
import { CheckmarkBadgeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type CategoryInputProps = {
    value: string[];                // non-nullable
    onValueChange: (next: string[]) => void; // not "setSelected"
};

export const FormCategoryInput = ({ value, onValueChange }: CategoryInputProps) => {
    const selected = value; // alias for clarity

    const handleRemove = (tag: string) => {
        if (!selected.includes(tag)) return;
        onValueChange(selected.filter((v) => v !== tag));
    };

    const handleToggle = (tag: string) => {
        if (selected.includes(tag)) {
            onValueChange(selected.filter((v) => v !== tag));
        } else {
            onValueChange([...selected, tag]);
        }
    };

    return (
        <Tags className="w-full">
            <TagsTrigger>
                {selected.map((tag) => (
                    <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
                        {categories.find((t) => t.id === tag)?.label ?? tag}
                    </TagsValue>
                ))}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Search categories..." />
                <TagsList>
                    <TagsEmpty />
                    <TagsGroup>
                        {categories.map((tag) => (
                            <TagsItem
                                key={tag.id}
                                value={tag.id}
                                onSelect={() => handleToggle(tag.id)}
                            >
                                {tag.label}
                                {selected.includes(tag.id) && (
                                    <HugeiconsIcon icon={CheckmarkBadgeIcon} className="text-muted-foreground" size={14} />
                                )}
                            </TagsItem>
                        ))}
                    </TagsGroup>
                </TagsList>
            </TagsContent>
        </Tags>
    );
};
