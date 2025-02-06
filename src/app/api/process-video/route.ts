import { NextResponse } from 'next/server';
import { create as createYoutubeDl } from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { TranscriptionResponse, Segment } from '@/app/types';
import { exec } from 'child_process';
import { ProcessingTime } from '@/app/types';
import { z } from 'zod';

const youtubedl = createYoutubeDl('C:/yt-dlp/yt-dlp.exe');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 필요에 따라 추가적인 로깅이나 에러 처리 로직을 여기에 추가할 수 있습니다.
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getTimeInSeconds(startTime: number): number {
  return (Date.now() - startTime) / 1000;
}

export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendProgress = async (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ type: 'progress', status: `[${timestamp}] ${message}` })}\n\n`)
    );
  };

  const processingTimes: ProcessingTime[] = [];
  const totalStartTime = Date.now();
  
  try {
    // 스트림 응답 시작
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    // 비동기 처리 시작
    (async () => {
      try {
        await sendProgress('API 호출 시작');
        const { url } = await req.json();
        await sendProgress('URL 수신 완료');

        // 영상 정보 가져오기
        await sendProgress('영상 정보 가져오기 시작');
        const videoInfoRaw = await youtubedl(url, {
          dumpSingleJson: true,
          noCheckCertificates: true,
          noWarnings: true,
          preferFreeFormats: true,
          addHeader: ['referer:youtube.com', 'user-agent:googlebot']
        });

        await sendProgress('영상 정보 가져오기 완료');

        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }

        // 비디오 다운로드
        const downloadStartTime = Date.now();
        await sendProgress('비디오 다운로드 시작...');
        const videoPath = path.join(tempDir, `${Date.now()}.webm`);
        await youtubedl(url, {
          output: videoPath,
          format: 'bestvideo+bestaudio/best',
        });
        const downloadEndTime = Date.now();
        const downloadDuration = (downloadEndTime - downloadStartTime) / 1000;
        await sendProgress(`비디오 다운로드 완료 (${downloadDuration}초)`);
        processingTimes.push({ 
          step: '비디오 다운로드', 
          duration: downloadDuration,
          startTime: downloadStartTime,
          endTime: downloadEndTime
        });

        // 오디오 추출
        const extractStartTime = Date.now();
        await sendProgress('오디오 추출 시작...');
        const audioPath = path.join(tempDir, `${Date.now()}.mp3`);
        await new Promise<void>((resolve, reject) => {
          exec(`ffmpeg -i ${videoPath} -vn -ab 64k -ac 1 -ar 16000 ${audioPath}`, (error: Error | null, stdout: string, stderr: string) => {
            if (error) {
              console.error('ffmpeg 오류:', error);
              console.error('ffmpeg stderr:', stderr);
              reject(error);
            } else {
              resolve();
            }
          });
        });
        const extractEndTime = Date.now();
        const extractDuration = (extractEndTime - extractStartTime) / 1000;
        await sendProgress(`오디오 추출 완료 (${extractDuration}초)`);
        processingTimes.push({ 
          step: '오디오 추출', 
          duration: extractDuration,
          startTime: extractStartTime,
          endTime: extractEndTime
        });

        // 오디오 분할
        const splitStartTime = Date.now();
        await sendProgress('오디오 분할 시작...');
        const segmentDir = path.join(tempDir, 'segments');
        if (!fs.existsSync(segmentDir)) {
          fs.mkdirSync(segmentDir);
        }
        await new Promise<void>((resolve, reject) => {
          exec(`ffmpeg -i ${audioPath} -f segment -segment_time 600 -c copy ${segmentDir}/output%03d.mp3`, (error: Error | null, stdout: string, stderr: string) => {
            if (error) {
              console.error('ffmpeg 분할 오류:', error);
              console.error('ffmpeg stderr:', stderr);
              reject(error);
            } else {
              resolve();
            }
          });
        });
        const splitEndTime = Date.now();
        const splitDuration = (splitEndTime - splitStartTime) / 1000;
        await sendProgress(`오디오 분할 완료 (${splitDuration}초)`);
        processingTimes.push({ 
          step: '오디오 분할', 
          duration: splitDuration,
          startTime: splitStartTime,
          endTime: splitEndTime
        });

        // Whisper API 처리
        const whisperStartTime = Date.now();
        await sendProgress('음성 인식 시작...');
        const segmentFiles = fs.readdirSync(segmentDir).filter(file => file.endsWith('.mp3'));
        let fullTranscription = '';
        let totalDuration = 0;
        const allSegments: Segment[] = [];

        for (let i = 0; i < segmentFiles.length; i++) {
          const segmentFile = segmentFiles[i];
          await sendProgress(`음성 인식 진행 중... (${i + 1}/${segmentFiles.length})`);
          const segmentPath = path.join(segmentDir, segmentFile);
          const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(segmentPath),
            model: "whisper-1",
            response_format: "verbose_json",
          }) as unknown as TranscriptionResponse;

          transcription.segments.forEach(segment => {
            segment.start += totalDuration;
            segment.end += totalDuration;
            allSegments.push(segment);
          });

          fullTranscription += transcription.text + ' ';
          const segmentDuration = transcription.segments.reduce((acc, segment) => acc + (segment.end - segment.start), 0);
          totalDuration += segmentDuration;
        }
        const whisperEndTime = Date.now();
        const whisperDuration = (whisperEndTime - whisperStartTime) / 1000;
        await sendProgress(`음성 인식 완료 (${whisperDuration}초)`);
        processingTimes.push({ 
          step: '음성 인식', 
          duration: whisperDuration,
          startTime: whisperStartTime,
          endTime: whisperEndTime
        });

        // 임시 파일 삭제
        fs.unlinkSync(audioPath);
        segmentFiles.forEach(file => fs.unlinkSync(path.join(segmentDir, file)));
        fs.rmdirSync(segmentDir);

        // GPT 요약 생성
        const gptStartTime = Date.now();
        await sendProgress('요약 시작...');
        const summary = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes video content."
            },
            {
              role: "user",
              content: `다음 텍스트를 한국어로 요약해주세요: ${fullTranscription}`
            }
          ]
        });
        const gptEndTime = Date.now();
        const gptDuration = (gptEndTime - gptStartTime) / 1000;
        await sendProgress(`요약 완료 (${gptDuration}초)`);
        processingTimes.push({ 
          step: '요약', 
          duration: gptDuration,
          startTime: gptStartTime,
          endTime: gptEndTime
        });

        // 최종 결과 전송
        const result = {
          summary: summary.choices[0].message.content?.trim(),
          timestamps: allSegments.map(segment => ({
            time: new Date(segment.start * 1000).toISOString().substring(11, 19),
            text: segment.text
          })),
          processingTimes,
          totalDuration: (Date.now() - totalStartTime) / 1000,
          videoInfoRaw
        };
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'complete', data: result })}\n\n`)
        );
        await writer.close();
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : '처리 중 오류가 발생했습니다.';
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`)
        );
        await writer.close();
      }
    })();

    return response;
  } catch (err) {
    console.error('스트림 설정 오류:', err);
    return NextResponse.json(
      { error: '스트림 설정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 