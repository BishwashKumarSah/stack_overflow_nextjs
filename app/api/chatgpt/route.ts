import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Handle POST requests
export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Generate an answer for ${question}. Give in form of proper HTML content Do not use muliple gap. If there is a code block then use a <pre class="language-javascript"> tag. Here javascript can be any language that you are providing code. It is dynamic. Then use a <code> tag inside and render your code. Each point is enclosed in <p> tags for paragraph separation. Bold text is handled with <strong>. If you writing something inside ** ** then always use a <strong> tag. ALWAYS GIVE ME PROPER HTML FORMAT`
    );
    // console.log(result.response.text());

    return NextResponse.json({ answer: result.response.text() });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
