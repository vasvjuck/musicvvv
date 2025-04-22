import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => (
    <Input
        data-testid="search-input"
        placeholder="Search tracks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[200px]"
    />
);

type FilterOption = string | { value: string; label: string };

interface FilterSelectProps {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    width?: string;
    testId?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    options,
    value,
    onChange,
    width = '160px',
    testId,
}) => (
    <Select value={value} onValueChange={onChange} data-testid={testId}>
        <SelectTrigger className={`w-[${width}]`}>
            <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options.map((option) => {
                    const val = typeof option === 'string' ? option : option.value;
                    const labelText =
                        typeof option === 'string' ? option : option.label;
                    return (
                        <SelectItem key={val} value={val}>
                            {labelText}
                        </SelectItem>
                    );
                })}
            </SelectGroup>
        </SelectContent>
    </Select>
);

interface SortOrderToggleProps {
    order: 'asc' | 'desc';
    onToggle: () => void;
}

export const SortOrderToggle: React.FC<SortOrderToggleProps> = ({ order, onToggle }) => (
    <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="ml-auto"
    >
        {order === 'asc' ? <ArrowUp /> : <ArrowDown />}
    </Button>
);
