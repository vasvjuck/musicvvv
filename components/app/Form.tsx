import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Form as ShadcnForm,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { trackSchema } from "@/lib/validations/trackSchema"
import { TrackInput } from '@/schema'
import { useGenres } from "@/hooks/api/useGenres"
import Image from "next/image"
import { isValidUrl } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FormProps {
    initialValues?: TrackInput
    submitLabel?: string
    onSubmit: (values: TrackInput) => void | Promise<void>
}
export const Form = ({
    initialValues = {
        title: "",
        artist: "",
        album: "",
        genres: [],
        coverImage: ""
    },
    submitLabel = "Submit",
    onSubmit,
}: FormProps) => {
    const { data: genres = [] } = useGenres()

    const form = useForm<TrackInput>({
        resolver: zodResolver(trackSchema),
        defaultValues: initialValues,
    })

    const { append, remove } = useFieldArray({
        control: form.control,
        name: "genres",
    })

    const selectedGenres = form.watch("genres") || []
    const trackImage = form.watch("coverImage")?.trim()
    const previewSrc =
        trackImage && isValidUrl(trackImage)
            ? trackImage
            : "/track_placeholder.png"

    return (
        <ShadcnForm {...form} data-testid="track-form">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-3"
            >
                <FormField
                    data-testid="input-title"
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Track title" {...field} />
                            </FormControl>
                            <FormMessage data-testid="error-title" />
                        </FormItem>
                    )}
                />
                <FormField
                    data-testid="input-artist"
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Artist</FormLabel>
                            <FormControl>
                                <Input placeholder="Artist name" {...field} />
                            </FormControl>
                            <FormMessage data-testid="error-artist" />
                        </FormItem>
                    )}
                />
                <FormField
                    data-testid="input-album"
                    control={form.control}
                    name="album"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Album</FormLabel>
                            <FormControl>
                                <Input placeholder="Album name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    data-testid="genre-selector"
                    control={form.control}
                    name="genres"
                    render={() => (
                        <FormItem>
                            <FormLabel>Genres</FormLabel>
                            <div className="flex flex-wrap items-center gap-2">
                                {selectedGenres.map((genre, index) => (
                                    <Badge
                                        key={index}
                                        className="inline-flex items-center cursor-pointer"
                                        onClick={() => remove(index)}
                                    >
                                        {genre}
                                        <X />
                                    </Badge>
                                ))}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button size="sm" variant="outline" className="inline-flex items-center">
                                            <Plus size={16} className="mr-1" /> Add Genre
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search genres..." />
                                            <CommandEmpty>
                                                No genres found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <ScrollArea className="h-42">
                                                    {genres
                                                        .filter((g) => !selectedGenres.includes(g))
                                                        .map((genreValue) => (
                                                            <CommandItem
                                                                key={genreValue}
                                                                onSelect={() => append(genreValue)}
                                                            >
                                                                {genreValue}
                                                            </CommandItem>
                                                        ))}
                                                </ScrollArea>
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <FormMessage data-testid="error-genre" />
                        </FormItem>
                    )}
                />
                <FormField
                    data-testid="input-cover-image"
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                        <div className="flex gap-3">
                            <FormItem className="w-full">
                                <FormLabel>Cover Image URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://example.com/cover.jpg"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <Image
                                height={86}
                                width={86}
                                src={previewSrc}
                                alt="Cover preview"
                                className="rounded-lg object-cover aspect-square"
                            />
                        </div>
                    )}
                />
                <Button data-testid="submit-button" type="submit">
                    {submitLabel}
                </Button>
            </form>
        </ShadcnForm>
    )
}