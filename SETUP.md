# AnniverCard — short links setup

This version keeps the existing 7-template builder and changes the receiver-link system to use a real online database.

## What you get

Template customization link:

`https://YOUR-DOMAIN/t/anniversary`

Finished receiver links:

`https://YOUR-DOMAIN/c/Ab7Kp2Q`

The `/c/...` page loads the saved card from Supabase and hides the builder.

## 1. Create a Supabase project

Create a free Supabase project.

Then open **SQL Editor** and run the complete contents of `supabase.sql`.

This creates:
- `cards` table
- public read/insert policies needed by this prototype
- `card-media` storage bucket
- media upload/read policies

## 2. Copy your project credentials

In Supabase, open your project's API settings and copy:
- Project URL
- Publishable/anon public key

Open `index.html` and find:

```js
const ANNIVERCARD_CONFIG = {
  SUPABASE_URL: 'PASTE_YOUR_SUPABASE_PROJECT_URL_HERE',
  SUPABASE_ANON_KEY: 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE',
```

Replace those two values.

IMPORTANT:
- Use only the public/publishable anon key in browser code.
- Never put a service-role/secret key into `index.html`.

## 3. Put it online

Upload the folder containing `index.html` to your static host.

The site needs HTTPS because the voice recorder and speech-recognition features use browser microphone APIs.

## 4. Test

Open:

`https://YOUR-DOMAIN/t/anniversary`

Customize the card.

On Template 7 press:

**Generate short receiver link**

You should get something like:

`https://YOUR-DOMAIN/c/Q7mK2Px`

Open that link in another browser/device.

The recipient should see only the finished card.

## Important architecture note

The short URL does NOT contain the photos, audio, quiz or letter.

The short ID points to the saved card in Supabase. Images/audio are uploaded to Supabase Storage.

This keeps the link short and allows the card to work on another phone.

## Template links later

When more templates are added, use:

`/t/birthday`
`/t/proposal`
`/t/love-letter`
`/t/anniversary`

Each template can have its own slug while sharing the same card database.

## Security / production hardening

This prototype intentionally allows anonymous card creation and reading so a visitor can create and share a card without creating an account.

Before a large public launch, add:
- rate limiting
- CAPTCHA/Turnstile
- file-size limits
- MIME/type validation
- abuse reporting
- card deletion/expiry
- stricter storage policies
- optional creator accounts



### Media included
The finished card stores the creator's photos, memory photos, videos, recorded/uploaded voice message, and optional background music. The short `/c/XXXXXXX` URL is only the card ID; the media is stored separately and loaded when the receiver opens the card.

For large videos, use short/compressed clips during this prototype phase. Browsers may block automatic music playback until the receiver interacts with the page.
