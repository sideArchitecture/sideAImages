

per project manifest:

{
"id": "forest-retreat",                     // ✅ Auto: from folder name
"slug": "forest-retreat",                   // ✅ Auto: same as id
"title": "Forest Retreat",                  // 📝 Manual
"description": "A serene escape...",        // 📝 Manual
"category": ["residential"],                // 📝 Manual (from enum)
"notes": "Blends into wooded surroundings", // 📝 Manual
"imageUrl": "cover.jpg",                    // ✅ Auto: default to cover.jpg
"imageUrls": [                              // ✅ Auto: all image files
"image1.jpg",
"image2.jpg"
]
}


[
{
"id": "forest-retreat",                     // ✅ Auto
"slug": "forest-retreat",                   // ✅ Auto
"title": "Forest Retreat",                  // 📝 From project.json
"coverImage": "forest-retreat/cover.jpg",   // ✅ Auto
"imageCount": 9,                            // ✅ Auto
"category": ["residential"]                 // 📝 From project.json
},
...
]


{
"title": "Forest Retreat",
"description": "A serene escape...",
"category": ["residential"],
"notes": "Blends into wooded surroundings"
}


{
"title": "Forest Retreat",
"description": "A serene escape...",
"category": ["residential"],
"notes": "Blends into wooded surroundings"
}
