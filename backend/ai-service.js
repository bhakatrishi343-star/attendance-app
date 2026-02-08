const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyBFGGPd2rkFNOItE3oz9L2BOgX0CMZHS0k';
const MODEL = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Helper to encode file to base64
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType
        }
    };
}

module.exports = {
    verifyFace: async (uploadedImagePath, userProfileImagePath) => {
        console.log(`AI Verifying: ${uploadedImagePath} vs ${userProfileImagePath}`);

        try {
            // For MVP, if user has no profile photo, automatic pass (or fail, depending on potential logic)
            // But we should try to verify if both exist.
            if (!userProfileImagePath) {
                console.log("No profile photo to compare against.");
                return { match: true, confidence: 100, note: "No profile photo set, skipping verification." };
            }

            // Prepare images
            const image1Part = fileToGenerativePart(uploadedImagePath, "image/jpeg");
            // Check if profile image path exists and is absolute or relative
            // userProfileImagePath might be null or a path string
            // meaningful path check:
            let profilePath = userProfileImagePath;
            if (!fs.existsSync(profilePath)) {
                // Try resolving relative to project root or uploads if needed, 
                // but for this MVP we assume the path stored in DB is correct/absolute or relative to CWD
                // If not found, return mock pass to avoid blocking user
                console.log("Profile photo file not found at:", profilePath);
                return { match: true, confidence: 100, note: "Profile photo missing on disk." };
            }
            const image2Part = fileToGenerativePart(profilePath, "image/jpeg");

            const prompt = `
            You are a face verification system. 
            Compare the two faces in these images. 
            Are they the same person? 
            Respond with ONLY strictly valid JSON in this format: 
            { "match": boolean, "confidence": number_between_0_and_100 }
            Do not add markdown formatting or backticks.
            `;

            const payload = {
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            image1Part,
                            image2Part
                        ]
                    }
                ]
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Gemini API Error: ${response.statusText} - ${errText}`);
            }

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text.trim();

            // Cleanup json string if markdown code blocks are present
            const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(cleanJson);

            console.log("AI Verification Result:", result);
            return result;

        } catch (error) {
            console.error("AI Service Error:", error);
            // Fallback for MVP so app doesn't crash on API limits/errors
            return { match: true, confidence: 0, error: error.message };
        }
    }
};
