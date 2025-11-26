import { useState, useEffect } from "react";
import { Search, X, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { getFilterSuggestions, getUsers } from "@/backend/actions/filters";

// Mock workspace ID
const WORKSPACE_ID = "f135f0f0-6fdb-4d6e-acd2-01404c138ce0";

interface FiltersProps {
    search: string;
    setSearch: (value: string) => void;
    jobId: string;
    setJobId: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    jobs: any[];
    resetFilters: () => void;
    // New Filters
    skills: string[];
    setSkills: (value: string[]) => void;
    experience: string;
    setExperience: (value: string) => void;
    company: string[];
    setCompany: (value: string[]) => void;
    domain: string[];
    setDomain: (value: string[]) => void;
    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;
    assignedTo: string;
    setAssignedTo: (value: string) => void;
}

export function Filters({
    search,
    setSearch,
    jobId,
    setJobId,
    status,
    setStatus,
    jobs,
    resetFilters,
    skills,
    setSkills,
    experience,
    setExperience,
    company,
    setCompany,
    domain,
    setDomain,
    dateRange,
    setDateRange,
    assignedTo,
    setAssignedTo,
}: FiltersProps) {
    const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
    const [companySuggestions, setCompanySuggestions] = useState<string[]>([]);
    const [domainSuggestions, setDomainSuggestions] = useState<string[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Fetch suggestions based on input? Or just fetch all unique values?
        // For now, let's fetch based on the last typed value or just fetch top values?
        // The current implementation fetches based on `skills` value which is now an array.
        // We might need a separate input state for searching suggestions.
        // For simplicity, let's fetch top suggestions initially or when empty.
        fetchSuggestions("skills", "", setSkillSuggestions);
        fetchSuggestions("previous_companies_names", "", setCompanySuggestions);
        fetchSuggestions("domains_worked", "", setDomainSuggestions);
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers(WORKSPACE_ID);
        setUsers(data || []);
    };

    const fetchSuggestions = async (field: any, query: string, setter: any) => {
        // if (!query) return; // Allow empty query to fetch initial suggestions
        const data = await getFilterSuggestions(WORKSPACE_ID, field, query);
        setter(data || []);
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Primary Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name, email..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={jobId} onValueChange={setJobId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Job" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {jobs.map((job) => (
                            <SelectItem key={job.id} value={job.job_id}>
                                {job.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="screening">Screening</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                        <SelectValue placeholder="Assigned To" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name || user.email}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <MultiSelectCombobox
                    placeholder="Skills"
                    selected={skills}
                    onChange={setSkills}
                    suggestions={skillSuggestions}
                    onSearch={(q: string) => fetchSuggestions("skills", q, setSkillSuggestions)}
                />
                <Input
                    placeholder="Min Experience (Years)"
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                />
                <MultiSelectCombobox
                    placeholder="Company"
                    selected={company}
                    onChange={setCompany}
                    suggestions={companySuggestions}
                    onSearch={(q: string) => fetchSuggestions("previous_companies_names", q, setCompanySuggestions)}
                />
                <MultiSelectCombobox
                    placeholder="Domain"
                    selected={domain}
                    onChange={setDomain}
                    suggestions={domainSuggestions}
                    onSearch={(q: string) => fetchSuggestions("domains_worked", q, setDomainSuggestions)}
                />
            </div>

            <div className="flex justify-between items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal w-[240px]",
                                !dateRange?.from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                        {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>

                <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
                    <X className="mr-2 h-4 w-4" /> Reset All Filters
                </Button>
            </div>
        </div>
    );
}

function MultiSelectCombobox({ placeholder, selected, onChange, suggestions, onSearch }: any) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-[40px] py-2"
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length > 0 ? (
                            selected.map((item: string) => (
                                <span key={item} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-md text-xs flex items-center gap-1">
                                    {item}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(selected.filter((i: string) => i !== item));
                                        }}
                                    />
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder={`Search ${placeholder}...`}
                        value={inputValue}
                        onValueChange={(val) => {
                            setInputValue(val);
                            onSearch(val);
                        }}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {suggestions.map((suggestion: string) => (
                                <CommandItem
                                    key={suggestion}
                                    value={suggestion}
                                    onSelect={() => {
                                        if (selected.includes(suggestion)) {
                                            onChange(selected.filter((i: string) => i !== suggestion));
                                        } else {
                                            onChange([...selected, suggestion]);
                                        }
                                        setInputValue(""); // Clear input after select? Optional.
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(suggestion) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {suggestion}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
