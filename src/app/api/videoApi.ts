import { ApiResponse, AnalysisResult } from '../types';

export async function processVideo(
  url: string,
  onProgress: (status: string) => void,
  onComplete: (data: AnalysisResult) => void,
  onError: (error: string) => void
) {
  let response: Response | null = null;
  
  try {
    response = await fetch('/api/process-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('응답에 body가 없습니다.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.trim() && line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6)) as ApiResponse;
            if (data.type === 'complete' && data.data) {
              onComplete(data.data);
              return; // 완료 후 즉시 종료
            } else if (data.type === 'error' && data.error) {
              onError(data.error);
              return; // 에러 발생 시 즉시 종료
            } else if (data.type === 'progress' && data.status) {
              onProgress(data.status);
            }
          } catch (e) {
            console.error('JSON 파싱 오류:', e);
            onError('데이터 처리 중 오류가 발생했습니다.');
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing video:', error);
    onError('요청 처리 중 오류가 발생했습니다.');
  } finally {
    // 스트림을 정리합니다
    if (response?.body && !response.body.locked) {
      try {
        await response.body.cancel();
      } catch (e) {
        console.error('스트림 정리 중 오류:', e);
      }
    }
  }
}