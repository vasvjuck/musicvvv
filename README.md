# Musicvvv
## ⚙️ Tech Stack
- Next.js
- TypeScript
- React Query
- shadcn
- Tailwind CSS

## 🔋 Features
👉 **Create Track**: add a new track to the library

👉 **Edit Track**: modify metadata (title, artist, album, genres, image) of existing tracks.

👉 **Delete Track**: remove a single track from the library.

👉 **Upload/Remove Track File**: upload a music file to an existing track entry. Ensures only supported file types (MP3, WAV, etc.) and acceptable file sizes are uploaded. Users can remove an uploaded file to replace it. Once uploaded, the track can be played directly via a standard HTML <audio> element

👉 **Play Track**: plays one track at a time.

👉 **Search & Filter**: implemented a debounced search to find tracks by title, artist, or album. Added genre-based filtering options, along with sorting capabilities by date, title, album, and artist — with support for both ascending and descending order.

👉 **Pagination**: added controls to move between pages (e.g., next, previous, specific page numbers).

## Extra Tasks (DONE: ✅)
👉 **Bulk Delete Functionality**: select multiple or all tracks in the library and delete them in a single action. All the logic can be found in `/musicvvv/components/app/actions/BulkActions.tsx`

👉 **Optimistic Updates**: instantly reflect UI changes when an edit operation is triggered, without waiting for server confirmation, to enhance perceived responsiveness. Implemented using React Query's cache manipulation by updating the relevant state based on cache keys. All the logic can be found in `useTrackUpdate` hook - `/musicvvv/hooks/api/useTracks.ts`

👉 **Audiowave Visualization**: display an audio wave visualization for the currently played track, providing visual feedback of the audio in real time. Feature is done with `indicator-line.active` animation in `/musicvvv/app/globals.css`

## Installation

Install the project dependencies using npm:

```bash
npm install
```

**Environment Variables**

Make sure you have .env file in a root of a project 

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Running the Project**

```bash
npm run dev
```