export type AiSafetyLevel = 'safe' | 'caution' | 'avoid';

export interface AiFoodAdvice {
  level: AiSafetyLevel;
  reason: string;
  alternatives?: string[];
  preparationTips?: string;
}

/**
 * Call OpenAI to judge whether a food is suitable for gastritis and why.
 * Uses a compact model by default; configure via VITE_OPENAI_MODEL.
 * IMPORTANT: Do not commit real API keys. Set VITE_OPENAI_API_KEY locally.
 */
export async function askFoodAdvisor(foodName: string): Promise<AiFoodAdvice> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('OpenAI key missing. Set VITE_OPENAI_API_KEY in your environment.');
  }

  const model = (import.meta.env.VITE_OPENAI_MODEL as string) || 'gpt-5-nano';

  const system =
    '你是胃炎/反流性疾病饮食顾问。基于脾胃虚寒倾向与胃黏膜修复原则进行判断，' +
    '输出严格 JSON，不要多余文字。字段: level(safe|caution|avoid), reason(50~120字), alternatives(最多5个可替代食物数组), preparationTips(简要做法)。';

  const user = `评估食物: ${foodName}\n情境: 糜烂萎缩性胃炎伴轻度肠化，需温软、少油、少刺激，避免生冷及高脂高盐。`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? '{}';
  try {
    const parsed = JSON.parse(content);
    return {
      level: parsed.level ?? 'caution',
      reason: parsed.reason ?? '未提供原因',
      alternatives: parsed.alternatives ?? [],
      preparationTips: parsed.preparationTips ?? '',
    } as AiFoodAdvice;
  } catch {
    // Fallback: simple text mapping
    return {
      level: 'caution',
      reason: content.slice(0, 200),
    };
  }
}


