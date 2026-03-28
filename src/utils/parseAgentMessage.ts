import type { ParsedMessage, ConceptOption } from '../types';

export const parseAgentMessage = (raw: string): ParsedMessage => {
  // 완성된 코드블록 + 스트리밍 중 미완성 코드블록 제거
  const textOnly = raw
    .replace(/```json[\s\S]*?```/g, '')  // 완성된 ```json ... ``` 제거
    .replace(/```json[\s\S]*$/g, '')     // 스트리밍 중 미완성 ```json ... 제거
    .replace(/```[\s\S]*?```/g, '')      // 완성된 ``` ... ``` 제거
    .replace(/```[\s\S]*$/g, '')         // 스트리밍 중 미완성 ``` ... 제거
    .trim();

  // JSON 블록 추출 시도 (완성된 코드블록 또는 중괄호 패턴)
  const jsonMatch =
    raw.match(/```json([\s\S]*?)```/) ??
    raw.match(/(\{[\s\S]*\})/);

  if (!jsonMatch) {
    return { type: 'text', text: raw.trim() };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[1].trim());
  } catch {
    // JSON 파싱 실패 → JSON 제거된 텍스트만 표시
    return { type: 'text', text: textOnly || raw.trim() };
  }

  // phase: guideline → 컨셉 선택 카드
  if (parsed.phase === 'guideline' && Array.isArray(parsed.concepts)) {
    return {
      type: 'concepts',
      text: textOnly || '여행 컨셉을 선택해주세요.',
      concepts: parsed.concepts as ConceptOption[],
    };
  }

  // selected_concept → 선택한 컨셉 확인
  if (parsed.selected_concept) {
    return {
      type: 'concept_confirm',
      text: textOnly || '이 컨셉으로 진행할까요?',
      selectedConcept: parsed.selected_concept as ConceptOption,
    };
  }

  // detailed_plan 또는 confirmation === 'detailed_plan'
  if (parsed.detailed_plan || parsed.confirmation === 'detailed_plan') {
    return {
      type: 'plan_confirm',
      text: textOnly || '일정이 확정되었습니다!',
      confirmation: 'detailed_plan',
    };
  }

  // phase: initial + collected → 수집 요약
  if (parsed.phase === 'initial' && parsed.collected) {
    return {
      type: 'collection',
      text: textOnly,
      collected: parsed.collected as Record<string, unknown>,
    };
  }

  // 그 외 → JSON 숨기고 텍스트만 표시
  return { type: 'text', text: textOnly || raw.trim() };
};
