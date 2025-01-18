import { NextResponse } from 'next/server';
import {create as createYoutubeDl } from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { TranscriptionResponse, Segment } from '@/app/types';
import { exec } from 'child_process';

const youtubedl = createYoutubeDl('C:/yt-dlp/yt-dlp.exe');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 필요에 따라 추가적인 로깅이나 에러 처리 로직을 여기에 추가할 수 있습니다.
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log('API 호출 시작');
    const { url } = await req.json();
    console.log('받은 URL:', url);
    
    // // 유튜브 메타데이터 가져오기
    // console.log('유튜브 메타데이터 가져오기 시작');
    // const videoInfo = await ytdl.getInfo(url);
    
    // // 멤버십 전용 동영상 체크
    // if (videoInfo.videoDetails.isPrivate) {
    //   return NextResponse.json(
    //     { error: '비공개 동영상은 처리할 수 없습니다.' },
    //     { status: 403 }
    //   );
    // }

    // const { title, description } = videoInfo.videoDetails;
    // console.log('메타데이터:', { title, description });

    // 임시 파일 경로 설정
    const tempDir = path.join(process.cwd(), 'temp');
    console.log('임시 디렉토리 경로:', tempDir);
    if (!fs.existsSync(tempDir)) {
      console.log('임시 디렉토리 생성');
      fs.mkdirSync(tempDir);
    }
    
    // TODO: url 캐시

    // 비디오 다운로드
    const videoPath = path.join(tempDir, `${Date.now()}.webm`);
    await youtubedl(url, {
      output: videoPath,
      format: 'bestvideo+bestaudio/best',
    });

    // 파일 존재 여부 확인
    if (!fs.existsSync(videoPath)) {
      throw new Error(`비디오 파일이 존재하지 않습니다: ${videoPath}`);
    }

    // const audioPath = path.join(tempDir, `${Date.now()}.mp3`);
    // console.log('오디오 파일 경로:', audioPath);

    // // 오디오 다운로드 및 변환
    // await new Promise<void>((resolve, reject) => {
    //   const download = ytdl(url, { filter: 'audioonly' });
    //   const writeStream = fs.createWriteStream(audioPath);

    //   download.pipe(writeStream);

    //   download.on('error', (error) => {
    //     console.error('ytdl 다운로드 오류:', error);
    //     reject(error);
    //   });

    //   writeStream.on('close', resolve);
    //   writeStream.on('error', (error) => {
    //     console.error('파일 쓰기 오류:', error);
    //     reject(error);
    //   });
    // });

    // ffmpeg를 사용하여 오디오 추출
    const audioPath = path.join(tempDir, `${Date.now()}.mp3`);
    await new Promise<void>((resolve, reject) => {
      exec(`ffmpeg -i ${videoPath} -vn -q:a 0 ${audioPath}`, (error: Error | null) => {
        if (error) {
          console.error('ffmpeg 오류:', error);
          reject(error);
        } else {
          console.log('오디오 추출 완료');
          resolve();
        }
      });
    });

    // Whisper API로 음성을 텍스트로 변환
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "verbose_json",
    }) as unknown as TranscriptionResponse;

    // 임시 파일 삭제
    fs.unlinkSync(audioPath);

    // GPT를 사용하여 요약 생성
    const summary = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes video content."
        },
        {
          role: "user",
          content: `다음 텍스트를 한국어로 요약해주세요: ${transcription.text}`
        }
      ]
    });

    return NextResponse.json({
      // title,
      // description,
      summary: summary.choices[0].message.content,
      timestamps: transcription.segments.map((segment: Segment) => ({
        time: new Date(segment.start * 1000).toISOString().substring(11, 19),
        text: segment.text
      }))
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : '동영상 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 