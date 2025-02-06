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
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // 완전한 JSON 라인들을 찾아서 처리
      const lines = buffer.split('\n\n');
      // 마지막 라인이 완전하지 않을 수 있으므로 버퍼에 보관
      buffer = lines.pop() || '';
      
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
            console.error('문제가 발생한 라인:', line);
            if (e instanceof SyntaxError) {
              console.error('JSON 파싱 실패한 데이터 길이:', line.length);
              console.error('JSON 파싱 실패한 데이터 일부:', line.slice(0, 200));
            }
            onError('데이터 처리 중 오류가 발생했습니다.');
          }
        }
      }
    }

    // 스트림이 끝났을 때 버퍼에 남은 데이터 처리
    if (buffer.trim() && buffer.startsWith('data: ')) {
      try {
        const data = JSON.parse(buffer.slice(6)) as ApiResponse;
        if (data.type === 'complete' && data.data) {
          onComplete(data.data);
        } else if (data.type === 'error' && data.error) {
          onError(data.error);
        } else if (data.type === 'progress' && data.status) {
          onProgress(data.status);
        }
      } catch (e) {
        console.error('마지막 버퍼 처리 중 오류:', e);
        onError('데이터 처리 중 오류가 발생했습니다.');
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