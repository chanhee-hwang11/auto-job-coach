export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    platform: 'vercel-serverless',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
}
