const API_KEY = process.env.REACT_APP_API_KEY;

export async function sendMessageToGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",  // ✅ optional but clearer
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  console.log("Gemini API raw response:", data); // ✅ debug output

  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].content.parts[0].text;
  } else if (data.error) {
    throw new Error(data.error.message || "Unknown API error");
  } else {
    throw new Error("No response from Gemini");
  }
}
