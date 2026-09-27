AnniverCard — Netlify-only short links

This version removes the Supabase dependency for receiver links.

Deployment:
1. Upload these files to the same GitHub repository currently connected to Netlify.
2. Netlify will install @netlify/blobs and deploy the two Functions.
3. The creator uses Generate receiver link. The result is /c/7CHARID.
4. The recipient URL loads the saved card from Netlify Blobs.

Notes:
- Images/audio are uploaded individually to Netlify Blobs.
- For this prototype, each individual media file should be under about 4 MB.
- The card data itself is stored as JSON in Netlify Blobs.
- Supabase is not required by this version.
