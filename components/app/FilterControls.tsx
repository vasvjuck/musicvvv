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

export const SearchInput = ({ value, onChange }) => (
    <Input
        data-testid="search-input"
        placeholder="Search tracks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[200px]"
    />
);

export const FilterSelect = ({
    label, options, value, onChange, width = '160px', testId }) => (
    <Select value={value} onValueChange={onChange} data-testid={testId}>
        <SelectTrigger className={`w-[${width}]`}>
            <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options.map(option => (
                    <SelectItem
                        key={option.value || option}
                        value={option.value || option}
                    >
                        {option.label || option}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
);

export const SortOrderToggle = ({ order, onToggle }) => (
    <Button variant="outline" size="icon" onClick={onToggle} className="ml-auto">
        {order === 'asc' ? <ArrowUp /> : <ArrowDown />}
    </Button>
);