These files should be placed inside each project folder.

title, description, category, and notes are manually editable.

category values must match your enum: ["residential", "commercial", "institutional", "cultural", "interior", "landscape", "featured"]

The script will automatically generate:

id and slug from folder name (01-sidea-tower → sidea-tower)

imageUrl from cover.jpg

imageUrls from all image files


to run script:
node scripts/generateManifests.js

npx http-server ./images -p 8081 --cors
