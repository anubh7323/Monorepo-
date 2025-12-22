const axios = require('axios');
const cheerio = require('cheerio');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

// Configuration
const LARAVEL_API = 'http://127.0.0.1:8000/api/articles';

// Mock Services (Replace with real API keys if available)
const MOCK_SERP_API = true;
const MOCK_LLM_API = true;

async function main() {
    console.log('🚀 Starting Node.js Automation Script...');

    try {
        // 1. Fetch Latest Article from Laravel
        console.log('\n📡 Fetching latest article from Laravel...');
        const response = await axios.get(LARAVEL_API);
        const articles = response.data;

        if (!articles || articles.length === 0) {
            console.log('⚠️ No articles found in database to process.');
            return;
        }

        const article = articles[0]; // Process the latest one
        console.log(`✅ Found Article: "${article.title}"`);

        // 2. Search Google (Simulated or Real)
        console.log(`\n🔍 Searching Google for: "${article.title}"...`);
        let searchResults = [];

        if (MOCK_SERP_API) {
            console.log('   (Using Mock SerpAPI results)');
            searchResults = [
                'https://react.dev/blog/2024/02/15/react-19-will-be-compiled',
                'https://vercel.com/blog/review-of-react-19'
            ];
        } else {
            // Real implementation would go here (e.g. using 'google-search-results-nodejs')
        }

        // 3. Scrape & Clean Content (Axios + Cheerio + Readability)
        let researchedContent = "";

        for (const url of searchResults) {
            console.log(`\nspidering 🕷️: ${url}`);
            try {
                // A. Fetch HTML
                const pageResponse = await axios.get(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                });

                // B. Parse & Clean
                const dom = new JSDOM(pageResponse.data, { url: url });
                const reader = new Readability(dom.window.document);
                const articleData = reader.parse();

                if (articleData) {
                    console.log(`   ✅ Extracted: "${articleData.title}" (${articleData.textContent.length} chars)`);
                    researchedContent += `\n--- Source: ${url} ---\n${articleData.textContent.substring(0, 1000)}\n`;
                } else {
                    console.log('   ⚠️ Failed to extract content with Readability.');
                }

            } catch (err) {
                console.log(`   ❌ Failed to fetch/parse: ${err.message}`);
            }
        }

        // 4. Rewrite with LLM (Simulated or Real)
        console.log('\n🤖 Rewriting content with LLM...');
        let newContent = "";

        if (MOCK_LLM_API) {
            newContent = `
            [AI REWRITTEN CONTENT]
            
            Based on recent analysis from ${searchResults.length} sources, here is the updated perspective on "${article.title}".
            
            ${researchedContent.replace(/\n/g, " ").substring(0, 200)}...
            
            (This is a simulated LLM response demonstrating the architecture.)
            `;
            console.log('   (Mock LLM response generated)');
        }

        // 5. Update the Article in Laravel (Phase 1 API)
        console.log(`\n💾 Updating Laravel Database...`);

        try {
            await axios.put(`${LARAVEL_API}/${article.id}`, {
                title: article.title, // Keep original title
                slug: article.slug,   // Keep original slug
                content: newContent,
                is_updated: true,     // Mark as updated
                references: searchResults, // Store sources
                status: 'published'
            });
            console.log(`✅ Success! Article updated.`);
        } catch (error) {
            console.error("❌ Failed to update article:", error.message);
            if (error.response) console.error("Server Response:", error.response.data);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Hint: Is the Laravel server running? (php artisan serve)');
        }
    }
}

main();
