"use client"

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
import { useGenres } from "@/hooks/api/useGenres"
import { z } from "zod"
import Image from "next/image"
import { isValidUrl } from "@/lib/utils"

export function Form({ onSubmit }: { onSubmit: (values: z.infer<typeof trackSchema>) => void }) {
    const { data: genres = [] } = useGenres()

    const form = useForm<z.infer<typeof trackSchema>>({
        resolver: zodResolver(trackSchema),
        defaultValues: {
            title: "",
            artist: "",
            album: "",
            genres: [],
            coverImage: ""
        },
    })

    const { append, remove } = useFieldArray({
        control: form.control,
        name: "genres",
    })

    const selectedGenres = form.watch("genres") || []
    const trackImage = form.watch("coverImage")?.trim();

    const previewSrc =
        trackImage && isValidUrl(trackImage)
            ? trackImage
            : "/track_placeholder.png"

    return (
        <ShadcnForm {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-3"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Track title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Artist</FormLabel>
                            <FormControl>
                                <Input placeholder="Artist name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
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
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
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
                <Button type="submit">Submit</Button>
            </form>
        </ShadcnForm>
    )
}